import axios from "axios";
import { dispatch, getCurrentState } from "../store/configureStore";

import { FETCHED_USERS_LIMIT, USER_LIST_FETCH_THROTTLING_TIME } from "../constants/chats";

export const getChatList = async () => {
    try {
        const res  = await axios.get("/chats/get_chat_list");
        const { chats } = res.data;

        const newChats = {};
        chats.forEach(chat => {
            const newChatMembers = {};
            chat._members.forEach(member => {
                newChatMembers[member.id] = member;
            });

            newChats[chat.id] = chat;
            newChats[chat.id]._members = newChatMembers;
        });

        dispatch({ type: "CHATS__SET_CHAT_LIST", chats: newChats });
    } catch (error) {
        console.error("An error occured during getting chat list.", error);
    }
};

export const selectChatAndGetMessages = async (chatId) => {
    try {
        dispatch({ type: "CHATS__SET_SELECTED_CHAT", chatId });

        const res = await axios.get(`/chats/get_chat_messages/?chatId=${chatId}`);
        const { messages } = res.data;

        const newMessages = {};
        messages.forEach(message => {
            newMessages[message.id] = message;
        });

        dispatch({ type: "CHATS__SET_CHAT_MESSAGES", messages: newMessages, chatId });
    } catch (error) {
        console.error("An error occured during getting chat messages.", error);
    }
};

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
