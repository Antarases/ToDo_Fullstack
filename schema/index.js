const { makeExecutableSchema, PubSub } = require("apollo-server-express");
const { merge } = require("lodash");

const pubsub = new PubSub();

const { typeDefs: userTypeDefs, resolvers: userResolvers } = require("./user");
const todoTypeDefs = require("./todo").typeDefs;
const todoResolvers = require("./todo").resolvers(pubsub);
const chatTypeDefs = require("./chat").typeDefs;
const chatResolvers = require("./chat").resolvers(pubsub);

const typeDefs =  `
    type Query {
        _empty: String
    }
    
    type Mutation {
        logout: Boolean
    }
    
    type Subscription {
        _empty: String
    }
`;

const resolvers = {
    Mutation: {
        logout: (parent, args, context) => context.logout(),
    }
};

const schema = makeExecutableSchema({
    typeDefs: [ typeDefs, userTypeDefs, todoTypeDefs, chatTypeDefs ],
    resolvers: merge(resolvers, userResolvers, todoResolvers, chatResolvers),
});

module.exports = schema;
