const express = require('express');
const router = express.Router();
const withAuth = require('../utils/auth');
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');

router.use(withAuth);
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;