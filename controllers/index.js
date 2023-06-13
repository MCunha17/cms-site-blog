const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const exphbs = require('express-handlebars');

// API routes
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

// Export the router
module.exports = router;