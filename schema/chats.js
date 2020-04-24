const { withFilter } = require("apollo-server-express");

const { assertAuthenticated, assertChatMember }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        chats(skip: Int!, limit: Int!): [Chat!]
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
    
    type PaginationMetadata {
        nextCursor: String
    }
    
    extend type User {
        chats(skip: Int!, limit: Int!): [Chat!]
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
        chats: (parent, { skip, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getChatsByUserId(currentUser.id, skip, limit);
        },
        chat: (parent, { chatId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getChatById(chatId);
        },
        totalChatsAmount: (parent, args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getTotalChatsAmountByUserId(currentUser.id);
        },
        messages: (parent, { chatId, cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getMessagesByChatId(chatId, cursor, limit);
        },
        totalChatMessagesAmount: (parent, { chatId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

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
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

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
        chats: (parent, { skip, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getChatsByUserId(parent.id, skip, limit);
        },
    }
});

module.exports.resolvers = resolvers;
