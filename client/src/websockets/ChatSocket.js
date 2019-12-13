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

export const sendMessage = async (text, chatId) => {
    ChatSocket.emit("send_message", { text, chatId });
};

export const createChat = async (chatName, userIds) => {
    const currentUserId = getCurrentState().app.userData.id;

    ChatSocket.emit("create_chat", { chatName, userIds: [...userIds, currentUserId] });
};
