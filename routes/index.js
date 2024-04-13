var express = require("express");
var router = express.Router();
const passport = require("passport");
require("../config/passport")(passport); // as strategy in ./passport.js needs passport object
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//IMPORT MODELS
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

router.get(
  "/",
  passport.authenticate("jwtOptional", { session: false }),
  async function (req, res, next) {
    const posts = await Post.find()
      .sort({ date: 1 })
      .limit(10)
      .populate("user")
      .populate("comments")
      .exec();
    res
      .status(200)
      .json({ user: req.user, isAuth: req.isAuthenticated, posts: posts });
  }
);

//Create a post
router.get("/create",passport.authenticate("jwtOptional", { session: false }), async function (req, res, next) {
    res
      .status(200)
      .json({ user: req.user, isAuth: req.isAuthenticated });
});

//Post article
router.post("/create", passport.authenticate("jwt", { session: false }), upload.single("image"), async function (req, res, next) {
    try {
      console.log("Uploaded file details:", req.file);
      // Assuming your Post model has fields named title, text, and optionally file
      console.log(req.body.tags);
      const post = new Post({
        title: req.body.title, // Changed from name to title
        text: req.body.text, // Changed from description to text
        date: new Date(),
        tags: req.body.tags.split(","), // Changed to use a tag field, ensure this is correct
        file: req.file ? req.file.buffer : null, // Handling the case where a file might not be uploaded
        user: req.user.id,
        imageOwner: req.body.imageOwner,
    });

      await post.save();
      res.status(201).json({ message: "Post created successfully", post });

    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).send("Error creating the post");
    }
  });

//For Development
router.get("/grab", async function (req, res, next) {
  
    const posts = await Post.find()
    .sort({ date: 1 })
    .exec();

  res.status(200).json(posts);

});

//FOR NAVBAR
router.get("/nav", async function (req,res,next) {
    const posts = await Post.find().limit(2).exec();

    res.status(200).json(posts);
});

module.exports = router;
