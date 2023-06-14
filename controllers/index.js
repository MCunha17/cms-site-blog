const router = require('express').Router();

// Import your route files
const homeRoutes = require('./homeRoutes');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const apiRoutes = require('./api');

// Set up your routes
router.use('/', homeRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

module.exports = router;