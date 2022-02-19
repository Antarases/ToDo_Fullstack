const { makeExecutableSchema, PubSub } = require("apollo-server-express");
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const merge = require("lodash/merge");

const pubsub = new PubSub();

const { typeDefs: userTypeDefs, resolvers: userResolvers } = require("./users");
const todoTypeDefs = require("./todos").typeDefs;
const todoResolvers = require("./todos").resolvers(pubsub);
const chatTypeDefs = require("./chats").typeDefs;
const chatResolvers = require("./chats").resolvers(pubsub);
const { typeDefs: eventTypeDefs, resolvers: eventResolvers } = require("./events");

const typeDefs =  `
    scalar Date

    type Query {
        _empty: String
    }
    
    type Mutation {
        logout: Boolean
    }
    
    type Subscription {
        _empty: String
    }
    
    type PaginationMetadata {
        nextCursor: String
    }
`;

const resolvers = {
    Mutation: {
        logout: (parent, args, context) => context.logout(),
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return JSON.parse(JSON.stringify(value)); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),
};

const schema = makeExecutableSchema({
    typeDefs: [ typeDefs, userTypeDefs, todoTypeDefs, chatTypeDefs, eventTypeDefs ],
    resolvers: merge(resolvers, userResolvers, todoResolvers, chatResolvers, eventResolvers),
});

module.exports = schema;
