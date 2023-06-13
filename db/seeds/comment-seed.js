const { Comment } = require('../models');

const commentData = [
  {
    content: 'Great post!',
    user_id: 1,
    post_id: 1,
  },
  {
    content: 'Thanks for sharing!',
    user_id: 2,
    post_id: 1,
  },
  {
    content: 'I have a question. Can you explain further?',
    user_id: 3,
    post_id: 2,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;