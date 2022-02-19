import {ApolloClient, ApolloLink, HttpLink, split, InMemoryCache, gql, isReference} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

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

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                clientData: {
                    merge: true,
                },
                chat: {
                    read(existingData, { args, canRead, isReference, toReference, readField }) {
                        // Generally, the string below should be used according to the documentation (https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-redirects)
                        // But due to bug (https://github.com/apollographql/apollo-client/issues/9074) a workaround is used.
                        // return existingData || toReference({ __typename: "Chat", id: args.id });

                        const reference = toReference({ __typename: 'Chat', id: args?.id });
                        // Check if reference is not empty (regression from Apollo client since 3.4.8)
                        const referenceData = reference && readField('id', reference) ? reference : undefined;

                        return existingData || referenceData;
                    }
                }
            }
        },
        ClientData: {
            fields: {
                todos: {
                    merge: true
                },
                todosPagination: {
                    merge: true
                },
                todosSortParams: {
                    merge: true
                },
                chats: {
                    merge: true
                },
                events: {
                    merge: true
                },
                users: {
                    merge: true
                },
                notificationsModal: {
                    merge: true
                }
            }
        },
        Chats: {
            merge: true
        },
        Events: {
            merge: true
        },
        AppliedEvents: {
            merge: true
        },
        Users: {
            merge: true
        }
    },
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
    cache.writeQuery({
        query: gql`
            query WriteInitialData {
                clientData @client,
                chats @client,
                events @client
                appliedEvents @client
                users @client
            }
        `,
        data: initialData
    });
};

writeInitialCacheData();

apolloClient.onResetStore(writeInitialCacheData);

export default apolloClient;
