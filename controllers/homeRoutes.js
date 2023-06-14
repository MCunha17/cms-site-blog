const router = require('express').Router();
const { Post, User } = require('../models');

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
    res.render('home', { posts, loggedIn: req.session.logged_in, layout: 'main' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;