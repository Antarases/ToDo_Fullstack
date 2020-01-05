import io from "socket.io-client";
import { dispatch, getCurrentState } from "../store/configureStore";

import { showNotificationModal } from "../actions/NotificationsModalActions";

import { getCompressedBase64Image } from "../helpers/functions";

import { INITIAL_TODOS_PAGE, TODOS_PER_PAGE } from "../constants/todosPagination";
import { initialState as sortParamsInitialState } from "../reducers/todosSortParams";


let TodoSocket;

export const setTodoSocketConnectionAndHandlers = () => {
    TodoSocket = io("/todos_ws", {
        path: "/todos_ws",
        query: {
            userId: getCurrentState().app.userData.id,
            userFullName: getCurrentState().app.userData.userFullName,
            isAdmin: getCurrentState().app.currentUserStatus.isAdmin,
            initialPage: INITIAL_TODOS_PAGE,
            sortField: sortParamsInitialState.sortField,
            sortOrder: sortParamsInitialState.sortOrder
        },
        forceNew: true
    });

    TodoSocket.on("add_todo", (data) => {
        const { todo, code, text } = data;

        if ((code >= 200) && (code < 300)) {
            const totalTodosAmount = getCurrentState().todos.totalTodosAmount;
            const newTotalTodoPagesAmount = Math.ceil((totalTodosAmount + 1) / TODOS_PER_PAGE);
            const todosOnPageAmount = Object.keys(getCurrentState().todos.todos).length;

            if (todosOnPageAmount < TODOS_PER_PAGE) {
                dispatch({ type: "TODOS__ADD_TODO", todo });
            } else {
                dispatch({ type: "TODOS_PAGINATION__SET_TOTAL_PAGES_AMOUNT", totalTodoPagesAmount: newTotalTodoPagesAmount });
                dispatch({ type: "TODOS__INCREASE_TOTAL_TODOS_AMOUNT" });
            }
        } else {
            console.error(new Error(`Code: ${code}. Text: ${text}.`));

            showNotificationModal(
                null,
                `Error. Code: ${code}. Text: ${text}.`,
                [{ text: "OK" }],
                null,
                false,
                true
            );
        }
    });

    TodoSocket.on("edit_todo", (data) => {
        const { todo, code, text} = data;

        if ((code >= 200) && (code < 300)) {
            dispatch({ type: "TODOS__EDIT_TODO", updatedTodo: todo });
        } else {
            console.error(new Error(`Code: ${code}. Text: ${text}.`));

            showNotificationModal(
                null,
                `Error. Code: ${code}. Text: ${text}.`,
                [{ text: "OK" }],
                null,
                false,
                true
            );
        }
    });
};

export const closeTodoSocketConnection = () => {
    try {
        TodoSocket.close();
    } catch (error) {
        console.error(error);   // for case when TodoSocket hasn't been initialized yet
    }
};

export const addTodo = async (text, image) => {
    const compressedImageBase64 = !!image
        ? await getCompressedBase64Image(image)
        : null;

    if (TodoSocket) {
        TodoSocket.emit("add_todo", { text, image: compressedImageBase64 });

        showNotificationModal(
            null,
            "Todo has been sent",
            [{ text: "OK" }],
            null,
            true
        );
    } else {
        const addTodoInterval = setInterval(() => {
            if (TodoSocket) {
                TodoSocket.emit("add_todo", { text, image: compressedImageBase64 });
                clearInterval(addTodoInterval);
            }
        }, 1000);
    }
};

export const editTodo = async (todoId, text, image, isCompleted) => {
    const compressedImageBase64 = !!image
        ? await getCompressedBase64Image(image)
        : null;

    if (TodoSocket) {
        TodoSocket.emit("edit_todo", { id: todoId, text, image: compressedImageBase64, isCompleted });

        showNotificationModal(
            null,
            "Todo updates has been sent",
            [{ text: "OK" }],
            null,
            true
        );
    } else {
        const editTodoInterval = setInterval(() => {
            if (TodoSocket) {
                TodoSocket.emit("edit_todo", { id: todoId, text, image: compressedImageBase64, isCompleted });
                clearInterval(editTodoInterval);
            }
        }, 1000);
    }
};
