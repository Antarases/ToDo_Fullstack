import axios from "axios";
import { dispatch } from "../store/configureStore";

export const identifyCurrentUser = async () => {
    const currentUser = await axios.get("/api/current_user");

    dispatch({ type: "SET_CURRENT_USER", user: currentUser.data });
    dispatch({ type: "SET_USER_LOGIN_STATUS_DETERMINING", isUserLoginStatusDetermining: false });
};
