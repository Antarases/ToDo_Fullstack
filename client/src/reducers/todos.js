import { EDIT_TODO, SET_EDITABLE_TODO_ID } from "../constants/todos";

const initialState = {
    todos: {},
    editableTodoId: null
};

export const ADD_TODO = "ADD_TODO";
export const SET_TODOS = "SET_TODOS";

export default function todos(state = initialState, action ) {
    switch (action.type) {
        case SET_TODOS: {
            const { todos } = action;

            const newTodos = {};
            for (let todo of todos) {
                newTodos[todo.id] = todo
            }

            return {
                ...state,
                todos: newTodos
            };
        }

        case ADD_TODO: {
            const { todo } = action;

            return {
                ...state,
                todos: {
                    ...state.todos,
                    [todo.id]: {
                        id: todo.id,
                        userId: todo._user,
                        text: todo.text,
                        image: todo.image
                    }
                }
            };
        }

        case EDIT_TODO: {
            const { updatedTodo } = action;

            return {
                ...state,
                todos: {
                    ...state.todos,
                    [updatedTodo.id]: {
                        ...state.todos[updatedTodo.id],
                        text: updatedTodo.text,
                        image: updatedTodo.image
                    }
                }
            }
        }

        case SET_EDITABLE_TODO_ID: {
            const { id } = action;

            return {
                ...state,
                editableTodoId: id
            };
        }

        default:
            return state;
    }
};
