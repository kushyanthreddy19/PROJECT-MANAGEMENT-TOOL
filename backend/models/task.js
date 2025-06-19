// models/task.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    deadline: DataTypes.DATE,
    projectId: DataTypes.INTEGER,
    assignedTo: DataTypes.INTEGER,
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedUser' });
    Task.belongsTo(models.Project, { foreignKey: 'projectId' });
    Task.hasMany(models.Comment, { foreignKey: 'taskId', as: 'comments' });
  };

  return Task;
};
