import { dispatch } from "../store/configureStore";

import {  SET_EDITABLE_TODO_ID } from "../constants/todos";

export const setEditableTodoId = (id) => {
    dispatch({ type: SET_EDITABLE_TODO_ID, id });
};
