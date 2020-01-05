import { dispatch } from "../store/configureStore";

export const setTodosSortParams = (sortField, sortOrder) => {
    dispatch({ type: "TODOS_SORT_PARAMS__SET_SORT_PARAMS", sortField, sortOrder });
};
