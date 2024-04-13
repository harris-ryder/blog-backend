var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const passport = require('passport');
require('../config/passport')(passport) // as strategy in ./passport.js needs passport object


//PASSWORD HASHER
const genHash = require("../config/passwordUtils").genHash;
const validatePassword  = require('../config/passwordUtils').validatePassword;



//IMPORT MODELS
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

//GET ACCOUNT DETAILS
router.get('/', passport.authenticate('jwt',{session: false}), async function(req, res, next) {

  
    let posts = await Post.find({user: req.user._id});
    res.status(200).json({user: req.user, isAuth: true, posts: posts});

});

//LOGIN GET
router.get('/login', (req, res, next) => {
  next();
}, passport.authenticate('jwtOptional', {session: false}), async function(req, res, next) {
  //Not protected - produces login form
    //Not protected - produces login form
    res.status(200).json({user: req.user, isAuth: req.isAuthenticated});
});


router.post('/login', function(req,res,next) {
    
        const user = User.findOne({ username: req.body.username })
        .then((user) => {

            if (!user) {
                return res.status(401).send('Unauthorized');;
              };

              const isValid = validatePassword(req.body.password, user.hash);

              if (isValid) {

                jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {expiresIn: '1800s'}, (err, token) => {
                    if (err) {
                        return res.status(500).json({ message: "Error generating token" });
                    }
                    res.status(200).json({user: user, isAuth: true, token});

                });

               
            } else {
                res.status(401).json({msg: "You entered the wrong passcode"});
            }

        }).catch((err) => {
            res.status(401).json({msg: "You entered the wrong username"});

        })
})

//SIGN UP---------------------------------------------
router.get('/signup', passport.authenticate('jwtOptional', {session: false}), async function(req, res, next) {
  res.status(200).json({user: req.user, isAuth: req.isAuthenticated});
});

router.post("/signup", async (req, res, next) => {

    const hash = await genHash(req.body.password);
  
    try {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        hash: hash,
      });
  
      const result = await user.save()
  
      jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1800s'},(err, token) => {
        if (err) {
            return res.status(500).json({ message: "Error generating token" });
        }
        res.json({ token });
      });
  

      
    } catch (err) {
      return next(err);
    }
  });

//LOGOUT
router.post('/logout', async function(req, res, next) {
    //protected - only works if user is signed in
});






module.exports = router;
