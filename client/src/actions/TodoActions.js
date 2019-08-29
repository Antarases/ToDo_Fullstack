import axios from "axios";

import { dispatch, getCurrentState } from "../store/configureStore";
import { getCompressedBase64Image } from "../helpers/Functions";

import { ADD_TODO, SET_TODOS } from "../reducers/todos";
import { TODOS_PER_PAGE, SET_TOTAL_TODO_PAGES_AMOUNT } from "../constants/todosPagination";
import { EDIT_TODO, SET_EDITABLE_TODO_ID } from "../constants/todos";

export const getTodos = async (page, sortField, sortOrder) => {
    const res = await axios.get(`/todos/?page=${page}&sortField=${sortField}&sortOrder=${sortOrder }`);

    const { todos, totalTodosAmount } = res.data;
    const totalTodoPagesAmount = Math.ceil(totalTodosAmount / TODOS_PER_PAGE);

    dispatch({ type: SET_TODOS, todos });
    dispatch({ type: SET_TOTAL_TODO_PAGES_AMOUNT, totalTodoPagesAmount });
};

export const addTodo = async (text, image) => {
    const compressedImageBase64 = !!image
        ? await getCompressedBase64Image(image)
        : null;
    const res = await axios.post("/todos/add_todo", { text, image: compressedImageBase64 });

    const { todo, totalTodosAmount } = res.data;
    const totalTodoPagesAmount = Math.ceil(totalTodosAmount / TODOS_PER_PAGE);

    if (Object.keys(getCurrentState().todos.todos).length < TODOS_PER_PAGE) {
        dispatch({ type: ADD_TODO, todo });
    }
    dispatch({ type: SET_TOTAL_TODO_PAGES_AMOUNT, totalTodoPagesAmount });
};

export const editTodo = async (todoId, text, isCompleted, image) => {
    try {
        const compressedImageBase64 = !!image
            ? await getCompressedBase64Image(image)
            : null;

        const res = await axios.put(`/todos/edit_todo/${todoId}`, { text, isCompleted, image: compressedImageBase64});

        dispatch({ type: EDIT_TODO, updatedTodo: res.data });
    } catch (error) {
        console.log("An error occured during editing todo.", error);
    }
};

export const setEditableTodoId = (id) => {
    dispatch({ type: SET_EDITABLE_TODO_ID, id });
};
