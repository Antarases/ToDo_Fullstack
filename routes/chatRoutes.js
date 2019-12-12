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
                let { skip, limit } = req.query;
                const userId = req.user.id;

                const chatsQueryResult = await User
                    .findById(
                        userId,
                        "_chats"
                    )
                    .populate({ path: "_chats", model: Chat,
                        options: {
                            sort: { updatingDate: "desc"},
                            skip: +skip,
                            limit: +limit
                        },
                        populate: { path: "_members", model: User }
                    });
                const chats =  chatsQueryResult
                    ? chatsQueryResult._chats
                    : [];

                const user = await User.findById(userId);
                let totalChatsAmount = user._chats.length;

                res.send({ chats, totalChatsAmount, code: 200 });
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
                let { chatId, skip, limit } = req.query;
                skip = +skip;
                limit = +limit;

                const allCurrentChatMessages = await Message.find({ _chat: chatId });
                const totalMessagesAmount = allCurrentChatMessages.length;

                if (totalMessagesAmount >= (skip + limit)) {
                    skip = totalMessagesAmount - (skip + limit);
                } else {
                    limit = totalMessagesAmount - skip;
                    skip = 0;
                }

                let messages;
                if (limit !== 0) {
                    messages = await Message
                        .find(
                            { _chat: chatId },
                            null,
                            {
                                sort: { creationDate: "asc"},
                                skip: skip,
                                limit: limit,
                                populate: { path: "_user", model: User }
                            }
                        );
                } else {
                    messages = [];
                }

                res.send({ chatId, messages, totalMessagesAmount, code: 200 });
            } catch (error) {
                console.log(error);
                res.status(422).send({ code: 422, text: "An error occured during getting chat messages", error: error.message });
            }
        }
    );
};
