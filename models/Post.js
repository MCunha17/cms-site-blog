const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for the Post table
class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // Create a foreign key reference to the User table
        model: 'user',
        // Reference the 'id' column in the User table
        key: 'id',
      },
    },
  },
  {
    // Assign the Sequelize connection to the model
    sequelize,
    // Enable timestamps
    timestamps: true,
    // Set the table name to be the same as the model name
    freezeTableName: true,
    underscored: true,
    // Assign the model name
    modelName: 'post',
  }
);

// Export the Post model for use in other files
module.exports = Post;