import axios from "axios";

import { SET_CURRENT_USER, SET_USER_LOGIN_STATUS_DETERMINING } from "../reducers/app";

export const identifyCurrentUser = () => async (dispatch) => {
    const currentUser = await axios.get("/api/current_user");

    dispatch({ type: SET_CURRENT_USER, user: currentUser.data });
    dispatch({ type: SET_USER_LOGIN_STATUS_DETERMINING, isUserLoginStatusDetermining: false });
};
