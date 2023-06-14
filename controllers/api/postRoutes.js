const router = require('express').Router();
const { Post } = require('../../models');
const requireAuth = require('../../utils/auth');

// Post request to root path ('/post') of the router
router.post('/post', requireAuth, async (req, res) => {
  try {
    // Creates new post using Post.create method from 'Post' model
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      // 'user_id' is set based on authenticated user session
      user_id: req.session.user_id,
    });
    
    // Redirect to the dashboard view after creating the post
    res.redirect('/dashboard');
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a post by ID
// Put request to 'post/:id' where id represents the id of the post to be updated
router.put('/post/:id', requireAuth, async (req, res) => {
  try {
    // Use 'Post.update' method to update the title and content
    const [updatedRows] = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    // If no rows are updated, respond with 404 error message
    if (updatedRows === 0) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    // If the update affects any rows, respond with a success message
    res.status(200).json({ message: 'Post updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a post by ID
// Delete request to '/post/:id' where ':id' represents the id of the post being deleted
router.delete('/post/:id', requireAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    // If no post is found, respond with 404 status code
    if (!deletedPost) {
      res.status(404).json({ message: 'No post found with this id.' });
      return;
    }
    // If the post is deleted, respond with a success message
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    // If an error occurs, respond with 500 status code
    res.status(500).json(err);
  }
});

module.exports = router;