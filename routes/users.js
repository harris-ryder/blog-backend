var express = require('express');
var router = express.Router();

//IMPORT MODELS
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// Get user posts
router.get("/:id", async function (req, res, next) {
  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  const postsbyUser = await Post.find({ user: req.params.id}).exec();   
  res.json({user: user, posts: postsbyUser});
});

module.exports = router;
