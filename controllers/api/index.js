const express = require('express');
const router = express.Router();
const userRoutes = require('./user-routes');
const commentRoutes = require('./comment-routes');
const withAuth = require('../../utils/auth');



router.use('/users', userRoutes);
router.use('/comments', withAuth, commentRoutes);


module.exports = router;