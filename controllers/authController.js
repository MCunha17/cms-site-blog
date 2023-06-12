const bcrypt = require('bcrypt');
const User = require('../models/user');

// Render signup form
exports.renderSignupForm = (req, res) => {
    res.render('signup');
};

// Handle signup form submission
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username is already taken
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.render('signup', { error: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await User.create({ username, password: hashedPassword });

        res.redirect('/auth/login');
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Render login form
exports.renderLoginForm = (req, res) => {
    res.render('login');
};

// Handle login form submission
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        // Store the user object in the session
        req.session.user = user;

        res.redirect('/');
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Handle logout
exports.logout = (req, res) => {
    // Destroy the session and redirect to the homepage
    req.session.destroy();
    res.redirect('/');
};