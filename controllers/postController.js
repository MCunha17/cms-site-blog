const Post = require('../models/post');
const Comment = require('../models/comment');

// Display a blog post
exports.showPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Retrieve the blog post from the database based on the postId
        const blogPost = await Post.findByPk(postId, { include: Comment });

        res.render('blogpost', { blogPost });
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Leave a comment on a blog post
exports.leaveComment = async (req, res) => {
    try {
        const postId = req.params.postId;
         { comment } = req.body;

        // Save the comment in the database
        await Comment.create({
            content: comment,
            postId,
            userId: req.session.user.id, // Assuming user information is stored in the session
            });

    // Redirect back to the blog post page
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Display the dashboard and list of user's blog posts
exports.dashboard = async (req, res) => {
    try {
        // Retrieve the user's blog posts from the database
        const userId = req.session.user.id; // Assuming user information is stored in the session
        const blogPosts = await Post.findAll({ where: { userId } });

        res.render('dashboard', { blogPosts });
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Create a new blog post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Create a new blog post in the database
        await Post.create({
            title,
            content,
            userId: req.session.user.id, // Assuming user information is stored in the session
        });

    // Redirect back to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Delete the blog post from the database
        await Post.destroy({ where: { id: postId } });

        // Redirect back to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};

// Update a blog post
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;

        // Update the blog post in the database
        await Post.update({ title, content }, { where: { id: postId } });

        // Redirect back to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        res.render('error', { error: 'An error occurred' });
    }
};