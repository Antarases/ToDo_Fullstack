import { dispatch } from "../store/configureStore";

export const setCurrentTodosPage = (pageNumber) => {
    dispatch({ type: "SET_CURRENT_TODOS_PAGE", pageNumber });
};
