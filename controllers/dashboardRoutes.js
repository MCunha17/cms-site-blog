const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// Dashboard route
router.get('/', withAuth, async (req, res) => {
  try {
    // Fetch data needed for the dashboard from your models or database
    const userData = await User.findByPk(req.session.user_id);
    const postsData = await Post.findAll({ where: { user_id: req.session.user_id } });

    // Render the dashboard view and pass the fetched data to the template
    res.render('dashboard', { user: userData, posts: postsData, loggedIn: req.session.logged_in });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;