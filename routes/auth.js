const express = require('express');
const router = express.Router();
const { hashPassword, authenticateUser } = require('../utils/authentication');
const User = require('../models/user');

// Sign up route
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Sign up route (form sbumissions)
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

    // Check if the username is already taken
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).render('signup', { error: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user in the database
        await User.create({ username, password: hashedPassword });

        res.redirect('/login');
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred' });
    }
});

// Login route (login form)
router.get('/login', (req, res) => {
    res.render('login');
});

// Login route (form submission)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Authenticate user
        const user = await authenticateUser(username, password);
        if (!user) {
            return res.status(401).render('login', { error: 'Invalid username or password' });
        }

        // Store the user object in the session
        req.session.user = user;

        res.redirect('/');
    } catch (error) {
        res.status(500).render('error', { error: 'An error occurred' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    // Destroy the session and redirect to the homepage
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;