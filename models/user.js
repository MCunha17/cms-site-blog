const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../connection');

const User = sequelize.define('User', {
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
    },
});

// Hash the password before saving it to the database
User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

// Compare the provided password with the hashed password in the database
User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;