const { withFilter } = require("apollo-server-express");

const { assertAuthenticated, assertChatMember }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        chats(skip: Int!, limit: Int!): [Chat!]
        totalChatsAmount: Int
        messages(chatId: String!, skip: Int!, limit: Int!): [Message!]
        totalMessagesAmount(chatId: String!): Int
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
        creationDate: String
        updatingDate: String
        messages(skip: Int!, limit: Int!): [Message!]
    }
    
    type Message {
        id: String!
        text: String!
        author: User!
        chatId: String!
        creationDate: String
        updatingDate: String
    }
    
    extend type User {
        chats(skip: Int!, limit: Int!): [Chat!]
    }
`;

module.exports.typeDefs = typeDefs;


const isChatMember = async (chatId, currentUser, dataSource) => {
    const chatMemberIds = await dataSource.chatAPI.getChatMembersByChatId(chatId);

    return chatMemberIds.includes(currentUser.id);
};

const resolvers = (pubsub) => ({
    Query: {
        chats: (parent, { skip, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getChatsByUserId(currentUser.id, skip, limit);
        },
        totalChatsAmount: (parent, args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.chatAPI.getTotalChatsAmountByUserId(currentUser.id);
        },
        messages: (parent, { chatId, skip, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getMessagesByChatId(chatId, skip, limit);
        },
        totalMessagesAmount: (parent, { chatId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

            return dataSources.chatAPI.getTotalMessagesAmountByChatId(chatId);
        },
    },
    Mutation: {
        createChat: async (parent, { chatName, userIds }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            const chat = await dataSources.chatAPI.createChat(chatName, userIds);

            pubsub.publish("CHAT_CREATED", { chatCreated: chat });

            return chat;
        },
        sendMessage: async (parent, { chatId, text }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertChatMember(currentUser, chatId, dataSources.chatAPI);

            const message = await dataSources.chatAPI.sendMessage(currentUser, chatId, text);

            pubsub.publish("MESSAGE_SENT", { messageSent: message });

            return message;
        }
    },
    Subscription: {
        chatCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("CHAT_CREATED"),
                async ({ id }, variables, { dataSource, currentUser }) => {
                    return await isChatMember(id, currentUser, dataSource);
                }
            )
        },
        messageSent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("MESSAGE_SENT"),
                async ({ chatId }, variables, { dataSource, currentUser }) => {
                    return await isChatMember(chatId, currentUser, dataSource);
                }
            )
        },
    },
    Chat: {
        members: ({ members } , args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.userAPI.getUsersByIds(members);
        },
        messages: ({ id }, { skip, limit }, { dataSources }) => {
            return dataSources.chatAPI.getMessagesByChatId(id, skip, limit);
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
