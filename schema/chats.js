const { withFilter } = require("apollo-server-express");

const { assertAuthenticated, assertChatMember }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        chats(cursor: String!, limit: Int!): ChatsConnection!
        chat(chatId: String!): Chat!
        totalChatsAmount: Int
        messages(chatId: String!, cursor: String!, limit: Int!): MessagesConnection!
        totalChatMessagesAmount(chatId: String!): Int
    }
    
    extend type Mutation {
        createChat(chatName: String!, userIds: [String!]!): Chat!
        sendMessage(chatId: String!, text: String!): Message!
    }
    
    extend type Subscription {
        chatCreated: Chat!
        messageSent: Message!
    }
    
    type Chat {
        id: String!
        name: String!
        members: [User!]
        lastMessage: String
        creationDate: Date
        updatingDate: Date
        messages(cursor: String!, limit: Int!): MessagesConnection!
    }
    
    type ChatsConnection {
        data: [Chat!]
        paginationMetadata: PaginationMetadata
    }
    
    type Message {
        id: String!
        text: String!
        author: User!
        chatId: String!
        creationDate: Date
        updatingDate: Date
    }
    
    type MessagesConnection {
        data: [Message!]
        paginationMetadata: PaginationMetadata
    }
    
    extend type User {
        chats(cursor: String!, limit: Int!): ChatsConnection!
    }
`;

module.exports.typeDefs = typeDefs;

const isAuthenticatedChatMember = async (chatId, currentUser, dataSources) => {
    if (!(currentUser && Object.keys(currentUser).length)) {
        return false;
    }

    const chatMemberIds = await dataSources.chatAPI.getChatMembersByChatId(chatId, dataSources);

    return chatMemberIds.includes(currentUser.id);
};

const resolvers = (pubsub) => ({
    Query: {
        chats: (parent, { cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getChatsByUserId(currentUser.id, cursor, limit);
        },
        chat: async (parent, { chatId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            await assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getChatById(chatId);
        },
        totalChatsAmount: (parent, args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getTotalChatsAmountByUserId(currentUser.id);
        },
        messages: async (parent, { chatId, cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            await assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getMessagesByChatId(chatId, cursor, limit);
        },
        totalChatMessagesAmount: async (parent, { chatId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            await assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getTotalMessagesAmountByChatId(chatId);
        },
    },
    Mutation: {
        createChat: async (parent, { chatName, userIds }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            const chat = await dataSources.chatAPI.createChat(chatName, userIds);

            pubsub.publish("CHAT_CREATED", { chatCreated: chat, chatId: chat.id });

            return chat;
        },
        sendMessage: async (parent, { chatId, text }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            await assertChatMember(currentUser, chatId, dataSources.chatAPI);

            const message = await dataSources.chatAPI.sendMessage(currentUser, chatId, text);

            pubsub.publish("MESSAGE_SENT", { messageSent: message, chatId });

            return message;
        }
    },
    Subscription: {
        chatCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("CHAT_CREATED"),
                async ({ chatId }, variables, { dataSources, currentUser }) => {
                    return await isAuthenticatedChatMember(chatId, currentUser, dataSources);
                }
            )
        },
        messageSent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("MESSAGE_SENT"),
                async ({ chatId }, variables, { dataSources, currentUser }) => {
                    return await isAuthenticatedChatMember(chatId, currentUser, dataSources);
                }
            )
        },
    },
    Chat: {
        members: ({ members } , args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.userAPI.getUsersByIds(members);
        },
        messages: ({ id }, { cursor, limit }, { dataSources }) => {
            return dataSources.chatAPI.getMessagesByChatId(id, cursor, limit);
        }
    },
    Message: {
        author: ({ authorId }, args, { dataSources }) => {
            return dataSources.userAPI.getUserById(authorId);
        },
    },
    User: {
        chats: (parent, { cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getChatsByUserId(parent.id, cursor, limit);
        },
    }
});

module.exports.resolvers = resolvers;
