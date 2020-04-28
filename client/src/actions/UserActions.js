import apolloClient from "../apolloClient";

import { showNotificationModal } from "./NotificationsModalActions";

import { isNewListRequestsAllowed } from "../helpers/functions";

import { GET_USERS_AMOUNT_FROM_CACHE, GET_TOTAL_USERS_AMOUNT, GET_USERS_CURSOR, SET_USERS_CURSOR, GET_IS_USER_LIST_LOADING, SET_IS_USER_LIST_LOADING, GET_TIME_OF_ENDING_LOADING_FULL_USER_LIST, SET_TIME_OF_ENDING_LOADING_FULL_USER_LIST, GET_USERS, ADD_USERS_TO_USER_LIST } from "../constants/graphqlQueries/users";
import { FETCHED_USERS_LIMIT } from "../constants/chats";

import { initialData } from "../schema";


const getCurrentUsersAmount = async () => {
    const { data: usersAmountData } = await apolloClient.query({
        query: GET_USERS_AMOUNT_FROM_CACHE,
        fetchPolicy: "no-cache"
    });

    return usersAmountData.users__getUsersAmountFromCache.usersAmount;
};

const getTotalUsersAmount = async () => {
    const { data: totalUsersAmountData } = await apolloClient.query({
        query: GET_TOTAL_USERS_AMOUNT,
        fetchPolicy: "no-cache"
    });

    return totalUsersAmountData
        ? totalUsersAmountData.totalUsersAmount
        : null;
};

const getUsersCursor = async () => {
    const { data: usersCursorData } = await apolloClient.query({
        query: GET_USERS_CURSOR
    });

    return usersCursorData.clientData.users.usersCursor;
};

const setUsersCursor = (usersCursor) => {
    apolloClient.mutate({
        mutation: SET_USERS_CURSOR,
        variables: {
            usersCursor
        }
    });
};

const getIsUserListLoading = async () => {
    const { data: isUserListLoadingData } = await apolloClient.query({
        query: GET_IS_USER_LIST_LOADING
    });

    return isUserListLoadingData.clientData.users.isUserListLoading;
};

const setIsUserListLoading = (isLoading) => {
    apolloClient.mutate({
        mutation: SET_IS_USER_LIST_LOADING,
        variables: {
            isLoading
        }
    });
};

const getTimeOfEndingLoadingFullUserList = async () => {
    const { data: timeOfEndingLoadingFullChatListData } = await apolloClient.query({
        query: GET_TIME_OF_ENDING_LOADING_FULL_USER_LIST
    });

    return timeOfEndingLoadingFullChatListData.clientData.users.timeOfEndingLoadingFullUserList;
};

const setTimeOfEndingLoadingFullUserList = (time) => {
    apolloClient.mutate({
        mutation: SET_TIME_OF_ENDING_LOADING_FULL_USER_LIST,
        variables: {
            time
        }
    });
};

const addUsersToUserList = (users) => {
    apolloClient.mutate({
        mutation: ADD_USERS_TO_USER_LIST,
        variables: {
            users
        }
    });
};

export const getUserList = async () => {
    try {
        const [
            currentUsersAmount,
            currentUsersCursor,
            isUserListLoading,
            timeOfEndingLoadingFullUserList
        ] = await Promise.all([
            getCurrentUsersAmount(),
            getUsersCursor(),
            getIsUserListLoading(),
            getTimeOfEndingLoadingFullUserList()
        ]);

        if (
            isNewListRequestsAllowed(isUserListLoading, timeOfEndingLoadingFullUserList)
        ) {
            setIsUserListLoading(true);

            const [
                users,
                totalUsersAmount
            ] = await Promise.all([
                async function() {
                    const { data: usersData } = await apolloClient.query({
                        query: GET_USERS,
                        variables: {
                            cursor: currentUsersCursor,
                            limit: FETCHED_USERS_LIMIT
                        },
                        fetchPolicy: "no-cache"
                    });

                    return usersData
                        ? usersData.users
                        : initialData.users;
                }(),
                getTotalUsersAmount()
            ]);

            const fetchedUsersAmount = (users && users.data) ? users.data.length : 0;

            if (fetchedUsersAmount) {
                addUsersToUserList(users.data);
            }

            users.paginationMetadata.nextCursor
                && setUsersCursor(users.paginationMetadata.nextCursor);

            if ((currentUsersAmount + fetchedUsersAmount) >= totalUsersAmount) {
                setTimeOfEndingLoadingFullUserList(Date.now());
            }

            setIsUserListLoading(false);
        }
    } catch (error) {
        console.error("An error occured during getting user list.", error);

        showNotificationModal({
            body: "An error occured during getting user list. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};
