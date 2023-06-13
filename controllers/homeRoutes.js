const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// Renders homepage view
router.get('/', async (req, res) => {
  try {
    // Fetches all blog posts from the database
    const postData = await Post.findAll({
      // Includes the 'User' model to access user information associated with each post
      include: [{ model: User }],
      order: [['createdAt', 'DESC']],
    });

    // Serialize the blog post data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the homepage view and pass the serialized data to the template
    res.render('home', { posts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Dashboard route, renders dashboard view template
router.get('/dashboard', async (req, res) => {
  res.render('dashboard');
});

// Login route, renders login view template
router.get('/login', async (req, res) => {
  res.render('login');
});

// Signup route, renders signup view template
router.get('/signup', async (req, res) => {
  res.render('signup');
});

module.exports = router;