const router = require('express').Router();
const { Post } = require('../../models');
const { authMiddleware } = require('../../middleware');

// authMiddleware
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
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

    if (updatedRows === 0) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Post updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;