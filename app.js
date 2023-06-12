const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./config/connection');

const app = express();

// Set up the view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set up the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
const sessionStore = new SequelizeStore({
    db: sequelize,
});
app.use(
    session({
        secret: 'your-secret-key',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
);
sessionStore.sync();

// Parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/posts', postRouter);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});