import apolloClient from "../apolloClient";

import { showNotificationModal } from "./NotificationsModalActions";

import { isNewListRequestsAllowed } from "../helpers/functions";

import { GET_CURRENT_USER } from "../constants/graphqlQueries/users";
import { CLEAR_CURRENT_CHAT_MESSAGES, RESET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST, GET_SELECTED_CHAT_ID, SET_SELECTED_CHAT_ID, GET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST, SET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST, GET_IS_CHAT_LIST_LOADING, SET_IS_CHAT_LIST_LOADING, ADD_CHATS_TO_CHAT_LIST, GET_CHATS, GET_CHATS_FROM_CACHE, GET_CHAT_BY_ID, GET_CHAT_BY_ID_FROM_CACHE, ADD_CHAT_TO_CHAT_LIST, RELOCATE_CHAT_TO_TOP_OF_CHAT_LIST, GET_TOTAL_CHATS_AMOUNT, GET_TOTAL_CHAT_MESSAGES_AMOUNT, GET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST, SET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST, GET_IS_MESSAGE_LIST_LOADING, SET_IS_MESSAGE_LIST_LOADING, GET_MESSAGES_CURSOR, SET_MESSAGES_CURSOR, GET_CHAT_MESSAGES, GET_CHAT_MESSAGES_AMOUNT_FROM_CACHE, ADD_MESSAGES_TO_MESSAGE_LIST, ADD_CHAT_MESSAGE, SEND_MESSAGE, TOGGLE_CREATE_CHAT_MODAL, CREATE_CHAT, ADD_CHAT_TO_LIST } from "../constants/graphqlQueries/chats";
import { FETCHED_CHATS_LIMIT, FETCHED_MESSAGES_LIMIT } from "../constants/chats";

import { initialData } from "../schema";


export const clearCurrentChatMessages = () => {
    apolloClient.mutate({
        mutation: CLEAR_CURRENT_CHAT_MESSAGES
    })
};

export const resetTimeOfEndingLoadingFullCurrentChatMessageList = () => {
    apolloClient.mutate({
        mutation: RESET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST
    })
};

export const getSelectedChatId = async () => {
    const { data: selectedChatIdData } = await apolloClient.query({
        query: GET_SELECTED_CHAT_ID
    });

    return selectedChatIdData.clientData.chats.selectedChatId;
};

export const setSelectedChatId = (chatId) => {
    apolloClient.mutate({
        mutation: SET_SELECTED_CHAT_ID,
        variables: {
            chatId
        }
    });
};

export const setSelectedChat = async (chatId) => {
    await Promise.all([
        clearCurrentChatMessages(),
        resetTimeOfEndingLoadingFullCurrentChatMessageList(),
        setSelectedChatId(chatId),
        setMessagesCursor(initialData.clientData.chats.messagesCursor)
    ]);
};

const getTimeOfEndingLoadingFullChatList = async () => {
    const { data: timeOfEndingLoadingFullChatListData } = await apolloClient.query({
        query: GET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST
    });

    return timeOfEndingLoadingFullChatListData.clientData.chats.timeOfEndingLoadingFullChatList;
};

const setTimeOfEndingLoadingFullChatList = (time) => {
    apolloClient.mutate({
        mutation: SET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST,
        variables: {
            time
        }
    });
};

const getIsChatListLoading = async () => {
    const { data: isChatListLoadingData } = await apolloClient.query({
        query: GET_IS_CHAT_LIST_LOADING
    });

    return isChatListLoadingData.clientData.chats.isChatListLoading;
};

const setIsChatListLoading = (isLoading) => {
    apolloClient.mutate({
        mutation: SET_IS_CHAT_LIST_LOADING,
        variables: {
            isLoading
        }
    });
};

const getChatsFromCache = async () => {
    const { data: chatsData } = await apolloClient.query({
        query: GET_CHATS_FROM_CACHE
    });

    return chatsData.chats;
};

const getTotalChatsAmount = async () => {
    const { data: totalChatsAmountData } = await apolloClient.query({
        query: GET_TOTAL_CHATS_AMOUNT,
        fetchPolicy: "no-cache"
    });

    return totalChatsAmountData
        ? totalChatsAmountData.totalChatsAmount
        : null;
};

const addChatsToChatList = (chats) => {
    apolloClient.mutate({
        mutation: ADD_CHATS_TO_CHAT_LIST,
        variables: {
            chats
        }
    });
};

export const getChatList = async () => {
    try {
        const [
            timeOfEndingLoadingFullChatList,
            isChatListLoading,
            currentChats
        ] = await Promise.all([
            getTimeOfEndingLoadingFullChatList(),
            getIsChatListLoading(),
            getChatsFromCache()
        ]);

        const currentChatsAmount = currentChats.length;

        if (
            isNewListRequestsAllowed(isChatListLoading, timeOfEndingLoadingFullChatList)
        ) {
            setIsChatListLoading(true);

            const [
                chats,
                totalChatsAmount
            ] = await Promise.all([
                async function() {
                    const { data: chatsData } = await apolloClient.query({
                        query: GET_CHATS,
                        variables: {
                            skip: currentChatsAmount,
                            limit: FETCHED_CHATS_LIMIT
                        },
                        fetchPolicy: "no-cache"
                    });

                    return chatsData
                        ? chatsData.chats
                        : initialData.chats;
                }(),
                getTotalChatsAmount()
            ]);

            const fetchedChatsAmount = chats ? chats.length : 0;

            if (fetchedChatsAmount) {
                addChatsToChatList(chats);
            }

            if ((currentChatsAmount + chats.length) >= totalChatsAmount) {
                setTimeOfEndingLoadingFullChatList(Date.now());
            }
            setIsChatListLoading(false);
        }
    } catch (error) {
        console.error("An error occured during getting chat list.", error);

        showNotificationModal({
            body: "An error occured during getting chat list. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};

export const getChatById = async (chatId) => {
    const { data: chatData } = await apolloClient.query({
        query: GET_CHAT_BY_ID,
        variables: {
            chatId
        },
        fetchPolicy: "no-cache"
    });

    return chatData.chat;
};

export const getChatByIdFromCache = async (chatId) => {
    const { data: chatData } = await apolloClient.query({
        query: GET_CHAT_BY_ID_FROM_CACHE,
        variables: {
            chatId
        },
        fetchPolicy: "no-cache"
    });

    return chatData.chats__getChatByIdFromCache;
};

export const addChatToChatList = (chat) => {
    apolloClient.mutate({
        mutation: ADD_CHAT_TO_CHAT_LIST,
        variables: {
            chat
        }
    });
};

export const relocateChatToTopOfChatList = async (chatId) => {
    await apolloClient.mutate({
        mutation: RELOCATE_CHAT_TO_TOP_OF_CHAT_LIST,
        variables: {
            chatId
        }
    });
};

const getMessagesCursor = async () => {
    const { data: messagesCursorData } = await apolloClient.query({
        query: GET_MESSAGES_CURSOR
    });

    return messagesCursorData.clientData.chats.messagesCursor;
};

const setMessagesCursor = (messagesCursor) => {
    apolloClient.mutate({
        mutation: SET_MESSAGES_CURSOR,
        variables: {
            messagesCursor
        }
    });
};

const getIsMessageListLoading = async () => {
    const { data: isMessageListLoadingData } = await apolloClient.query({
        query: GET_IS_MESSAGE_LIST_LOADING
    });

    return isMessageListLoadingData.clientData.chats.isMessageListLoading;
};

const setIsMessageListLoading = (isLoading) => {
    apolloClient.mutate({
        mutation: SET_IS_MESSAGE_LIST_LOADING,
        variables: {
            isLoading
        }
    });
};

const getTimeOfEndingLoadingFullCurrentChatMessageList = async () => {
    const { data: timeOfEndingLoadingFullCurrentChatMessageListData } = await apolloClient.query({
        query: GET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST
    });

    return timeOfEndingLoadingFullCurrentChatMessageListData.clientData.chats.timeOfEndingLoadingFullCurrentChatMessageList;
};

const setTimeOfEndingLoadingFullCurrentChatMessageList = (time) => {
    apolloClient.mutate({
        mutation: SET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST,
        variables: {
            time
        }
    });
};

const getChatMessagesAmount = async (chatId) => {
    const { data: chatMessagesAmountData } = await apolloClient.query({
        query: GET_CHAT_MESSAGES_AMOUNT_FROM_CACHE,
        variables: {
            chatId
        },
        fetchPolicy: "no-cache"
    });

    return chatMessagesAmountData.chats__getChatMessagesAmountFromCache.messagesAmount;
};

const getTotalChatMessagesAmount = async (chatId) => {
    const { data: totalChatMessagesAmountData } = await apolloClient.query({
        query: GET_TOTAL_CHAT_MESSAGES_AMOUNT,
        variables: {
            chatId
        },
        fetchPolicy: "no-cache"
    });

    return totalChatMessagesAmountData
        ? totalChatMessagesAmountData.totalChatMessagesAmount
        : null;
};

export const addChatMessage = (chatId, message) => {
    apolloClient.mutate({
        mutation: ADD_CHAT_MESSAGE,
        variables: {
            chatId,
            message
        }
    });
};

const addMessagesToMessageList = (chatId, messages) => {
    apolloClient.mutate({
        mutation: ADD_MESSAGES_TO_MESSAGE_LIST,
        variables: {
            chatId,
            messages
        }
    });
};

export const getChatMessages = async (chatId) => {
    try {
        const [
            currentMessagesAmount,
            currentMessagesCursor,
            isMessageListLoading,
            timeOfEndingLoadingFullCurrentChatMessageList
        ] = await Promise.all([
            getChatMessagesAmount(chatId),
            getMessagesCursor(),
            getIsMessageListLoading(),
            getTimeOfEndingLoadingFullCurrentChatMessageList()
        ]);

        if (
            isNewListRequestsAllowed(isMessageListLoading, timeOfEndingLoadingFullCurrentChatMessageList)
        ) {
            setIsMessageListLoading(true);

            const [
                messages,
                totalChatMessagesAmount
            ] = await Promise.all([
                async function() {
                    const { data: chatMessagesData } = await apolloClient.query({
                        query: GET_CHAT_MESSAGES,
                        variables: {
                            chatId,
                            cursor: currentMessagesCursor,
                            limit: FETCHED_MESSAGES_LIMIT
                        },
                        fetchPolicy: "no-cache"
                    });

                    return chatMessagesData
                        ? chatMessagesData.chat.messages
                        : null;
                }(),
                getTotalChatMessagesAmount(chatId)
            ]);

            const fetchedMessagesAmount = (messages && messages.data) ? messages.data.length : 0;

            if (fetchedMessagesAmount) {
                addMessagesToMessageList(chatId, messages.data);
            }

            messages.paginationMetadata.nextCursor
                && setMessagesCursor(messages.paginationMetadata.nextCursor);

            const selectedChatId = await getSelectedChatId();

            if (
                (chatId === selectedChatId)
                && (currentMessagesAmount + fetchedMessagesAmount) >= totalChatMessagesAmount)
            {
                setTimeOfEndingLoadingFullCurrentChatMessageList(Date.now())
            }

            setIsMessageListLoading(false);
        }
    } catch (error) {
        console.error("An error occured during getting chat messages.", error);

        showNotificationModal({
            body: "An error occured during getting chat messages. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};

export const sendMessage = async (chatId, text) => {
    apolloClient.mutate({
        mutation: SEND_MESSAGE,
        variables: {
            chatId,
            text
        }
    })
    .catch(error => {
        showNotificationModal({
            body: "An error occurred during sending message. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    });
};

export const toggleCreateChatModal = () => {
    apolloClient.mutate({
        mutation: TOGGLE_CREATE_CHAT_MODAL
    });
};

export const createChat = async (chatName, userIds) => {
    const { data: currentUserData } = await apolloClient.query({
        query: GET_CURRENT_USER
    });

    const currentUserId = currentUserData
        ? currentUserData.currentUser.id
        : null;

    if (currentUserId) {
        apolloClient.mutate({
            mutation: CREATE_CHAT,
            variables: {
                chatName,
                userIds: [...userIds, currentUserId]
            }
        })
        .catch(error => {
            showNotificationModal({
                body: "An error occurred during chat creation. " + error,
                buttons: [{ text: "OK" }],
                showFailIcon: true
            });
        });
    }
};

export const addChatToList = (chat) => {
    apolloClient.mutate({
        mutation: ADD_CHAT_TO_LIST,
        variables: {
            chat
        }
    });
};
