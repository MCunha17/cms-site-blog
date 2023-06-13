const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home');

// API routes
router.use('/api', apiRoutes);

// Home routes
router.use('/home', homeRoutes);

// Export the router
module.exports = router;