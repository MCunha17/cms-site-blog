const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id);
    const postsData = await Post.findAll({ where: { user_id: req.session.user_id } });

    const user = userData.get({ plain: true });
    const posts = postsData.map((post) => post.get({ plain: true }));

    res.render('dashboard', { user, posts, loggedIn: req.session.logged_in});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User }],
    });

    const post = postData.get({ plain: true });

    res.render('edit-post', { post, loggedIn: req.session.logged_in });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/new', withAuth, (req, res) => {
  res.render('new-post', { loggedIn: req.session.logged_in });
});

module.exports = router;