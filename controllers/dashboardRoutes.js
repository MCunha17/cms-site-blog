const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged-in user
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', { user });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
