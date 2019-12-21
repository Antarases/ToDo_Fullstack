import axios from "axios";
import { dispatch } from "../store/configureStore";

import { setCurrentTodosPage } from "../actions/TodosPaginationActions";

import { TODOS_PER_PAGE } from "../constants/todosPagination";

export const getTodos = async (page, sortField, sortOrder, nextPage) => {
    try {
        const res = await axios.get(`/todos/?page=${page}&sortField=${sortField}&sortOrder=${sortOrder }`);

        const { todos, totalTodosAmount } = res.data;
        const totalTodoPagesAmount = Math.ceil(totalTodosAmount / TODOS_PER_PAGE);

        dispatch({ type: "SET_TODOS", todos, totalTodosAmount });
        dispatch({ type: "SET_TOTAL_TODO_PAGES_AMOUNT", totalTodoPagesAmount });

        if (typeof nextPage === "number") {
            setCurrentTodosPage(nextPage);
        }
    } catch (error) {
        console.error("An error occured during getting todos.", error);
    }
};

export const setEditableTodoId = (id) => {
    dispatch({ type: "SET_EDITABLE_TODO_ID", id });
};
