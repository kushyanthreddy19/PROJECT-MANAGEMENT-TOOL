// models/userStory.js
module.exports = (sequelize, DataTypes) => {
  const UserStory = sequelize.define('UserStory', {
    content: { type: DataTypes.TEXT, allowNull: false },
    projectId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return UserStory;
};
