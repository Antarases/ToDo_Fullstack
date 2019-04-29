const express = require("express");
const mongoose = require("mongoose");

const keys = require("./config/keys");

// mongoose.connect(keys.mongoURI);
//
const app = express();
//
// if (process.env.NODE_ENV === "production") {
//     // Express will serve up production assets, like our main.js, or main.css files
//     app.use(express.static("client/build"));
//
//     // Express will serve up the index.html file if it doesn't recognize the route
//     const path = require("path");
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     })
// }
//

app.get("/", (req, res) => {
    res.send({ hi: "there!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
