const asyncWrapper = require("../utilities/wrapper");
const Post = require("../models/posts");

const posts = asyncWrapper(async (req, res) => {
  const { title, content, thumbnail } = req.body;
  const author = req.user.id;
  const post = new Post({ title, content, thumbnail, author });
  await post.save();
  return res.status(201).json({ message: "Post created successfully.", post });
});

const getUserPosts = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ author: userId });
  return res.status(200).json({ posts });
});

module.exports = {
  posts,
  getUserPosts,
};
