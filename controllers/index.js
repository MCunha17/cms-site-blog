const router = require('express').Router();
const apiRoutes = require('./api');

// API routes
router.use('/api', apiRoutes);

// Export the router
module.exports = router;