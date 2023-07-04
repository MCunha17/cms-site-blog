const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

// GET Homepage, displaying all posts
router.get('/', async (req, res) => {
  try {
    // Fetch all posts from the database
    const dbPostData = await Post.findAll({
      include: [
        {
          // User model to retrieve the associated username
          model: User,
          // Only select the username attribute
          attributes: ['username'],
        },
      ],
      // Sorting the posts by their creation date in descending order
      order: [['createdAt', 'DESC']],
    });

    // Extract plain JavaScript objects from the fetched data
    const posts = dbPostData.map((post) => post.get({ plain: true }));

    // Render the 'home' template and passing data to it
    res.render('home', {
      // Use the 'main' layout for the template
      layout: 'main',
      // Pass the retrieved posts to the template
      posts,
    });
  } catch (err) {
    // Log any errors that occur
    console.log(err);
    res.status(500).json(err);
  }
});

// Export the router for use in other files
module.exports = router;