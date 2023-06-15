const express = require('express');
const router = express.Router();
const homeRoutes = require('./home-routes');
const withAuth = require('../utils/auth');

router.use('/', homeRoutes);
router.use('/login', homeRoutes);
router.use('/signup', homeRoutes);
router.use('/dashboard', withAuth, homeRoutes);
router.use('/dashboard/post/:id', withAuth, homeRoutes);
router.use('/post', withAuth, homeRoutes);
router.use('/post/:id', withAuth, homeRoutes);
router.use('/post/:id/comments', withAuth, homeRoutes);

module.exports = router;