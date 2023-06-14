// Imports dependencies
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');

// Defines routes for different entities
// 'router.use' method mounts the middleware function specific to each route file
router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/comment', commentRoutes);

// Makes router available to use in other files
module.exports = router;