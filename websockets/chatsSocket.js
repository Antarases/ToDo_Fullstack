const mongoose = require("mongoose");

const User = mongoose.model("users");
const Chat = mongoose.model("chats");
const Message = mongoose.model("messages");

module.exports = (httpServer) => {
    const ChatSocket = require("socket.io")(httpServer, { path: "/chats_ws" });

    let socketList = {};

    ChatSocket.of("/chats_ws").on("connect", async (socket) => {
        const chatsQueryResult = await User.findById(socket.handshake.query.userId, "_chats");
        let currentSocketChatIds = chatsQueryResult._chats;

        socketList[socket.handshake.query.userId] = socket;

        socket.join(currentSocketChatIds);

        socket.on("get_chat_list", async () => {
            try {
                const chatsQueryResult = await User
                    .findById(socket.handshake.query.userId, "_chats")
                    .populate({ path: "_chats", model: Chat,
                        options: { sort: { updatingDate: "desc"} },
                        populate: { path: "_members", model: User }
                    });
                const chats = chatsQueryResult._chats;

                socket.emit("get_chat_list", { chats, code: 200 });
            } catch (error) {
                console.log(error);
                socket.emit("send_message", { code: 422, text: "An error occured during getting chat list" });
            }
        });

        socket.on("get_chat_messages", async (data) => {
            const { chatId } = data;

            try {
                const messages = await Message
                    .find(
                        { _chat: chatId },
                        null,
                        {
                            sort: { creationDate: "asc"},
                            populate: { path: "_user", model: User }
                        }
                    );

                socket.emit("get_chat_messages", { messages, chatId, code: 200 });
            } catch (error) {
                socket.emit("get_chat_messages", { code: 422, text: `An error occured during getting chat messages. Chat id: ${chatId}` });
            }
        });

        socket.on("send_message", async (data) => {
            const { chatId, text } = data;

            try {
                const messageDocument = new Message({
                    text,
                    _user: socket.handshake.query.userId,
                    _chat: chatId
                });

                const chatQuery = Chat
                    .findByIdAndUpdate(
                        chatId,
                        { lastMessage: text },
                        { new: true }
                    );

                let [savedMessage] = await Promise.all([
                    messageDocument.save(),
                    chatQuery.exec()
                ]);

                if (savedMessage) {
                    let message = await Message
                        .findById(
                            savedMessage.id,
                            null,
                            {
                                populate: { path: "_user", model: User }
                            }
                        );
                    message = message.toObject();
                    message.userFullName = socket.handshake.query.userFullName;

                    ChatSocket.of("chats_ws").in(chatId).emit("send_message", { message, chatId, code: 200 });
                }
            } catch (error) {
                socket.emit("send_message", { code: 422, text: `An error occured during sending message to chat. Chat id: ${chatId}` });
            }
        });

        socket.on("create_chat", async (data) => {
            try {
                const { chatName, userIds } = data;

                const chat = await new Chat({
                    name: chatName,
                    _members: userIds
                })
                .save();

                const userQuery = await User.updateMany(
                    { _id: { $in: userIds } },
                    {
                        $addToSet: { _chats: chat.id  }
                    }
                )
                .exec();

                currentSocketChatIds.push(chat.id);
                userIds.forEach(userId => {
                    socketList[userId] && socketList[userId].join(chat.id);
                });

                ChatSocket.of("chats_ws").in(chat.id).emit("create_chat", { chat, code: 200 });
            } catch (error) {
                socket.emit("create_chat", { code: 422, text: "An error occured during chat creation" });
            }
        });


        socket.on("disconnect", () => {
            delete socketList[socket.handshake.query.userId];
        });
    });
};
