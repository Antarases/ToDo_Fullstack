import { ApolloClient } from "apollo-client";
import { InMemoryCache  } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

import { GET_CURRENT_USER } from "./constants/graphqlQueries/users";
import { SERVER_HTTP_URI, SERVER_WS_URI } from "./constants/app";

import { initialData, typeDefs, resolvers } from "./schema";

let apolloClient = {};

const httpLink = new HttpLink({
    uri: SERVER_HTTP_URI, // use https for a secure endpoint
    credentials: "include"
});

const wsLink = new WebSocketLink({
    uri: SERVER_WS_URI, // use wss for a secure endpoint
    options: {
        reconnect: true,
        lazy: true,
        connectionParams: async () => {
            try {
                const currentUserData = apolloClient.readQuery({ query: GET_CURRENT_USER });

                return (currentUserData && currentUserData.currentUser)
                    ? { currentUser: currentUserData.currentUser }
                    : null;
            } catch (error) {
                console.error("Error during setting WebSocket connection. ", error);
            }
        },
        connectionCallback: (error) => {
            if (error) {
                console.error("Connection to WebSocket failed: ", error);
            }
        }
    }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const cache = new InMemoryCache({
    cacheRedirects: {
        Query: {
            chat: (parent, { id }, { getCacheKey }) => {
                return getCacheKey({ __typename: "Chat", id });
            }
        }
    }
});

apolloClient = new ApolloClient({
    //ApolloLink.from takes an array of links and combines them all into a single link
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            if (networkError) console.error(`[Network error]: ${networkError}`);
        }),
        link
    ]),
    cache,
    resolvers,
    typeDefs
});

export const writeInitialCacheData = () => {
    cache.writeData({
        data: initialData
    });
};

writeInitialCacheData();

apolloClient.onResetStore(writeInitialCacheData);

export default apolloClient;
