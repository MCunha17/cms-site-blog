const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Post = sequelize.define('Post', {
    title: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    content: {
    type: DataTypes.TEXT,
    allowNull: false,
    },
});

module.exports = Post;