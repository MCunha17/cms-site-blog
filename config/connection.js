const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if a JAWSDB_URL environment variable is available (indicating a Heroku deployment)
if (process.env.JAWSDB_URL) {
  // Set up Sequelize connection using the JAWSDB_URL
  sequelize = new Sequelize(process.env.JAWSDB_URL, {
    dialect: 'mysql'
  });
} else {
  // Set up Sequelize connection using the local environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT,
      apiKey: process.env.API_KEY,
    }
  );
}

module.exports = sequelize;