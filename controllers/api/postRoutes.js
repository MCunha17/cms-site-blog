const router = require('express').Router();
const { Post, Comment, User } = require('../../models');

// POST /api/posts
router.post('/', async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.json({ newPost, success: true });
  } catch (err) {
    res.sendStatus(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Post.update(req.body, {
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

router.delete('/:id', async (req, res) => {
  try {
    // delete one post by its `id` value
    await Post.destroy({
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