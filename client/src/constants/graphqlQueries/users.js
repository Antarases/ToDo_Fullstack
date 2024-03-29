import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        currentUser {
            id
            googleId
            userFullName
            email
            avatar
            isAdmin
        }
    }
`;

export const GET_USERS = gql`
    query GetUsers($cursor: String!, $limit: Int!) {
        users(cursor: $cursor, limit: $limit) @connection(key: "users") {
            data {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            paginationMetadata {
                nextCursor
            }
        }
    }
`;

export const GET_USERS_FROM_CACHE = gql`
    query GetUsersFromCache {
        users @client {
            id
            googleId
            userFullName
            email
            avatar
            isAdmin
        }
    }
`;

export const GET_USERS_AMOUNT_FROM_CACHE = gql`
    query GetUsersAmountFromCache {
        users__getUsersAmountFromCache @client
    }
`;

export const GET_TOTAL_USERS_AMOUNT = gql`
    query GetTotalUsersAmount {
        totalUsersAmount
    }
`;


export const ADD_USERS_TO_USER_LIST = gql`
    mutation AddUsersToUserList($users: [User!]) {
        users__addUsersToUserList(users: $users) @client
    }
`;

export const GET_USERS_CURSOR = gql`
    query GetUsersCursor {
        clientData @client {
            users {
                usersCursor
            }
        }
    }
`;

export const SET_USERS_CURSOR = gql`
    mutation SetUsersCursor($usersCursor: String!) {
        users__setUsersCursor(usersCursor: $usersCursor) @client
    }
`;

export const GET_TIME_OF_ENDING_LOADING_FULL_USER_LIST = gql`
    query GetTimeOfEndingLoadingFullUserList {
        clientData @client {
            users {
                timeOfEndingLoadingFullUserList
            }
        }
    }
`;

export const SET_TIME_OF_ENDING_LOADING_FULL_USER_LIST = gql`
    mutation SetTimeOfEndingLoadingFullUserList($time: number) {
        users__setTimeOfEndingLoadingFullUserList(time: $time) @client
    }
`;

export const GET_IS_USER_LIST_LOADING = gql`
    query GetIsUserListLoading {
        clientData @client {
            users {
                isUserListLoading
            }
        }
    }
`;

export const SET_IS_USER_LIST_LOADING = gql`
    mutation SetIsUserListLoading($isLoading: Boolean!) {
        users__setIsUserListLoading(isLoading: $isLoading) @client
    }
`;
