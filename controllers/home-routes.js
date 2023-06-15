const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// Get all posts for the homepage
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const posts = dbPostData.map((post) => post.get({ plain: true }));

    res.render('home', {
      layout: 'main',
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  res.render('login', { layout: 'main' });
});

// Signup route
router.get('/signup', (req, res) => {
  res.render('signup', { layout: 'main' });
});

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      // User is not logged in, redirect to the signup page
      return res.redirect('/signup');
    }

    // Find all blog posts for the logged-in user
    const userPosts = await User.findOne({
      where: { id: req.session.user_id },
      include: { model: Post }
    });

    const user = userPosts.get({ plain: true });
    const posts = user.posts || [];

    res.render('dashboard', { 
      layout: 'main',
      posts,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});  

module.exports = router;