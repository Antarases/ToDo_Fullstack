import apolloClient from "../apolloClient";

import { showNotificationModal } from "./NotificationsModalActions";

import { isNewListRequestsAllowed } from "../helpers/functions";

import { GET_TIME_OF_ENDING_LOADING_FULL_USER_LIST, SET_TIME_OF_ENDING_LOADING_FULL_USER_LIST, GET_IS_USER_LIST_LOADING, SET_IS_USER_LIST_LOADING, GET_USERS, GET_USERS_AMOUNT_FROM_CACHE, GET_TOTAL_USERS_AMOUNT, ADD_USERS_TO_USER_LIST } from "../constants/graphqlQueries/users";
import { FETCHED_USERS_LIMIT } from "../constants/chats";

import { initialData } from "../schema";


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
            timeOfEndingLoadingFullUserList,
            isUserListLoading,
            currentUsersAmount
        ] = await Promise.all([
            getTimeOfEndingLoadingFullUserList(),
            getIsUserListLoading(),
            getCurrentUsersAmount()
        ]);

        if (
            isNewListRequestsAllowed(isUserListLoading, timeOfEndingLoadingFullUserList)
        ) {
            setIsUserListLoading(true);

            const [
                userList,
                totalUsersAmount
            ] = await Promise.all([
                async function() {
                    const { data: usersData } = await apolloClient.query({
                        query: GET_USERS,
                        variables: {
                            skip: currentUsersAmount,
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

            const fetchedUsersAmount = userList ? userList.length : 0;

            if (fetchedUsersAmount) {
                addUsersToUserList(userList);
            }

            if ((currentUsersAmount + userList.length) >= totalUsersAmount) {
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
