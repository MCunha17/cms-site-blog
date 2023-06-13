const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../../models');

// GET route for homepage
router.get('/', async (req, res) => {
  try {
    // Fetch all posts with their associated user information
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize the post data
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('home', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET route for single post
router.get('/post/:id', async (req, res) => {
  try {
    // Fetch a single post with its associated user and comment information
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['username'] }],
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    // Serialize the post data
    const post = postData.get({ plain: true });

    res.render('post', {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;