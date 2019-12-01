const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");

const User = mongoose.model("users");
const Message = mongoose.model("messages");

module.exports = (app) => {
    app.get(
        "/api/user_list",
        requireLogin,
        async (req, res) => {
            const { skip = 0, limit = 50 } = req.body;

            try {
                const userList = await User
                    .find({}, null, { skip, limit })
                    .exec();

                const totalUsersAmount = await User
                    .find()
                    .countDocuments();

                res.send({ userList, totalUsersAmount });
            } catch (error) {
                res.status(422).send(error);
            }
        }
    );
};

