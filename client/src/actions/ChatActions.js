import apolloClient, { cache } from "../apolloClient";
import { gql } from "@apollo/client";

import { showNotificationModal } from "./NotificationsModalActions";

import { isNewListRequestsAllowed } from "../helpers/functions";

import { chatsReducer } from "../schema/chats";

import { GET_CURRENT_USER } from "../constants/graphqlQueries/users";
import { GET_SELECTED_CHAT_ID, SET_SELECTED_CHAT_ID, GET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST, SET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST, GET_IS_CHAT_LIST_LOADING, SET_IS_CHAT_LIST_LOADING, GET_CHATS_CURSOR, SET_CHATS_CURSOR, GET_CHATS, GET_CHATS_FROM_CACHE, GET_CHAT_BY_ID, GET_CHAT_BY_ID_FROM_CACHE, ADD_CHAT_TO_CHAT_LIST, RELOCATE_CHAT_TO_TOP_OF_CHAT_LIST, GET_TOTAL_CHATS_AMOUNT, GET_TOTAL_CHAT_MESSAGES_AMOUNT, GET_CHAT_MESSAGES, ADD_MESSAGES_TO_MESSAGE_LIST, ADD_CHAT_MESSAGE, SEND_MESSAGE, TOGGLE_CREATE_CHAT_MODAL, CREATE_CHAT } from "../constants/graphqlQueries/chats";
import { FETCHED_CHATS_LIMIT, FETCHED_MESSAGES_LIMIT } from "../constants/chats";

import { initialData } from "../schema";


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

const getChatsCursor = async () => {
    const { data: chatsCursorData } = await apolloClient.query({
        query: GET_CHATS_CURSOR
    });

    return chatsCursorData.clientData.chats.chatsCursor;
};

const setChatsCursor = (chatsCursor) => {
    apolloClient.mutate({
        mutation: SET_CHATS_CURSOR,
        variables: {
            chatsCursor
        }
    });
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
    cache.updateQuery({
        query: gql`
            query AddChatsToChatList {
                chats {
                    id
                    name
                    members {
                        id
                        googleId
                        userFullName
                        email
                        avatar
                        isAdmin
                    }
                    messages
                    lastMessage
                    creationDate
                    updatingDate
                    messagesCursor
                    isMessageListLoading
                    timeOfEndingLoadingFullMessageList
                }
            }
        `
    }, (data) => {
        return {
            chats: [
                ...data?.chats,
                ...chatsReducer(chats)
            ]
        };
    });
};

export const getChatList = async () => {
    try {
        const [
            currentChats,
            currentChatsCursor,
            isChatListLoading,
            timeOfEndingLoadingFullChatList
        ] = await Promise.all([
            getChatsFromCache(),
            getChatsCursor(),
            getIsChatListLoading(),
            getTimeOfEndingLoadingFullChatList()
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
                            cursor: currentChatsCursor,
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

            const fetchedChatsAmount = (chats && chats.data) ? chats.data.length : 0;

            if (fetchedChatsAmount) {
                addChatsToChatList(chats.data);
            }

            chats.paginationMetadata.nextCursor
                && setChatsCursor(chats.paginationMetadata.nextCursor);

            if ((currentChatsAmount + fetchedChatsAmount) >= totalChatsAmount) {
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

const MESSAGES_CURSOR_FRAGMENT = gql`
    fragment MessagesCursor on Chat {
        messagesCursor
    }
`;

const getMessagesCursor = (chatId) => {
    const { messagesCursor } = cache.readFragment({
        id: "Chat:" + chatId,
        fragment: MESSAGES_CURSOR_FRAGMENT
    });

    return messagesCursor;
};

const setMessagesCursor = (chatId, messagesCursor) => {
    cache.writeFragment({
        id: "Chat:" + chatId,
        fragment: MESSAGES_CURSOR_FRAGMENT,
        data: {
            messagesCursor
        }
    });
};

const IS_MESSAGE_LIST_LOADING_FRAGMENT = gql`
    fragment IsMessageListLoadingFragment on Chat {
        isMessageListLoading
    }
`;

const getIsMessageListLoading = (chatId) => {
    const { isMessageListLoading } = cache.readFragment({
        id: "Chat:" + chatId,
        fragment: IS_MESSAGE_LIST_LOADING_FRAGMENT
    });

    return isMessageListLoading;
};

const setIsMessageListLoading = (chatId, isLoading) => {
    cache.writeFragment({
        id: "Chat:" + chatId,
        fragment: IS_MESSAGE_LIST_LOADING_FRAGMENT,
        data: {
            isMessageListLoading: isLoading
        }
    });
};

const TIME_OF_ENDING_LOADING_FULL_MESSAGE_LIST = gql`
    fragment TimeOfEndingLoadingFullMessageList on Chat {
        timeOfEndingLoadingFullMessageList
    }
`;

const getTimeOfEndingLoadingFullMessageList = (chatId) => {
    const { timeOfEndingLoadingFullMessageList } = cache.readFragment({
        id: "Chat:" + chatId,
        fragment: TIME_OF_ENDING_LOADING_FULL_MESSAGE_LIST
    });

    return timeOfEndingLoadingFullMessageList;
};

const setTimeOfEndingLoadingFullMessageList = (chatId, time) => {
    cache.writeFragment({
        id: "Chat:" + chatId,
        fragment: TIME_OF_ENDING_LOADING_FULL_MESSAGE_LIST,
        data: {
            timeOfEndingLoadingFullMessageList: time
        }
    });
};

const getChatMessagesAmount = (chatId) => {
    const { messages } = cache.readFragment({
        id: "Chat:" + chatId,
        fragment: gql`
            fragment ChatMessages on Chat {
                messages {
                    id
                }
            }
        `
    });

    return messages.length;
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
        const currentMessagesAmount = getChatMessagesAmount(chatId);
        const messagesCursor = getMessagesCursor(chatId);
        const isMessageListLoading = getIsMessageListLoading(chatId);
        const timeOfEndingLoadingFullMessageList = getTimeOfEndingLoadingFullMessageList(chatId);

        if (
            isNewListRequestsAllowed(isMessageListLoading, timeOfEndingLoadingFullMessageList)
        ) {
            setIsMessageListLoading(chatId, true);

            const [
                messages,
                totalChatMessagesAmount
            ] = await Promise.all([
                async function() {
                    const { data: chatMessagesData } = await apolloClient.query({
                        query: GET_CHAT_MESSAGES,
                        variables: {
                            chatId,
                            cursor: messagesCursor,
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

            const fetchedMessagesAmount = messages?.data?.length || 0;

            if (fetchedMessagesAmount) {
                addMessagesToMessageList(chatId, messages.data);
            }

            messages.paginationMetadata.nextCursor
            && setMessagesCursor(chatId, messages.paginationMetadata.nextCursor);

            if ((currentMessagesAmount + fetchedMessagesAmount) >= totalChatMessagesAmount) {
                setTimeOfEndingLoadingFullMessageList(chatId, Date.now())
            }

            setIsMessageListLoading(chatId, false);
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
