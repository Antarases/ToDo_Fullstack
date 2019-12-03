import io from "socket.io-client";
import { dispatch, getCurrentState } from "../store/configureStore";


let ChatSocket;

export const setChatSocketConnectionAndHandlers = () => {
    ChatSocket = io("/chats_ws", {
        path: "/chats_ws",
        query: {
            userId: getCurrentState().app.userData.id,
            userFullName: getCurrentState().app.userData.userFullName
        },
        forceNew: true
    });

    ChatSocket.on("get_chat_list", (data) => {
        if ((data.code >= 200) && (data.code < 300)) {
            const newChats = {};
            data.chats.forEach(chat => {
                const newChatMembers = {};
                chat._members.forEach(member => {
                    newChatMembers[member.id] = member;
                });

                newChats[chat.id] = chat;
                newChats[chat.id]._members = newChatMembers;
            });

            dispatch({ type: "CHATS__SET_CHAT_LIST", chats: newChats });
        } else {
            console.error(new Error(`Code: ${data.code}. Text: ${data.text}.`));
        }
    });

    ChatSocket.on("get_chat_messages", (data) => {
        if ((data.code >= 200) && (data.code < 300)) {
            const { messages, chatId } = data;

            const newMessages = {};
            messages.forEach(message => {
                newMessages[message.id] = message;
            });

            dispatch({ type: "CHATS__SET_CHAT_MESSAGES", messages: newMessages, chatId });
        } else {
            console.error(new Error(`Code: ${data.code}. Text: ${data.text}.`));
        }
    });

    ChatSocket.on("send_message", (data) => {
        if ((data.code >= 200) && (data.code < 300)) {
            const { message, chatId } = data;

            dispatch({ type: "CHATS__ADD_CHAT_MESSAGE", message, chatId });
        } else {
            console.error(new Error(`Code: ${data.code}. Text: ${data.text}.`));
        }
    });

    ChatSocket.on("create_chat", (data) => {
        if ((data.code >= 200) && (data.code < 300)) {
            const { chat } = data;

            dispatch({ type: "CHATS__ADD_CHAT_TO_LIST", chat });
        } else {
            console.error(new Error(`Code: ${data.code}. Text: ${data.text}.`));
        }
    });
};

export const closeChatSocketConnection = () => {
    try {
        ChatSocket.close();
    } catch (error) {
        console.error(error);   // for case when ChatSocket hasn't been initialized yet
    }
};

export const getChatList = async () => {
    if (ChatSocket) {
        ChatSocket.emit("get_chat_list");
    } else {
        const addTodoInterval = setInterval(() => {
            if (ChatSocket) {
                ChatSocket.emit("get_chat_list");
                clearInterval(addTodoInterval);
            }
        }, 1000);
    }
};

export const selectChatAndGetMessages = async (chatId) => {
    dispatch({ type: "CHATS__SET_SELECTED_CHAT", chatId });

    ChatSocket.emit("get_chat_messages", { chatId });
};

export const sendMessage = async (text, chatId) => {
    ChatSocket.emit("send_message", { text, chatId });
};

export const createChat = async (chatName, userIds) => {
    ChatSocket.emit("create_chat", { chatName, userIds });
};
