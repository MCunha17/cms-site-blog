// Necessary dependencies
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Set up the Express app
const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'Secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const hbs = exphbs.create();

// Middleware function
const customMiddleware = (req, res, next) => {
  console.log('Custom middleware function is executed');
  next();
};

app.use(customMiddleware);

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
app.use('/posts', routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});