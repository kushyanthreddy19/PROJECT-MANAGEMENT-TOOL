const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true  // Explicitly enforce uniqueness
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'planned',
      validate: {
        isIn: [['planned', 'in-progress', 'completed', 'archived']]
      }
    }
  }, {
    // Add model options here
    timestamps: true, // Ensure createdAt and updatedAt are managed
    paranoid: false,  // Disable soft deletes unless needed
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });

  Project.associate = (models) => {
    Project.belongsToMany(models.User, {
      through: 'ProjectAssignments',
      as: 'assignedUsers',
      foreignKey: 'projectId',
      otherKey: 'userId',
      onDelete: 'CASCADE' // Add cascade behavior
    });
    
    Project.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'tasks'
    });
  };

  return Project;
};