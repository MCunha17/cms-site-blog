const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET Login route
router.get('/login', (req, res) => {
    // Render the 'login' template with the 'main' layout
    res.render('login', { layout: 'main' });
  });
  
  // POST Login route
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user in the database
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        res.status(400).json({ message: 'Incorrect username. Please try again!' });
        return;
      }
  
      const validPassword = await user.checkPassword(password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password. Please try again!' });
        return;
      }
  
      // Set the user's session to indicate successful login
      req.session.save(() => {
        req.session.user_id = user.id;
        req.session.username = user.username;
        req.session.loggedIn = true;
  
        // Redirect the user to the dashboard after successful login
        res.redirect('/dashboard');
      });
    } catch (err) {
      // Log any errors that occur
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // GET Signup route
  router.get('/signup', (req, res) => {
    // Render the 'signup' template with the 'main' layout
    res.render('signup', { layout: 'main' });
  });
  
  // POST Signup route
  router.post('/signup', async (req, res) => {
    try {
      // Extract the user information from the request body
      const { username, password } = req.body;
  
      // Create a new user in the database
      const user = await User.create({ username, password });
  
      // Set the user's session to indicate successful registration
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;
  
      // Redirect the user to the dashboard
      res.redirect('/dashboard');
    } catch (err) {
      // Log any errors that occur
      console.log(err);
      res.status(500).json(err);
      // Display an error message on the signup page
      res.render('signup', { layout: 'main', errorMessage: 'Error. Please try again.' });
    }
  });
  
  // GET Logout route
  router.get('/logout', (req, res) => {
    // Clear the session and log out the user
    req.session.destroy(() => {
      // Redirect to the login page
      res.redirect('/login');
    });
  });

// Export the router for use in other files
module.exports = router;