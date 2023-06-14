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

    // Render the home view and pass the serialized data and login status to the template
    res.render('home', { posts, loggedIn: req.session.logged_in });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST route for user signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Create a new user using the 'User.create' method from the 'User' model
    const newUser = await User.create({ username, password });
    // Set the 'logged_in' property to 'true' in the session
    req.session.logged_in = true;
    // Redirects to the '/dashboard' route
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    // If an error occurs, respond with an error message or redirect back to the signup page with a message
    res.status(500).json({ error: 'Unable to complete signup.' });
  }
});

// Dashboard route
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch all blog posts created by the logged-in user
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User }],
      order: [['createdAt', 'DESC']],
    });

    // Serialize the blog post data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the dashboard view and pass the serialized data and login status to the template
    res.render('dashboard', { posts, loggedIn: req.session.logged_in });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', async (req, res) => {
  res.render('login');
});

// Logout route
router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;