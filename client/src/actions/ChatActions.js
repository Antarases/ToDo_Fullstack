import axios from "axios";
import { dispatch, getCurrentState } from "../store/configureStore";

import { FETCHED_USERS_LIMIT, USER_LIST_FETCH_THROTTLING_TIME } from "../constants/chats";

export const getUserList = async () => {
    const { isUserListLoading, userList, timeOfEndingLoadingFullUserList } = getCurrentState().chats;
    const currentUsersAmount = Object.keys(userList).length;

    const isNewRequestsAllowed = () => {
        return !isUserListLoading
            && (!timeOfEndingLoadingFullUserList || (Date.now() >= (timeOfEndingLoadingFullUserList + USER_LIST_FETCH_THROTTLING_TIME)));
    };

    if (
        isNewRequestsAllowed()
    ) {
        setIsUserListLoading(true);

        const users = await axios.get(`/api/user_list/?skip=${currentUsersAmount}&limit=${FETCHED_USERS_LIMIT}`);
        const { userList, totalUsersAmount } = users.data;

        const newUsers = {};
        userList.forEach(user => {
            newUsers[user.id] = user;
        });

        dispatch({ type: "CHATS__ADD_USERS_TO_USER_LIST", users: newUsers, totalUsersAmount });
        if ((currentUsersAmount + userList.length) === totalUsersAmount) {
            dispatch({ type: "CHATS__SET_TIME_OF_ENDING_LOADING_FULL_USER_LIST", time: Date.now() });
        }
        setIsUserListLoading(false);
    }
};

export const setIsUserListLoading = (isLoading) => {
    dispatch({ type: "CHATS__SET_IS_USER_LIST_LOADING", isLoading });
};

export const toggleCreateChatModal = () => {
    dispatch({ type: "CHATS__TOGGLE_CREATE_CHAT_MODAL" });
};
