const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET Display a single post for adding a comment
router.get('/post/:id', withAuth, async (req, res) => {
    try {
      const postId = req.params.id;
      // Find the post by ID
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            include: {
              model: User,
              attributes: ['username'],
            },
          },
        ],
      });
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
  
      const comments = await Comment.findAll({
        where: { post_id: postId },
        include: {
          model: User,
          attributes: ['username'],
        },
      });
  
      res.render('single-post', {
        layout: 'main',
        post: post.get({ plain: true }),
        comments: comments.map((comment) => comment.get({ plain: true })),
        loggedIn: req.session.loggedIn,
        showCommentForm: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Unable to retrieve post.' });
    }
  });
  
  // POST Adding a comment to a post
  router.post('/post/:id/comments', withAuth, async (req, res) => {
    try {
      const postId = req.params.id;
      const { comment } = req.body;
  
      const newComment = await Comment.create({
        comment_text: comment,
        user_id: req.session.user_id,
        post_id: postId,
      });
  
      const user = await User.findByPk(req.session.user_id);
  
      res.json({
        username: user.username,
        createdAt: newComment.createdAt,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while adding the comment.' });
    }
  });

// GET Display a single post for updating and deleting
router.get('/dashboard/post/:id/edit', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    // Find the post by ID
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });
  
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
  
    res.render('update-post', {
      layout: 'main',
      post: post.get({ plain: true }),
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    // Log any errors that occur
    console.log(err);
    res.status(500).json({ error: 'Unable to retrieve post.' });
  }
});
  
// PUT Update a post
router.put('/dashboard/post/:id/edit', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
  
    // Find the post by ID
    const post = await Post.findByPk(postId);
  
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
  
    // Ensure that the post belongs to the logged in user
    if (post.user_id !== req.session.user_id) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }
  
    // Update the post data
    await post.update({
      title,
      content
    });
  
    // Redirect the user back to the dashboard
    res.redirect(`/dashboard`);
  } catch (err) {
    // Log any errors that occur
    console.log(err);
    res.status(500).json({ error: 'Unable to update post.' });
  }
});
  
// DELETE a post
router.delete('/dashboard/post/:id/edit', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
  
    // Find the post by ID
    const post = await Post.findByPk(postId);
  
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
  
    // Ensure that the post belongs to the logged in user
    if (post.user_id !== req.session.user_id) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }
  
    // Delete the post
    await post.destroy();
  
    // Redirect the user back to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to delet post.' });
  }
});

// Export the router for user in other files
module.exports = router;