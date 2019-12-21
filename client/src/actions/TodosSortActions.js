import { dispatch } from "../store/configureStore";

export const setTodosSortParams = (sortField, sortOrder) => {
    dispatch({ type: "SET_TODOS_SORT_PARAMS", sortField, sortOrder });
};
