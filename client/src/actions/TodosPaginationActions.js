import { dispatch } from "../store/configureStore";

import { SET_CURRENT_TODOS_PAGE } from "../constants/todosPagination";

export const setCurrentTodosPage = (pageNumber) => {
    dispatch({ type: SET_CURRENT_TODOS_PAGE, pageNumber });
};
