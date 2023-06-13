// Necessary dependencies
const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// Home handlebars
router.use('/', homeRoutes);

// API routes
router.use('/api', apiRoutes);

// Exports the router
module.exports = router;