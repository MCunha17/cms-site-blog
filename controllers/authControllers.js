const router = require('express').Router();
const User = require('../models/User');

const authControllers = {
    // Login controller function
    login: async (req, res) => {
        try {
        // Extract username and password from the request
        const { username, password } = req.body;

        // Try to find user with the entered username
        const user = await User.findOne({ where: { username } });

        // If no user found, send error message
        if (!user) {
            res.status(400).json({ message: 'Incorrect username. Please try again!' });
            return;
        }

        // Check if the entered password is correct
        const validPassword = await user.checkPassword(password);

        // If the password is incorrect, send back an error message
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password. Please try again!' });
            return;
        }

        // If correct, create a session for the user
        req.session.user_id = user.id;
        req.session.loggedIn = true;

        // Redirect user to the homepage
        res.redirect('/homepage');
        } catch (error) {
        // If error, send server error message
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the login request' });
        }
    },

    // Signup controller function
    signup: async (req, res) => {
        try {
        // Extract username and password from the request
        const { username, email, password } = req.body;
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        // If the username is taken, send back an error message
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists. Please choose a different username!' });
            return;
        }
        // Create a new user with the provided username, email and password
        const newUser = await User.create({ username, email, password });
        // Create a session for the new user
        req.session.user_id = newUser.id;
        req.session.loggedIn = true;
        // Redirect the user to the homepage
        res.redirect('/homepage');
        } catch (error) {
        // If error, send server error message
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the signup request' });
        }
    },

    // Logout controller function
    logout: (req, res) => {
        // Check if the user is already logged in
        if (req.session.loggedIn) {
          // If so, end the session
          req.session.destroy(() => {
            // And redirect to the '/' route
            res.redirect('/');
          });
        } else {
          // If the user is not logged in, simply redirect to the '/' route
          res.redirect('/');
        }
    },
};    

// Export the controllers
module.exports = authControllers;