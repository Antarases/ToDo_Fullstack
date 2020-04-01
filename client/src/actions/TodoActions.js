import apolloClient from "../apolloClient";

import { showNotificationModal } from "./NotificationsModalActions";

import { getCompressedBase64Image } from "../helpers/functions";

import { ADD_TODO, EDIT_TODO, GET_EDITABLE_TODO_ID, SET_EDITABLE_TODO_ID } from "../constants/graphqlQueries/todos";

export const addTodo = async (text, image) => {
    try {
        const compressedImageBase64 = !!image
            ? await getCompressedBase64Image(image)
            : null;

        apolloClient.mutate({
            mutation: ADD_TODO,
            variables: {
                text,
                image: compressedImageBase64
            }
        })
        .catch(error => {
            showNotificationModal({
                body: "An error occurred during adding TODO. " + error,
                buttons: [{ text: "OK" }],
                showFailIcon: true
            });
        });

        showNotificationModal({
            header: null,
            body: "Todo has been sent",
            buttons: [{ text: "OK" }],
            onClose: null,
            showSuccessIcon: true
        });
    } catch (error) {
        console.error(error);

        showNotificationModal({
            body: "An error occurred during adding TODO. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};

export const editTodo = async ({ todoId, text, image, isCompleted }) => {
    try {
        let compressedImageBase64;
        if (!!image) {
            compressedImageBase64 = (typeof(image) === "string")
                ? image
                : await getCompressedBase64Image(image);
        } else {
            compressedImageBase64 = null;
        }

        apolloClient.mutate({
            mutation: EDIT_TODO,
            variables: {
                todoId,
                text,
                image: compressedImageBase64,
                isCompleted
            }
        })
        .catch(error => {
            showNotificationModal({
                body: "An error occurred during editing TODO. " + error,
                buttons: [{ text: "OK" }],
                showFailIcon: true
            });
        });

        showNotificationModal({
            body: "Todo updates has been sent",
            buttons: [{ text: "OK" }],
            showSuccessIcon: true
        });
    } catch (error) {
        console.error(error);

        showNotificationModal({
            body: "An error occurred during editing TODO. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }

    setEditableTodoId(null);
};

export const getEditableTodoId = () => {
    const editableTodoIdData = apolloClient.readQuery({ query: GET_EDITABLE_TODO_ID });

    return editableTodoIdData.clientData.todos.editableTodoId;
};

export const setEditableTodoId = (todoId) => {
    apolloClient.mutate({
        mutation: SET_EDITABLE_TODO_ID,
        variables: {
            id: todoId
        }
    });
};
