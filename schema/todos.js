const { AuthenticationError, withFilter } = require("apollo-server-express");

const { assertAuthenticated, assertIsTodoAuthorOrAdmin }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        todos(page: Int!, sortField: AllowedSortFields, sortOrder: AllowedSortOrders): [Todo!]
        totalTodosAmount: Int
    }
    
    enum AllowedSortFields {
        userFullName
        creationDate
        isCompleted
    }
    
    enum AllowedSortOrders {
        asc
        desc
    }
    
    extend type Mutation {
        addTodo(text: String!, image: String): Todo!
        editTodo(todoId: String!, text: String!, image: String, isCompleted: Boolean!): Todo!
    }
    
    extend type Subscription {
        todoAdded: Todo!
        todoEdited: Todo!
    }
    
    type Todo {
        id: String!
        author: User!
        text: String!
        image: String
        isCompleted: Boolean!
        creationDate: Date
        updatingDate: Date
    }
    
    extend type User {
        todos(page: Int!, sortField: AllowedSortFields, sortOrder: AllowedSortOrders): [Todo!]
    }
`;

module.exports.typeDefs = typeDefs;


const isAdminOrTodoAuthor = (currentUser, todoAuthor) => {
    return (currentUser.isAdmin || (todoAuthor.id === currentUser.id));
};

const resolvers = (pubsub) => ({
    Query: {
        todos: (parent, { page, sortField, sortOrder }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            if ((sortField === "userFullName") && !currentUser.isAdmin) {
                throw new AuthenticationError(`You need to be an Admin to sort by "userFullName".`);
            }

            return dataSources.todoAPI.getTodos(page, sortField, sortOrder, currentUser.id, currentUser.isAdmin);
        },
        totalTodosAmount: (parent, agrs, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.todoAPI.getTotalTodosAmount(currentUser.id, currentUser.isAdmin);
        }
    },
    Mutation: {
        addTodo: async (parent, { text, image }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            const todo = await dataSources.todoAPI.addTodo(text, image, currentUser);

            pubsub.publish("TODO_ADDED", { todoAdded: todo });

            return todo;
        },
        editTodo: async (parent, { todoId, text, image, isCompleted }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertIsTodoAuthorOrAdmin(currentUser, todoId, dataSources.todoAPI);

            const todo = await dataSources.todoAPI.editTodo(todoId, text, image, isCompleted);

            pubsub.publish("TODO_EDITED", { todoEdited: todo });

            return todo;
        },
    },
    Subscription: {
        todoAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("TODO_ADDED"),
                ({ todoAdded }, variables, { currentUser }) => {
                    return isAdminOrTodoAuthor(currentUser, todoAdded.author);
                }
            ),
        },
        todoEdited: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("TODO_EDITED"),
                ({ todoEdited }, variables, { currentUser }) => {
                    return isAdminOrTodoAuthor(currentUser, todoEdited.author);
                }
            )
        }
    },
    User: {
        todos: (user, { page, sortField, sortOrder }, { dataSources }) => {
            assertAuthenticated(user);

            if ((sortField === "userFullName") && !user.isAdmin) {
                throw new AuthenticationError(`You need to be an Admin to sort by "userFullName".`);
            }

            return dataSources.todoAPI.getTodos(page, sortField, sortOrder, user.id, user.isAdmin);
        }
    }
});

module.exports.resolvers = resolvers;
