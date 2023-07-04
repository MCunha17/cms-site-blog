const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        // Hash the user's password before creating the record
        user.password = await bcrypt.hash(user.password, 10);
        return user;
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          // Hash the user's password before updating the record (if the password is being changed)
          user.password = await bcrypt.hash(user.password, 10);
        }
        return user;
      },
    },
    // Assign the sequelize connection to the model
    sequelize,
    // Disable timestamps
    timestamps: false,
    // Set the table name to be the same as the model name
    freezeTableName: true,
    underscored: true,
    // Assign the model name
    modelName: 'user',
  }
);

// Export the User model for use in other files
module.exports = User;