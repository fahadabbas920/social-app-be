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
  const { user } = req;
  
  let posts;
  if (user.role === "Admin") {
    posts = await Post.find().populate("author", "username");
  } else {
    posts = await Post.find({ author: userId }).populate("author", "username");
  }
  return res.status(200).json({ posts });
});

module.exports = {
  posts,
  getUserPosts,
};
