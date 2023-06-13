const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// Home route
router.get('/', async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const postData = await Post.findAll({
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

// Login route
router.get('/login', async (req, res) => {
  res.render('login');
});

// Signup route
router.get('/signup', async (req, res) => {
  res.render('signup');
});

module.exports = router;