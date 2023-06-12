const express = require('express');
const exphbs = require('express-handlebars');
const mysql2 = require('mysql2');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { SequelizeStore } = require('connect-session-sequelize');