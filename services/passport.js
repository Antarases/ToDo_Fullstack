const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
    done(null, user.id);    //user.id — not a gooogle profile id; it's an id of user record in DB
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
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
            // console.log("profile", profile);
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
            // we already have a record with a given profile ID
                console.log("existingUser", existingUser);
                return done(null, existingUser);
            }

            // we don't have a user record with this ID, make a new record!
            const user = await new User({
                googleId: profile.id,
                userFullName: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            }).save();
            console.log("user", user);
            done(null, user);
        }
    )
);
