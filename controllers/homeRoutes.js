const router = require('express').Router();
const { Post, User } = require('../models');

// Signup route
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('signup', { title: 'Sign Up' });
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login' });
});

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

    // Render the home view and pass the serialized data and login status to the template
    res.render('home', { posts, loggedIn: req.session.logged_in });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;