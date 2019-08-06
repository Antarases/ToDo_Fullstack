import { dispatch } from "../store/configureStore";

import { SET_TODOS_SORT_PARAMS } from "../constants/todosSortParams";

export const setTodosSortParams = (sortField, sortDirection) => {
    dispatch({ type: SET_TODOS_SORT_PARAMS, sortField, sortDirection });
};
