const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up sessions
app.use(
  session({
    secret: 'your-secret-session-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Set up Handlebars.js as the view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Routes
const controllers = require('./controllers');
app.use(controllers);

// Database sync
const db = require('./db/models');
db.sequelize.sync({ force: false }).then(() => {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});