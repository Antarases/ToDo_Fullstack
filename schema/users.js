const { assertAuthenticated }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        currentUser: User
        users(cursor: String!, limit: Int!): UsersConnection!
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
    
    type UsersConnection {
        data: [User!]
        paginationMetadata: PaginationMetadata
    }
`;

module.exports.typeDefs = typeDefs;


const resolvers = {
    Query: {
        currentUser: (parent, args, context) => context.currentUser,
        users: (parent, {cursor, limit}, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.userAPI.getUsers(cursor, limit);
        },
        totalUsersAmount: (parent, args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.userAPI.getTotalUsersAmount()
        },
    },
};

module.exports.resolvers = resolvers;
