// models/comment.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false }
    // taskId and userId via associations
  });
};
