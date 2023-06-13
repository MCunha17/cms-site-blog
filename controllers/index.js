const router = require('express').Router();
const apiRoutes = require('./api');
const exphbs = require('express-handlebars');

// API routes
router.use('/api', apiRoutes);

// Export the router
module.exports = router;