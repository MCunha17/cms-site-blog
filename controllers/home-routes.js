const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

// GET Homepage, displaying all posts
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

module.exports = router;