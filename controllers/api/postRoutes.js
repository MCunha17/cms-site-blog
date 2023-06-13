const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a new post
// Post request to root path ('/') of the router
router.post('/', withAuth, async (req, res) => {
  try {
    // Creates new post using Post.create method from 'Post' model
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      // 'user_id' is set based on authenticated user session
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    // Responds with 404 status code if error occurs
    res.status(400).json(err);
  }
});

// Update a post by ID
// Put request to ':/id' where id represents the id of the post to be updated
router.put('/:id', withAuth, async (req, res) => {
  try {
    // Users 'Post.update' method to update the title and content
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
    // If no rows are updated, responds with 404 error message
    if (updatedRows === 0) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    // If update affects any rows, responds with success message
    res.status(200).json({ message: 'Post updated successfully!' });
    // If erorr occurs, responds with 500 status code
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a post by ID
// Delete request to '/:id' where ':id' represents the id of the post being deleted
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    // If no post is found, responds with 404 status code
    if (!deletedPost) {
      res.status(404).json({ message: 'No post found with this id.' });
      return;
    }
    // If post is deleted, responds with success message
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    // If error occurs, responds with 500 status code
    res.status(500).json(err);
  }
});

// Exports router so it can be used in other files
module.exports = router;