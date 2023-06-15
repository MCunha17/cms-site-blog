const { Comment } = require('../models');

const commentdata = [
    {
      "content": "First comment on post 1.",
      "user_id": 1,
      "post_id": 1
    },
    {
      "content": "Second comment on post 1.",
      "user_id": 2,
      "post_id": 1
    },
    {
      "content": "First comment on post 2.",
      "user_id": 1,
      "post_id": 2
    },
    {
      "content": "Second comment on post 2.",
      "user_id": 3,
      "post_id": 2
    }
]

const seedComments = () => Comment.bulkCreate(commentdata);

module.exports = seedComments;