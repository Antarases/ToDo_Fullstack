const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
    try {
        //user.id — not a google profile id; it's an id of user record in DB
        const token = jwt.sign({ userId: user.id }, keys.jwtAuthorizationSecretKey, { algorithm: keys.jwtAuthorizationAlgorithm });

        done(null, token);
    } catch (error) {
        done(error, null);
    }
});

passport.deserializeUser((token, done) => {
    try {
        const tokenPayload = jwt.verify(token, keys.jwtAuthorizationSecretKey, {algorithm: keys.jwtAuthorizationAlgorithm})

        User.findById(tokenPayload.userId)
            .then(user => {
                done(null, user);
            });
    } catch (error) {
        done(error);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
            // we already have a record with a given profile ID
                return done(null, existingUser);
            }

            // we don't have a user record with this ID, make a new record!
            const user = await new User({
                googleId: profile.id,
                userFullName: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            }).save();
            done(null, user);
        }
    )
);
