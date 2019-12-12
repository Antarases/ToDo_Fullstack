import axios from "axios";
import { dispatch, getCurrentState } from "../store/configureStore";

import { FETCHED_CHATS_LIMIT, FETCHED_MESSAGES_LIMIT, FETCHED_USERS_LIMIT } from "../constants/chats";
import { LISTS_FETCH_THROTTLING_TIME } from "../constants/app";

const isNewListRequestsAllowed = (isListLoading, timeOfEndingLoadingFullList) => {
    return !isListLoading
        && (!timeOfEndingLoadingFullList || (Date.now() >= (timeOfEndingLoadingFullList + LISTS_FETCH_THROTTLING_TIME)));
};

export const getChatList = async () => {
    try {
        const { isChatListLoading, chats, timeOfEndingLoadingFullChatList } = getCurrentState().chats;
        const currentChatsAmount = Object.keys(chats).length;

        if (
            isNewListRequestsAllowed(isChatListLoading, timeOfEndingLoadingFullChatList)
        ) {
            setIsChatListLoading(true);

            const users = await axios.get(`/chats/get_chat_list/?skip=${currentChatsAmount}&limit=${FETCHED_CHATS_LIMIT}`);
            const { chats, totalChatsAmount } = users.data;

            if (chats && Object.keys(chats).length) {
                const newChats = {};
                chats.forEach(chat => {
                    const newChatMembers = {};
                    chat._members.forEach(member => {
                        newChatMembers[member.id] = member;
                    });

                    newChats[chat.id] = chat;
                    newChats[chat.id]._members = newChatMembers;
                });

                dispatch({ type: "CHATS__ADD_CHATS_TO_CHAT_LIST", chats: newChats, totalChatsAmount });
            }

            if ((currentChatsAmount + chats.length) === totalChatsAmount) {
                dispatch({ type: "CHATS__SET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST", time: Date.now() });
            }
            setIsChatListLoading(false);
        }
    } catch (error) {
        console.error("An error occured during getting chat list.", error);
    }
};

export const setIsChatListLoading = (isLoading) => {
    dispatch({ type: "CHATS__SET_IS_CHAT_LIST_LOADING", isLoading });
};

export const setSelectedChat = (chatId) => {
    dispatch({ type: "CHATS__CLEAR_CURRENT_CHAT_MESSAGES" });
    dispatch({ type: "CHATS__RESET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST" });
    dispatch({ type: "CHATS__SET_SELECTED_CHAT", chatId });
};

export const getChatMessages = async (chatId) => {
    try {
        const { chats, isMessageListLoading, timeOfEndingLoadingFullCurrentChatMessageList } = getCurrentState().chats;
        const selectedChatMessages = chats[chatId].messages;
        const currentMessagesAmount = selectedChatMessages ? Object.keys(selectedChatMessages).length : 0;

        if (
            isNewListRequestsAllowed(isMessageListLoading, timeOfEndingLoadingFullCurrentChatMessageList)
        ) {
            setIsMessageListLoading(true);

            const res = await axios.get(`/chats/get_chat_messages/?chatId=${chatId}&skip=${currentMessagesAmount}&limit=${FETCHED_MESSAGES_LIMIT}`);
            const { messages, totalMessagesAmount } = res.data;
            const fetchedMessagesAmount = messages ? Object.keys(messages).length : 0;

            if (fetchedMessagesAmount) {
                const newMessages = {};
                messages.forEach(message => {
                    newMessages[message.id] = message;
                });

                dispatch({ type: "CHATS__ADD_MESSAGES_TO_MESSAGE_LIST", chatId, messages: newMessages, totalCurrentChatMessagesAmount: totalMessagesAmount });
            }

            if ((currentMessagesAmount + fetchedMessagesAmount) >= totalMessagesAmount) {
                dispatch({ type: "CHATS__SET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST", time: Date.now() });
            }
            setIsMessageListLoading(false);
        }
    } catch (error) {
        console.error("An error occured during getting chat messages.", error);
    }
};

export const setIsMessageListLoading = (isLoading) => {
    dispatch({ type: "CHATS__SET_IS_MESSAGE_LIST_LOADING", isLoading });
};

export const getUserList = async () => {
    try {
        const { isUserListLoading, userList, timeOfEndingLoadingFullUserList } = getCurrentState().chats;
        const currentUsersAmount = Object.keys(userList).length;

        if (
            isNewListRequestsAllowed(isUserListLoading, timeOfEndingLoadingFullUserList)
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
    } catch (error) {
        console.error("An error occured during getting user list.", error);
    }
};

export const setIsUserListLoading = (isLoading) => {
    dispatch({ type: "CHATS__SET_IS_USER_LIST_LOADING", isLoading });
};

export const toggleCreateChatModal = () => {
    dispatch({ type: "CHATS__TOGGLE_CREATE_CHAT_MODAL" });
};
