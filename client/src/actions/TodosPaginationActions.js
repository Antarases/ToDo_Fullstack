import { dispatch } from "../store/configureStore";

import { SET_CURRENT_TODOS_PAGE, SET_TOTAL_TODO_PAGES_AMOUNT } from "../constants/todosPagination";

export const setCurrentTodosPage = (pageNumber) => {
    dispatch({ type: SET_CURRENT_TODOS_PAGE, pageNumber });
};
