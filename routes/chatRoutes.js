const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");

const User = mongoose.model("users");
const Chat = mongoose.model("chats");
const Message = mongoose.model("messages");

module.exports = (app) => {
    app.get(
        "/chats/get_chat_list",
        requireLogin,
        async (req, res) => {
            try {
                const userId = req.user.id;

                const chatsQueryResult = await User
                    .findById(userId, "_chats")
                    .populate({ path: "_chats", model: Chat,
                        options: { sort: { updatingDate: "desc"} },
                        populate: { path: "_members", model: User }
                    });
                const chats = chatsQueryResult._chats;

                res.send({ chats, code: 200 });
            } catch (error) {
                console.log(error);
                res.status(422).send({ code: 422, text: "An error occured during getting chat list", error: error.message });
            }
        }
    );

    app.get(
        "/chats/get_chat_messages",
        requireLogin,
        async (req, res) => {
            try {
                const { chatId } = req.query;

                const messages = await Message
                    .find(
                        { _chat: chatId },
                        null,
                        {
                            sort: { creationDate: "asc"},
                            populate: { path: "_user", model: User }
                        }
                    );

                res.send({ messages, chatId, code: 200 });
            } catch (error) {
                console.log(error);
                res.status(422).send({ code: 422, text: "An error occured during getting chat messages", error: error.message });
            }
        }
    );
};