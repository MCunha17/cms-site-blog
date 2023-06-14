// Necessary dependencies
const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api');

// Home handlebars
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

// Exports the router
module.exports = router;