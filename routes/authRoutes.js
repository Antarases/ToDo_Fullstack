const passport = require("passport");
const mongoose = require("mongoose");
const Todo = mongoose.model("todos");

module.exports = (app) => {
    app.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: ["profile", "email"]
        })
    );

    app.get(
        "/auth/google/callback",
        passport.authenticate("google"),
        (req, res, next) => {
            console.log("/auth/google/callback", req);

            next();
        },
        (req, res) => {
            res.redirect("/dashboard");
        }
    );

    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    app.get("/api/current_user", (req, res) => {
        res.send(req.user);
    })
};
