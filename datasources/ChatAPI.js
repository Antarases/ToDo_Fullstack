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

    async getChatsByUserId(userId, skip, limit) {
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
                }
            });
        const chats = chatsQueryResult &&chatsQueryResult._chats;

        return Array.isArray(chats)
            ? chats.map(chat => ChatAPI.chatReducer(chat))
            : [];
    }

    async getChatMembersByChatId(chatId) {
        const queryMemberIdsResult = await Chat.findById(chatId, "_members");
        return queryMemberIdsResult._members;
    }

    async getTotalChatsAmountByUserId(userId) {
        const user = await User.findById(userId);
        return user._chats && user._chats.length;
    }

    async getMessagesByChatId(chatId, skip, limit) {
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
                        limit: limit
                    }
                );
        } else {
            messages = [];
        }

        return Array.isArray(messages)
            ? messages.map(message => ChatAPI.messageReducer(message))
            : [];
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
