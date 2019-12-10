const initialState = {
    chats: {},
    selectedChatId: null,
    totalChatsAmount: null,
    timeOfEndingLoadingFullChatList: null,
    isChatListLoading: false,
    userList: {},
    totalUsersAmount: null,
    timeOfEndingLoadingFullUserList: null,
    isUserListLoading: false,
    isCreateChatModalOpen: false
};

export default function chats(state = initialState, action) {
    switch (action.type) {
        case "CHATS__SET_CHAT_LIST": {
            return {
                ...state,
                chats: action.chats
            };
        }

        case "CHATS__ADD_CHATS_TO_CHAT_LIST": {
            const { chats, totalChatsAmount } = action;

            return {
                ...state,
                chats: {
                    ...state.chats,
                    ...chats
                },
                totalChatsAmount
            };
        }

        case "CHATS__ADD_CHAT_TO_LIST": {
            const { chat } = action;

            return {
                ...state,
                chats: {
                    ...state.chats,
                    [chat.id]: chat
                }
            };
        }

        case "CHATS__TOGGLE_CREATE_CHAT_MODAL": {
            return {
                ...state,
                isCreateChatModalOpen: !state.isCreateChatModalOpen
            };
        }

        case "CHATS__SET_SELECTED_CHAT": {
            return {
                ...state,
                selectedChatId: action.chatId
            };
        }

        case "CHATS__SET_CHAT_MESSAGES": {
            const { messages, chatId } = action;

            return {
                ...state,
                chats: {
                    ...state.chats,
                    [chatId]: {
                        ...state.chats[chatId],
                        messages
                    }
                }
            };
        }

        case "CHATS__ADD_CHAT_MESSAGE": {
            const { message, chatId } = action;

            return {
                ...state,
                chats: {
                    ...state.chats,
                    [chatId]: {
                        ...state.chats[chatId],
                        messages: {
                            ...state.chats[chatId].messages,
                            [message.id]: message
                        },
                        lastMessage: message.text
                    }
                }
            };
        }

        case "CHATS__CLEAR_CURRENT_CHAT_MESSAGES": {
            const { selectedChatId } = state;

            if (selectedChatId) {
                return {
                    ...state,
                    chats: {
                        ...state.chats,
                        [selectedChatId]: {
                            ...state.chats[selectedChatId],
                            messages: null
                        }
                    }
                };
            }
        }

        case "CHATS__ADD_USERS_TO_USER_LIST": {
            const { users, totalUsersAmount } = action;

            return {
                ...state,
                userList: {
                    ...state.userList,
                    ...users
                },
                totalUsersAmount
            };
        }

        case "CHATS__SET_IS_USER_LIST_LOADING": {
            return {
                ...state,
                isUserListLoading: action.isLoading
            };
        }

        case "CHATS__SET_IS_CHAT_LIST_LOADING": {
            return {
                ...state,
                isChatListLoading: action.isLoading
            };
        }

        case "CHATS__SET_TIME_OF_ENDING_LOADING_FULL_USER_LIST": {
            return {
                ...state,
                timeOfEndingLoadingFullUserList: action.time
            };
        }

        case "CHATS__SET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST": {
            return {
                ...state,
                timeOfEndingLoadingFullChatList: action.time
            };
        }

        default: {
            return state;
        }
    }
}
