const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Get all posts for the homepage
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const posts = dbPostData.map((post) => post.get({ plain: true }));

    res.render('home', {
      layout: 'main',
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  res.render('login', { layout: 'main' });
});


// Signup route
router.get('/signup', (req, res) => {
  res.render('signup', { layout: 'main' });
});

router.post('/signup', async (req, res) => {
  try {
    // Extract the user information from the request body
    const { username, password } = req.body;

    // Create a new user in the database
    const user = await User.create({ username, password });

    // Set the user's session to indicate successful registration
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      // Redirect the user to the dashboard after successful registration
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    // Display an error message on the signup page
    res.render('signup', { layout: 'main', errorMessage: 'Failed to register. Please try again.' });
  }
});

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      // User is not logged in, redirect to the signup page
      return res.redirect('/signup');
    }

    // Find all blog posts for the logged-in user
    const userPosts = await User.findOne({
      where: { id: req.session.user_id },
      include: { model: Post }
    });

    const user = userPosts.get({ plain: true });
    const posts = user.posts || [];

    res.render('dashboard', { 
      layout: 'main',
      posts,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Render the form for creating a new blog post
router.get('/post/new', withAuth, (req, res) => {
  res.render('new-post', { layout: 'main' });
});

// Handle POST request for /post
router.post('/post/new', withAuth, async (req, res) => {
  try {
    // Extract the post data from the request body
    const { title, content } = req.body;

    // Create a new post using the Post model
    const newPost = await Post.create({
      title,
      content,
      user_id: req.session.user_id,
    });

    // Redirect the user to the dashboard or any other appropriate page
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// Display a single post for commenting (from the home page)
router.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Render the post-view handlebars view and pass the post data
    res.render('post-view', { layout: 'main', post: post.get({ plain: true }), loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the post.' });
  }
});

// Display a single post for updating and deleting (from the dashboard)
router.get('/dashboard/post/:id', withAuth, async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Ensure that the post belongs to the current user
    if (post.user_id !== req.session.user_id) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    // Render the update-post handlebars view and pass the post data
    res.render('update-post', { layout: 'main', post: post.get({ plain: true }), loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the post.' });
  }
});

// Update a post
router.put('/post/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Find the post by ID
    const post = await Post.findByPk(postId);

    // If the post doesn't exist, return a 404 status
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Ensure that the post belongs to the current user
    if (post.user_id !== req.session.user_id) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    // Update the post data
    post.title = title;
    post.content = content;
    await post.save();

    // Redirect the user back to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
});

// Delete a post
router.delete('/post/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findByPk(postId);

    // If the post doesn't exist, return a 404 status
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Ensure that the post belongs to the current user
    if (post.user_id !== req.session.user_id) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    // Delete the post
    await post.destroy();

    // Redirect the user back to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while deleting the post.' });
  }
});

module.exports = router;