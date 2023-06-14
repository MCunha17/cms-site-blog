const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get comments
// Renders 'comment-block' view if users are logged in with withAuth middleware
router.post('/', requireAuth, (req, res) => {
  res.render('comment-block', { loggedIn: true });
});

// Create a new comment
// Protected route with withAuth middleware to ensure users are authenticated/logged in
router.post('/create', requireAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a comment by ID
// Protected route with withAuth middleware to ensure users are authenticated/logged in
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id.' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;