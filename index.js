const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");

require("./models/User");
require("./models/Todo");
require("./models/Chat");
require("./models/Message");
require("./models/Event");

require("./services/passport");


mongoose.connect(keys.mongoURI)
    .catch(error => console.error("First connect attempt failed: ", error));
mongoose.connection.on('error', err => {
    console.error("Sequent connect attempt failed: ", err);
});

const app = express();

app.use(bodyParser.json({limit: '5120kb'}));
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

//for handling passport's serializeUser/deserializeUser errors (besides of other)
app.use(function(err, req, res, next) {
    if (err) {
        req.logout();
        if (req.originalUrl == "/") {
            next(); // for not redirecting login page to itself
        } else {
            res.redirect("/");
        }
    } else {
        next();
    }
});

app.use(cors({
    origin: ["http://localhost:3000", "ws://localhost:3000"],
    credentials: true,
}));

const apolloServer = require("./apolloServer");
apolloServer.applyMiddleware({ app, cors: false });
const httpServer = require("http").createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

require("./routes/authRoutes")(app);
require("./routes/appRoutes")(app);
require("./routes/todoRoutes")(app);
require("./routes/chatRoutes")(app);

if (process.env.NODE_ENV === "production") {
    // Express will serve up production assets, like our main.js, or main.css files
    app.use(express.static("client/build"));

    // Express will serve up the index.html file if it doesn't recognize the route
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT);
