import { dispatch } from "../store/configureStore";

export const setCurrentTodosPage = (pageNumber) => {
    dispatch({ type: "TODOS_PAGINATION__SET_CURRENT_PAGE", pageNumber });
};
