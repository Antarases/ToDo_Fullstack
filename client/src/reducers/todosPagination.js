const initialState = {
    currentTodosPage: 1,
    totalTodoPagesAmount: null
};

export default function todosPagination(state = initialState, action) {
    switch (action.type) {
        case "SET_CURRENT_TODOS_PAGE": {
            const { pageNumber } = action;

            return {
                ...state,
                currentTodosPage: pageNumber
            };
        }

        case "SET_TOTAL_TODO_PAGES_AMOUNT": {
            const { totalTodoPagesAmount } = action;

            return {
                ...state,
                totalTodoPagesAmount
            };
        }

        default:
            return state;
    }
};

