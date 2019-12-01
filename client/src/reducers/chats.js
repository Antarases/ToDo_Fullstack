const initialState = {
    chats: {},
    selectedChatId: null,
    userList: {},
    totalUsersAmount: null,
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

        default: {
            return state;
        }
    }
}
