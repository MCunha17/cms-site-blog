const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./html');

// API routes
router.use('/api', apiRoutes);

// Home routes
router.use('/', homeRoutes);

// Export the router
module.exports = router;