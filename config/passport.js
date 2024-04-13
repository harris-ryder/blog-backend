const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();


//IMPORT MODELS
const User = require("../models/user");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

// STRICT STRATEGY ONLY ALLOWED IN IF AUTH
const jwtStrictStrategy = new JwtStrategy(options, async (payload,done) => {
    try {

        const user = await User.findOne({ _id: payload.sub });
        if (user) {
            return done(null,user);

        } else {
            return done(null,false);
        }
    } catch (err) {
        return done(err,null);
    }

});

// OPTIONAL STRATEGY ALLOWED IN REGARDLESS BUT PASSES DETAILS ON TO ROUTE
const jwtOptionalStrategy = new JwtStrategy({
    ...options,
    passReqToCallback: true  // Allows us to pass the request to the callback
}, async (req, payload, done) => {
    try {
        const user = await User.findOne({ _id: payload.sub });
        if (user) {
            req.isAuthenticated = true;
            return done(null, user);
        } else {
            req.isAuthenticated = false;

            return done(null, "No user");
        }
    } catch (err) {

        return done(err, null);
        

    }
});


module.exports = (passport) => {
    passport.use('jwt', jwtStrictStrategy);  // Registering the strict strategy
    passport.use('jwtOptional', jwtOptionalStrategy);  // Registering the optional strategy
};



