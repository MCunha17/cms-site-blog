const router = require('express').Router();
const { Post, User } = require('../models');

// Signup route
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('signup');
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('login');
});

// Create post route
router.get('/post', (req, res) => {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('createPost');
});

// Dashboard route
router.get('/dashboard', async (req, res) => {
  if (!req.session.logged_in) {
    return res.redirect('/login');
  }
  try {
    const dbPostsData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password', 'email'],
          },
        },
      ],
    });
    const postsData = dbPostsData.map((el) => el.get({ plain: true }));

    res.render('dashboard', {
      title: 'Dashboard',
      postsData: postsData,
      signedIn: req.session.logged_in,
      loggedOut: !req.session.logged_in,
      user: req.session.user_name,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// Edit post route
router.get('/post/edit/:id', async (req, res) => {
  if (!req.session.logged_in) {
    return res.redirect('/login');
  }
  try {
    const dbPostsData = await Post.findByPk(req.params.id);
    const postsData = dbPostsData.get({ plain: true });
    res.render('editPost', {
      title: 'Edit Post',
      postsData: postsData,
      signedIn: req.session.logged_in,
      loggedOut: !req.session.logged_in,
    });
  } catch (error) {
    res.status(404).render('error');
  }
});

// View single post route
// View a single post route
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password', 'email'],
          },
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: {
                exclude: ['password', 'email'],
              },
            },
          ],
        },
      ],
    });
    const postData = dbPostData.get({ plain: true });

    res.render('singlePost', {
      title: 'View Post',
      postData: postData,
      signedIn: req.session.logged_in,
      loggedOut: !req.session.logged_in,
    });
  } catch (error) {
    res.status(404).render('error');
  }
});

module.exports = router;