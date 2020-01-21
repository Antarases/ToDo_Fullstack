const  { ApolloServer } = require("apollo-server-express");

const schema = require("./schema");
const { UserAPI, TodoAPI, ChatAPI } = require("./datasources");

module.exports = new ApolloServer({
    schema,
    context: async ({ req, connection }) => {
        // TODO Set context upon connection during WebSocket
        if (connection) {
            return connection.context;
        } else {
            return {
                currentUser: UserAPI.userReducer(req.user),
                logout: () => req.logout()
            };
        }
    },
    subscriptions: {
        onConnect: (connectionParams, webSocket) => {
            // TODO check connectionParams to determine whether to allow WebSocket connection; throw an error if user is unauthenticated.
            return true;
        }
    },
    dataSources: () => ({
        userAPI: new UserAPI(),
        todoAPI: new TodoAPI(),
        chatAPI: new ChatAPI(),
    }),
    playground: {
        settings: {
            'request.credentials': 'same-origin',
        }
    },
});