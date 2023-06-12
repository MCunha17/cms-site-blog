const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../utils/auth');

// Homepage route
router.get('/', (req, res) => {
    // Retrieve existing blog posts
    const blogPosts = [];
    res.render('homepage', { blogPosts });
});

// Navigation links route
router.get('/navigation', (req, res) => {
    if (req.session.user) {
        // User is logged in
        res.render('navigation-loggedin');
    } else {
        // User is not logged in
        res.render('navigation-loggedout');
    }
});

module.exports = router;