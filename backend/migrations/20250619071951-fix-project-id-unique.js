// migrations/20250619071951-fix-project-id-unique.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('PRAGMA foreign_keys=OFF');

    // Begin transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove duplicate or conflicting indexes on Projects.id if any
      await queryInterface.removeIndex('Projects', 'projects_id_unique', { transaction }).catch(() => {});

      // Add unique constraint on Projects.id
      await queryInterface.addIndex('Projects', ['id'], {
        unique: true,
        name: 'projects_id_unique',
        transaction
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    } finally {
      await queryInterface.sequelize.query('PRAGMA foreign_keys=ON');
    }
  },

  async down(queryInterface, Sequelize) {
    // Rollback: remove unique constraint on Projects.id
    await queryInterface.removeIndex('Projects', 'projects_id_unique').catch(() => {});
  }
};
