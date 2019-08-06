import { SET_CURRENT_TODOS_PAGE, SET_TOTAL_TODO_PAGES_AMOUNT } from "../constants/todosPagination";

export const setCurrentTodosPage = (pageNumber) => {
    return {
        type: SET_CURRENT_TODOS_PAGE,
        pageNumber
    };
};

export const setTotalTodoPagesAmount = (totalTodoPagesAmount) => {
    return {
        type: SET_TOTAL_TODO_PAGES_AMOUNT,
        totalTodoPagesAmount
    }
};

