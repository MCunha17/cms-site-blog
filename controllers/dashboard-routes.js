const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// GET Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
      if (!req.session.loggedIn) {
        // If user is not logged in, redirect to the signup page
        return res.redirect('/signup');
      }
  
      // Find all posts for the logged in user
      const userPosts = await User.findOne({
        where: { id: req.session.user_id },
        include: { model: Post }
      });
  
      // Extract plain JavaScript object from the fetched data
      const user = userPosts.get({ plain: true });
      // Extract the posts associated with the user
      const posts = user.posts || [];
  
      // Render the 'dashboard' template and pass data to it
      res.render('dashboard', {
        // Use the 'main' layout for the template
        layout: 'main',
        // Pass the user's posts to the template
        posts,
        // Pass the login status to the template
        loggedIn: req.session.loggedIn
      });
    } catch (err) {
      // Log any errors that occur
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // Render the form for creating a new post
  router.get('/dashboard/post/new', withAuth, (req, res) => {
    res.render('new-post', { layout: 'main' });
  });
  
  // POST Creating a new post
  router.post('/dashboard/post', withAuth, async (req, res) => {
    try {
      // Extract the post data from the request body
      const { title, content } = req.body;
  
      // Create a new post using the Post model
      const newPost = await Post.create({
        title,
        content,
        user_id: req.session.user_id,
      });
  
      // Redirect the user to the dashboard
      res.redirect('/dashboard');
    } catch (err) {
      // Log any errors that occur
      console.log(err);
      res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
  });

// Export the router for use in other files
module.exports = router;