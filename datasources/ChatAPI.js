const mongoose = require("mongoose");

const User = mongoose.model("users");
const Chat = mongoose.model("chats");
const Message = mongoose.model("messages");

class ChatAPI {
    static chatReducer(chat) {
        return chat
            ? {
                id: chat.id,
                name: chat.name,
                members: chat._members,
                lastMessage: chat.lastMessage,
                creationDate: chat.creationDate,
                updatingDate: chat.updatingDate
            }
            : null;
    }

    static messageReducer(message) {
        return message
            ? {
                id: message.id,
                text: message.text,
                authorId: message._user,
                chatId: message._chat,
                creationDate: message.creationDate,
                updatingDate: message.creationDate,
            }
            : null;
    }

    async getChatsByUserId(userId, cursor, limit) {
        limit = +limit;

        let chats;
        if (limit > 0) {
            if (cursor) {
                const chatsQueryResult = await User
                    .findById(
                        userId,
                        "_chats"
                    )
                    .populate({
                        path: "_chats",
                        model: Chat,
                        // "match", "sort" and "limit" applies only to the Chat model, not to the User model.
                        match: {
                            "updatingDate": { $lt: cursor }
                        },
                        options: {
                            sort: { updatingDate: "desc" },
                            limit
                        }
                    });

                chats = chatsQueryResult && chatsQueryResult._chats;
            } else {
                const chatsQueryResult = await User
                    .findById(
                        userId,
                        "_chats"
                    )
                    .populate({
                        path: "_chats",
                        model: Chat,
                        options: {
                            sort: { updatingDate: "desc" },
                            limit
                        }
                    });

                chats = chatsQueryResult && chatsQueryResult._chats;
            }

            chats = Array.isArray(chats)
                ? chats.map(chat => ChatAPI.chatReducer(chat))
                : [];
        } else {
            chats = [];
        }

        return {
            data: chats,
            paginationMetadata: {
                nextCursor: chats.length
                    ? JSON.stringify(Number(chats[chats.length - 1].creationDate))
                    : null
            }
        };
    }

    async getChatById(chatId) {
        const chat = await Chat.findById(chatId);

        return ChatAPI.chatReducer(chat)
    }

    async getChatMembersByChatId(chatId) {
        const queryMemberIdsResult = await Chat.findById(chatId, "_members");
        return queryMemberIdsResult._members;
    }

    async getTotalChatsAmountByUserId(userId) {
        const user = await User.findById(userId);
        return user._chats && user._chats.length;
    }

    async getMessagesByChatId(chatId, cursor, limit) {
        limit = +limit;

        let messages;
        if (limit > 0) {
            if (cursor) {
                messages = await Message
                    .find(
                        { _chat: chatId, creationDate: { $lt: cursor } },
                        null,
                        {
                            sort: { creationDate: "desc"},
                            limit
                        }
                    );
            } else {
                messages = await Message
                    .find(
                        { _chat: chatId },
                        null,
                        {
                            sort: { creationDate: "desc"},
                            limit
                        }
                    );
            }

            messages = Array.isArray(messages)
                ? messages
                    .reverse()
                    .map(message => ChatAPI.messageReducer(message))
                : [];
        } else {
            messages = [];
        }

        return {
            data: messages,
            paginationMetadata: {
                nextCursor: messages.length
                    ? JSON.stringify(Number(messages[0].creationDate))
                    : null
            }
        };
    }

    async getTotalMessagesAmountByChatId(chatId) {
        const messages = await Message.find({ _chat: chatId });

        return messages && messages.length;
    }

    async createChat(chatName, userIds) {
        const chat = await new Chat({
            name: chatName,
            _members: userIds
        })
        .save();

        await User.updateMany(
            { _id: { $in: userIds } },
            {
                $addToSet: { _chats: chat.id  }
            }
        )
        .exec();

        return ChatAPI.chatReducer(chat);
    }

    async sendMessage(currentUser, chatId, text) {
        const messageDocument = new Message({
            text,
            _user: currentUser.id,
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

        return ChatAPI.messageReducer(savedMessage);
    }
}

module.exports = ChatAPI;
