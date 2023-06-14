// Handles file paths
const path = require('path');
const express = require('express');
// Manages session
const session = require('express-session');
// Sets up Handlebars view engine
const exphbs = require('express-handlebars');
// Stores session data in the Sequelize database
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Set view engine to use Handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const sess = {
  secret: 'secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// 'Session' middleware
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handle POST request for user signup
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Create a new user using the 'User.create' method from the 'User' model
    const newUser = await User.create({ username, password });
    // Set the 'logged_in' property to 'true' in the session
    req.session.logged_in = true;
    // Redirect to the dashboard or any other desired route
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with an error message or redirect back to the signup page with a message
    res.status(500).json({ error: 'Unable to complete signup.' });
  }
});

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});