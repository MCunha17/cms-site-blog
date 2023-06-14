// Necessary dependencies
const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const authRoutes = require('./authRoutes');
const apiRoutes = require('./api');

// Home routes
router.use('/', homeRoutes);

// Dashboard routes
router.use('/', dashboardRoutes);
router.use('/', authRoutes);

// API routes
router.use('/api', apiRoutes);

// Exports the router
module.exports = router;