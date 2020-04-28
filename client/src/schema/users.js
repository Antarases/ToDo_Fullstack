import gql from "graphql-tag";

const userResolvers = {
    Query: {
        users__getUsersAmountFromCache: (parent, args, { cache }) => {
            const query = gql`
                query GetUsers {
                    users @client {
                        id
                    }
                }
            `;
            const queryResults = cache.readQuery({ query });

            return { usersAmount: queryResults.users.length };
        },
    },
    Mutation: {
        users__addUsersToUserList: (parent, { users }, { cache }) => {
            const query = gql`
                query addUsersToUserList {
                    users @client {
                        id
                        googleId
                        userFullName
                        email
                        avatar
                        isAdmin
                        __typename
                    }
                }
            `;

            const queryResults = cache.readQuery({ query });

            const newData = {
                users: [
                    ...queryResults.users,
                    ...users
                ]
            };

            cache.writeQuery({ query, data: newData });
        },
        users__setUsersCursor: (parent, { usersCursor }, { cache }) => {
            const query = gql`
                        query SetUsersCursor {
                            clientData @client {
                                users {
                                    usersCursor
                                    __typename
                                }
                                __typename
                            }
                        }
                    `;

            const newData = {
                clientData: {
                    users: {
                        usersCursor,
                        __typename: "Users"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
        users__setIsUserListLoading: (parent, { isLoading }, { cache }) => {
            const query = gql`
                query SetIsUserListLoading {
                    clientData @client {
                        users {
                            isUserListLoading
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const newData = {
                clientData: {
                    users: {
                        isUserListLoading: isLoading,
                        __typename: "Users"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeData({ query, data: newData });
        },
        users__setTimeOfEndingLoadingFullUserList: (parent, { time }, { cache }) => {
            const query = gql`
                query SetTimeOfEndingLoadingFullUserList {
                    clientData @client {
                        users {
                            timeOfEndingLoadingFullUserList
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const newData = {
                clientData: {
                    users: {
                        timeOfEndingLoadingFullUserList: time,
                        __typename: "Users"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
    }
};

export default userResolvers;
