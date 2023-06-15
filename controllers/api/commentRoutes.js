const router = require('express').Router();
const { Comment } = require('../../models');

router.post('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  // delete one comment by its `id` value
  await Comment.destroy({
    where: {
      id: req.params.id,
    },
  });

  return res.json({ success: true });
});

router.put('/:id', async (req, res) => {
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

module.exports = router;