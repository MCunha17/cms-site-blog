const router = require('express').Router();
const apiRoutes = require('./api');

// Root route
router.get('/', (req, res) => {
    res.render('home.handlebars');
});

// API routes
router.use('/api', apiRoutes);

// Export the router
module.exports = router;