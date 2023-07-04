const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasMany(Post, {
  // One-to-many association where a User can have multiple Posts 
  foreignKey: 'user_id',
});

Post.belongsTo(User, {
  // Associate a Post with a User using the foreign key 'user_id'
  foreignKey: 'user_id',
});

User.hasMany(Comment, {
  // Create a one-to-many association where a User can have multiple Comments
  foreignKey: 'user_id',
});

Comment.belongsTo(User, {
  // Associate a Comment with a User using the foreign key 'user_id'
  foreignKey: 'user_id',
});

Post.hasMany(Comment, {
  // Create a one-to-many association where a Post can have multiple Comments
  foreignKey: 'post_id',
});

Comment.belongsTo(Post, {
  // Associate a Comment with a Post using the foreign key 'post_id'
  foreignKey: 'post_id',
});

// Export the User, Post, and Comment models as an object
module.exports = { User, Post, Comment };