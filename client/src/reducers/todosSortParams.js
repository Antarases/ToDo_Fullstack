export const initialState = {
    sortField: "creationDate",
    sortOrder: "asc"
};

export default function todosSortParams(state = initialState, action) {
    switch (action.type) {
        case "TODOS_SORT_PARAMS__SET_SORT_PARAMS": {
            const { sortField = state.sortField, sortOrder = state.sortOrder } = action;

            return {
                ...state,
                sortField,
                sortOrder
            }
        }

        default:
            return state;
    }
};


