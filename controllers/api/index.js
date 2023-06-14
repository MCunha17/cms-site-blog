const router = require('express').Router();
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const auth = require('../../utils/auth');

router.use('/auth', authRoutes);
router.use('/post', auth, postRoutes);
router.use('/comments', auth, commentRoutes);

module.exports = router;