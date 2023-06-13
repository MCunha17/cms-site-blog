const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../../utils/auth');

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Fetch all blog posts created by the logged-in user
        const postData = await Post.findAll({
            where: { user_id: req.session.user_id },
            include: [{ model: User }],
            order: [['createdAt', 'DESC']],
        });

    // Serialize the blog post data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the dashboard view and pass the serialized data to the template
    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Renders form to create a new blog post
router.get('/dashboard/new', withAuth, (req, res) => {
  res.render('post-block', { loggedIn: true });
});

// Edit post form route
router.get('/dashboard/edit/:id', withAuth, async (req, res) => {
  try {
    // Fetch the blog post with the specified id
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User }],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    // Serialize the blog post data
    const post = postData.get({ plain: true });

    // Render the edit post form view and pass the serialized data to the template
    res.render('post-block', { post, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

