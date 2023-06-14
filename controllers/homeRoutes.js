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

// Home route
router.get('/', async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const postData = await Post.findAll({
      include: [{ model: User }],
      order: [['createdAt', 'DESC']],
    });

    // Serialize the blog post data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the home view and pass the serialized data and login status to the template
    res.render('home', { posts, loggedIn: req.session.logged_in });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;