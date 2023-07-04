const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for the Comment table
class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment_text: {
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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // Create a foreign key reference to the Post table
        model: 'post',
        // Reference the 'id' column in the Post table
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
    modelName: 'comment',
  }
);

// Export the Comment model for use in other files
module.exports = Comment;