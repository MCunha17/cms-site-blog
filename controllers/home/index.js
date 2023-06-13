const router = require('express').Router();
const dashboardRoutes = require('./dashboardRoutes');
const homeRoutes = require('./homeRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/home', homeRoutes);

module.exports = router;