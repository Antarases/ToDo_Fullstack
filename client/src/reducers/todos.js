const initialState = {
    todos: {},
    totalTodosAmount: null,
    editableTodoId: null,
    isTodosLoading: false
};

export default function todos(state = initialState, action ) {
    switch (action.type) {
        case "TODOS__SET_TODOS": {
            const { todos, totalTodosAmount } = action;

            const newTodos = {};
            for (let todo of todos) {
                newTodos[todo.id] = todo
            }

            return {
                ...state,
                todos: newTodos,
                totalTodosAmount
            };
        }

        case "TODOS__ADD_TODO": {
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
                },
                totalTodosAmount: state.totalTodosAmount + 1
            };
        }

        case "TODOS__EDIT_TODO": {
            const { updatedTodo } = action;

            return {
                ...state,
                todos: {
                    ...state.todos,
                    [updatedTodo.id]: {
                        ...state.todos[updatedTodo.id],
                        text: updatedTodo.text,
                        image: updatedTodo.image,
                        isCompleted: updatedTodo.isCompleted
                    }
                }
            }
        }

        case "TODOS__SET_EDITABLE_TODO_ID": {
            const { id } = action;

            return {
                ...state,
                editableTodoId: id
            };
        }

        case "TODOS__INCREASE_TOTAL_TODOS_AMOUNT": {
            return {
                ...state,
                totalTodosAmount: state.totalTodosAmount + 1
            };
        }

        case "TODOS__SET_IS_TODOS_LOADING": {
            return {
                ...state,
                isTodosLoading: action.isLoading
            };
        }

        default:
            return state;
    }
};
