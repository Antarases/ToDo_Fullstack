import { dispatch } from "../store/configureStore";

import { SET_TODOS_SORT_PARAMS } from "../constants/todosSortParams";

export const setTodosSortParams = (sortField, sortOrder) => {
    dispatch({ type: SET_TODOS_SORT_PARAMS, sortField, sortOrder });
};
