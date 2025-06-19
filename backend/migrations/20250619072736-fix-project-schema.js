// migrations/XXXXXXXXXXXXXX-fix-project-schema.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('PRAGMA foreign_keys=OFF');

    // Drop Projects_backup table if exists to avoid unique constraint errors
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS Projects_backup');

    // Temporarily drop foreign key constraints on dependent tables
    await queryInterface.removeConstraint('Tasks', 'tasks_projectId_fkey').catch(() => {});
    await queryInterface.removeConstraint('ProjectAssignments', 'projectAssignments_projectId_fkey').catch(() => {});

    // Begin transaction
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Check if Projects table exists
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('Projects')) {
        // Create Projects table if it does not exist
        await queryInterface.createTable('Projects', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          dueDate: {
            type: Sequelize.DATE,
            allowNull: true
          },
          status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'planned'
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
          }
        }, { transaction });

        // Commit transaction and return early
        await transaction.commit();
        await queryInterface.sequelize.query('PRAGMA foreign_keys=ON');
        return;
      }

      // 1. Create temporary table with new schema
      await queryInterface.createTable('Projects_new', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        dueDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'planned'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // 2. Copy data from old table to new table
      await queryInterface.sequelize.query(`
        INSERT INTO Projects_new (id, name, description, dueDate, status, createdAt, updatedAt)
        SELECT 
          id, 
          name, 
          description, 
          dueDate, 
          COALESCE(status, 'planned') as status,
          createdAt, 
          updatedAt 
        FROM Projects
      `, { transaction });

      // 3. Drop old table
      await queryInterface.dropTable('Projects', { transaction });

      // 4. Rename new table
      await queryInterface.renameTable('Projects_new', 'Projects', { transaction });

      // 5. Recreate indexes
      await queryInterface.addIndex('Projects', ['id'], {
        unique: true,
        name: 'projects_id_unique',
        transaction
      });

      // Commit transaction
      await transaction.commit();

      // Re-add foreign key constraints on dependent tables
      await queryInterface.addConstraint('Tasks', {
        fields: ['projectId'],
        type: 'foreign key',
        name: 'tasks_projectId_fkey',
        references: {
          table: 'Projects',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }, { transaction });

      await queryInterface.addConstraint('ProjectAssignments', {
        fields: ['projectId'],
        type: 'foreign key',
        name: 'projectAssignments_projectId_fkey',
        references: {
          table: 'Projects',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }, { transaction });

    } catch (err) {
      // Rollback transaction if error occurs
      await transaction.rollback();
      throw err;
    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('PRAGMA foreign_keys=ON');
    }
  },

  async down(queryInterface, Sequelize) {
    // Rollback implementation (optional)
  }
};
