import axios from "axios";

import { dispatch } from "../store/configureStore";
import { getCompressedBase64Image } from "../helpers/Functions";

import { ADD_TODO, SET_TODOS } from "../reducers/todos";
import { TODOS_PER_PAGE, SET_TOTAL_TODO_PAGES_AMOUNT } from "../constants/todosPagination";
import { EDIT_TODO, SET_EDITABLE_TODO_ID } from "../constants/todos";

export const getTodos = (page, sortField, sortDirection) => async (dispatch) => {
    console.log("getTodos", page, sortField, sortDirection);
    const res = await axios.get(`/todos/?page=${page}&sortField=${sortField}&sortDirection=${sortDirection }`);

    const { todos, totalTodosAmount } = res.data;
    const totalTodoPagesAmount = Math.ceil(totalTodosAmount / TODOS_PER_PAGE);

    dispatch({ type: SET_TODOS, todos });
    dispatch({ type: SET_TOTAL_TODO_PAGES_AMOUNT, totalTodoPagesAmount });
};

export const addTodo = (text, image) => async (dispatch) => {
    const compressedImageBase64 =  await getCompressedBase64Image(image);
    const res = await axios.post("/todos/add_todo", { text, image: compressedImageBase64 });

    dispatch({ type: ADD_TODO, todo: res.data });
};

export const editTodo = (todoId, text, isCompleted, image) => async () => {
    try {
        const compressedImageBase64 =  await getCompressedBase64Image(image);

        const res = await axios.put(`/todos/edit_todo/${todoId}`, { text, isCompleted, image: compressedImageBase64});

        dispatch({ type: EDIT_TODO, updatedTodo: res.data });
    } catch (error) {
        console.log("An error occured during editing todo.", error);
    }
};

export const setEditableTodoId = (id) => {
    dispatch({ type: SET_EDITABLE_TODO_ID, id });
};
