const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
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
router.get('/post', withAuth, (req, res) => {
  res.render('post', { layout: 'main' });
});

// Handle POST request for /post
router.post('/post', withAuth, async (req, res) => {
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

// Update a blog post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find the post by ID
    const post = await Post.findByPk(id);

    // If the post doesn't exist, return a 404 status
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Update the post with new data
    post.title = title;
    post.content = content;
    await post.save();

    // Return the updated post as a response
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
});

// Delete a blog post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;