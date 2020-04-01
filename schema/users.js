const { assertAuthenticated }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        currentUser: User
        users(skip: Int!, limit: Int!): [User!]
        totalUsersAmount: Int
    }
    
    type User {
        id: String!
        googleId: String!
        userFullName: String
        email: String
        avatar: String
        isAdmin: Boolean!
    }
`;

module.exports.typeDefs = typeDefs;


const resolvers = {
    Query: {
        currentUser: (parent, args, context) => context.currentUser,
        users: (parent, {skip, limit}, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.userAPI.getUsers(skip, limit);
        },
        totalUsersAmount: (parent, args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.userAPI.getTotalUsersAmount()
        },
    },
};

module.exports.resolvers = resolvers;
