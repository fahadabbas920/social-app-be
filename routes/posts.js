const express = require("express");
const router = express.Router();
const {posts, getUserPosts} = require("../controllers/posts")

router.route("/").post(posts);
router.route("/:userId/posts").get(getUserPosts);

module.exports = router;