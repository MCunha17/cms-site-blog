const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');

// Handle POST request for /post
router.post('/post', withAuth, async (req, res) => {
  try {
    // Extract the post data from the request body
    const { title, content } = req.body;

    // Create a new post using the Post model
    const newPost = await Post.create({
      title,
      content,
      user_id: req.session.user_id,
    });

    // Redirect the user to the dashboard or any other appropriate page
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// Update a blog post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find the post by ID
    const post = await Post.findByPk(id);

    // If the post doesn't exist, return a 404 status
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Update the post with new data
    post.title = title;
    post.content = content;
    await post.save();

    // Return the updated post as a response
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
});

// Delete a blog post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;