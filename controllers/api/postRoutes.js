const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/withAuth');

// Create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.json({ newComment, success: true });
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

// Update a comment
router.put('/:id', withAuth, async (req, res) => {
  try {
    await Comment.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(500).send(err);
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    // Delete one comment by its `id` value
    await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(500).send(err);
  }
});

module.exports = router;