// Necessary dependencies
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const withAuth = require('./utils/auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Set up the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure Handlebars as the template engine
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
const sess = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
app.use(session(sess));

// Routes
app.use(routes);

// Sync Sequelize models and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});