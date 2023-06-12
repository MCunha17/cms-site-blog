const Post = require('../models/Post');

// Handle homepage request
exports.homepage = async (req, res) => {
    try {
        // Retrieve existing blog posts from the database
        const blogPosts = await Post.findAll();

        res.render('homepage', { blogPosts });
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
  }
};

// Handle navigation links request
exports.navigation = (req, res) => {
    if (req.session.user) {
        // User is logged in
        res.render('navigation-loggedin');
    } else {
        // User is not logged in
        res.render('navigation-loggedout');
    }
};