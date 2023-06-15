const router = require('express').Router();
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const auth = require('../../utils/auth');

router.use('/auths', authRoutes);
router.use('/posts', auth, postRoutes);
router.use('/comments', auth, commentRoutes);

module.exports = router;