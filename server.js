const express = require('express');
const methodOverride = require('method-override');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');

// Create a new Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(methodOverride('_method'));

const sess = {
  // Set a secret for the session
  secret: 'Secret',
  // Set cookie options
  cookie: {},
  // Disable session resaving
  resave: false,
  // Allow uninitialized versions to be saved
  saveUninitialized: true,
  // Set up the session store with the Sequelize connect
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Use express-session middleware to manage sessions
app.use(session(sess));

const hbs = exphbs.create({
  // Include the helpers object for handlebars templates
  helpers: helpers,
});

// Middleware function
const customMiddleware = (req, res, next) => {
  console.log('Custom middleware function is executed');
  next();
};

// Use custom middleware function
app.use(customMiddleware);

// Use express-session middleware to manage sessions
app.use(session(sess));

// Set the handlebars engine for rendering views
app.engine('handlebars', hbs.engine);
// Set the view engine to handlebars
app.set('view engine', 'handlebars');

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes
app.use(routes);
// Use the routes for the /posts route
app.use('/posts', routes);

sequelize.sync({ force: false }).then(() => {
  // Start the server
  app.listen(PORT, () => console.log('Now listening'));
});