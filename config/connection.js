const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'blog_posts',
  'root',
  'Abobora!19',
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
);

module.exports = sequelize;