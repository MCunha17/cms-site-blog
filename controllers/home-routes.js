const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET Homepage, displaying all posts
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

// GET Login route
router.get('/login', (req, res) => {
  res.render('login', { layout: 'main' });
});

// POST Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(400).json({ message: 'Incorrect username. Please try again!' });
      return;
    }

    const validPassword = await user.checkPassword(password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password. Please try again!' });
      return;
    }

    // Set the user's session to indicate successful login
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      // Redirect the user to the dashboard after successful login
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET Signup route
router.get('/signup', (req, res) => {
  res.render('signup', { layout: 'main' });
});

// POST Signup route
router.post('/signup', async (req, res) => {
  try {
    // Extract the user information from the request body
    const { username, password } = req.body;

    // Create a new user in the database
    const user = await User.create({ username, password });

    // Set the user's session to indicate successful registration
    req.session.user_id = user.id;
    req.session.username = user.username;
    req.session.loggedIn = true;

    // Redirect the user to the dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    // Display an error message on the signup page
    res.render('signup', { layout: 'main', errorMessage: 'Error. Please try again.' });
  }
});

// GET Logout route
router.get('/logout', (req, res) => {
  // Clear the session and log out the user
  req.session.destroy(() => {
    // Redirect to the home page
    res.redirect('/');
  });
});

// GET Display a single post for adding a comment
router.get('/post/:id', withAuth, async (req, res) => {
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

    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: {
        model: User,
        attributes: ['username'],
      },
    });

    res.render('single-post', {
      layout: 'main',
      post: post.get({ plain: true }),
      comments: comments.map((comment) => comment.get({ plain: true })),
      loggedIn: req.session.loggedIn,
      showCommentForm: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to retrieve post.' });
  }
});

// POST Adding a comment to a post
router.post('/post/:id/comments', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;

    const newComment = await Comment.create({
      comment_text: comment,
      user_id: req.session.user_id,
      post_id: postId,
    });

    res.redirect(`/post/${postId}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while adding the comment.' });
  }
});

// GET Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      // If user is not logged in, redirect to the signup page
      return res.redirect('/signup');
    }

    // Find all blog posts for the logged in user
    const userPosts = await User.findOne({
      where: { id: req.session.user_id },
      include: { model: Post }
    });

    const user = userPosts.get({ plain: true });
    const posts = user.posts || [];

    res.render('dashboard', { 
      layout: 'dashlayout',
      posts,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      // If user is not logged in, redirect to the signup page
      return res.redirect('/signup');
    }

    // Find all posts for the logged in user
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

// Render the form for creating a new post
router.get('/dashboard/post/new', withAuth, (req, res) => {
  res.render('new-post', { layout: 'main' });
});

// POST Creating a new post
router.post('/dashboard/post', withAuth, async (req, res) => {
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

// GET Display a single post for updating and deleting
router.get('/post/:id/edit', withAuth, async (req, res) => {
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

    res.render('update-post', {
      layout: 'main',
      post: post.get({ plain: true }),
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to retrieve post.' });
  }
});

// PUT Update a post
router.put('/post/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Find the post by ID
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Ensure that the post belongs to the logged in user
    if (post.user_id !== req.session.user_id) {
      return res.status(403).json({ error: 'Unauthorized access.' });
    }

    // Update the post data
    await post.update({
      title,
      content
    });

    // Redirect the user back to the single post page
    res.redirect(`/post/${postId}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
});

// DELETE a post
router.delete('/dashboard/post/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Ensure that the post belongs to the logged in user
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