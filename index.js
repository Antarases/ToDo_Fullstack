const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/UserAndChat");
require("./models/Todo");
require("./models/Message");
require("./services/passport");

mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useFindAndModify: false})
    .catch(error => console.log("First connect attempt failed: ", error));
mongoose.connection.on('error', err => {
    console.log("Sequent connect attempt failed: ", err);
});

const app = express();
const httpServer = require("http").createServer(app);

app.use(bodyParser.json({limit: '5120kb'}));
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/appRoutes")(app);

require("./websockets/todosSocket")(httpServer);
require("./websockets/chatsSocket")(httpServer);

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
