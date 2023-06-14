const router = require('express').Router();

// Import your route files
const commentRoutes = require('./commentRoutes');
const postRoutes = require('./postRoutes');

// Set up your routes
router.use('/comment', commentRoutes);
router.use('/post', postRoutes);

module.exports = router;