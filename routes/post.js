const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Display a blog post
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    res.render('blogpost', { blogPost });
});

// Leave a comment on a blog post
router.post('/:postId/comment', (req, res) => {
    const postId = req.params.postId;
    const { comment } = req.body;

    res.redirect(`/posts/${postId}`);
});

module.exports = router;