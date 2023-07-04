const express = require('express');
const router = express.Router();

// Import all of your route files here
const homeRoutes = require('./home-routes');
const authRoutes = require('./auth-routes');
const dashboardRoutes = require('./dashboard-routes');
const postRoutes = require('./post-routes');

// Use the routes
router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/', dashboardRoutes);
router.use('/', postRoutes);

// Export the router
module.exports = router;