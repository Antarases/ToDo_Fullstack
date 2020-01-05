const initialState = {
    currentTodosPage: 1,
    totalTodoPagesAmount: null
};

export default function todosPagination(state = initialState, action) {
    switch (action.type) {
        case "TODOS_PAGINATION__SET_CURRENT_PAGE": {
            const { pageNumber } = action;

            return {
                ...state,
                currentTodosPage: pageNumber
            };
        }

        case "TODOS_PAGINATION__SET_TOTAL_PAGES_AMOUNT": {
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

