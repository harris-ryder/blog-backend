var express = require("express");
var router = express.Router();
const passport = require("passport");

require("../config/passport")(passport);

//IMPORT MODELS
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { default: mongoose } = require("mongoose");

/* GET All Posts. */
router.get("/", function (req, res, next) {
  console.log("hi");
  next();
});

// Get category posts
router.get("/category/:tag", async function (req, res, next) {
  const posts = await Post.find({ tags: req.params.tag })
    .sort({ date: 1 })
    .populate("user")
    .exec();
  res
    .status(200)
    .json({ user: req.user, isAuth: req.isAuthenticated, posts: posts });
});

// Get post
router.get("/:id", async function (req, res, next) {
  const post = await Post.findById(req.params.id)
    .populate("user")
    .populate({
      path: "comments", // 1st level subdoc (get comments)
      populate: {
        // 2nd level subdoc (get users in comments)
        path: "user",
      },
    })
    .exec();
  const trending_posts = await Post.find().limit(4).exec();

  res.json({ user: req.user, isAuth: true, post: post});
});

//Delete post
router.delete("/:id", async function (req, res, next) {
  try {
    console.log(`***${req.params.id}***`);
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting the post");
  }
});

router.post("/:id", async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { public: !post.public } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Unable to update the post" });
    }

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updateing post:", error);
    res.status(500).send("Error updating the post");
  }
});

module.exports = router;
