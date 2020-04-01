import gql from "graphql-tag";

export const GET_TODOS = gql`
    query GetTodosAndTodosAmount($page: Int!, $sortField: AllowedSortFields, $sortOrder: AllowedSortOrders) {
        todos(page: $page, sortField: $sortField, sortOrder: $sortOrder) {
            id
            author {
                id
                userFullName
            }
            text
            image
            isCompleted
            creationDate
            updatingDate
        }
        totalTodosAmount
    }
`;

export const GET_TOTAL_TODOS_AMOUNT = gql`
    query GetTotalTodosAmount {
        totalTodosAmount
    }
`;

export const GET_EDITABLE_TODO_ID = gql`
    query GetEditableTodoId {
        clientData @client {
            todos {
                editableTodoId
            }
        }
    }
`;

export const SET_EDITABLE_TODO_ID = gql`
    mutation SetEditableTodoId($id: String!) {
        todos__setEditableTodoId(id: $id) @client
    }
`;

export const GET_EDITABLE_TODO = gql`
    query GetEditableTodo {
        todos_getEditableTodoFromCache @client
    }
`;

export const ADD_TODO = gql`
    mutation AddTodo($text: String!, $image: String) {
        addTodo(text: $text, image: $image) {
            id
            author {
                id
                userFullName
            }
            text
            image
            isCompleted
            creationDate
            updatingDate
        }
    }
`;

export const SUBSCRIPTION__TODO_ADDED = gql`
    subscription OnTodoAdded {
        todoAdded {
            id
            author {
                id
                userFullName
            }
            text
            image
            isCompleted
            creationDate
            updatingDate
        }
    }
`;

export const EDIT_TODO = gql`
    mutation EditTodo($todoId: String!, $text: String!, $image: String, $isCompleted: Boolean!) {
        editTodo(todoId: $todoId, text: $text, image: $image, isCompleted: $isCompleted) {
            id
            author {
                id
                userFullName
            }
            text
            image
            isCompleted
            creationDate
            updatingDate
        }
    }
`;

export const SUBSCRIPTION__TODO_EDITED = gql`
    subscription OnTodoEdited {
        todoEdited {
            id
            author {
                id
                userFullName
            }
            text
            image
            isCompleted
            creationDate
            updatingDate
        }
    }
`;
