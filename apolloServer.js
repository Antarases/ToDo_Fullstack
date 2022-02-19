const  { ApolloServer } = require("apollo-server-express");

const schema = require("./schema");
const { UserAPI, TodoAPI, ChatAPI, EventAPI } = require("./datasources");

module.exports = new ApolloServer({
    schema,
    context: async ({ req, connection }) => {
        if (connection) {
            return {
                currentUser: UserAPI.userReducer(connection.context.currentUser),
                dataSources: {
                    userAPI: new UserAPI(),
                    todoAPI: new TodoAPI(),
                    chatAPI: new ChatAPI(),
                    eventAPI: new EventAPI(),
                }
            };
        } else {
            return {
                currentUser: UserAPI.userReducer(req.user),
                logout: () => req.logout()
            };
        }
    },
    subscriptions: {
        onConnect: (connectionParams) => {
            if (connectionParams && connectionParams.currentUser) {
                return connectionParams;
            } else {
                throw new Error("You must log in!");
            }
        },
        path: "/graphql_ws"
    },
    dataSources: () => ({
        userAPI: new UserAPI(),
        todoAPI: new TodoAPI(),
        chatAPI: new ChatAPI(),
        eventAPI: new EventAPI(),
    }),
    playground: {
        settings: {
            "request.credentials": "same-origin",
        },
        subscriptionEndpoint: "/graphql_ws"
    },
});
