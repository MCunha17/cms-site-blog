const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const withAuth = require('../utils/auth');

router.use('/api', apiRoutes);

router.use('/', homeRoutes);
router.use('/dashboard', withAuth, homeRoutes);
router.use('/login', homeRoutes);
router.use('/signup', homeRoutes);

module.exports = router;