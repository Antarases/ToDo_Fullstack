import axios from "axios";
import { dispatch } from "../store/configureStore";

export const getUserList = async () => {
    const users = await axios.get("/api/user_list", { skip: 0, limit: 55 });
    const { userList, totalUsersAmount } = users.data;

    const newUsers = {};
    userList.forEach(user => {
        newUsers[user.id] = user;
    });

    dispatch({ type: "CHATS__ADD_USERS_TO_USER_LIST", users: newUsers, totalUsersAmount });
};

export const toggleCreateChatModal = () => {
    dispatch({ type: "CHATS__TOGGLE_CREATE_CHAT_MODAL" });
};
