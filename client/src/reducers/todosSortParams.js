export const initialState = {
    sortField: "creationDate",
    sortOrder: "asc"
};

export default function todosSortParams(state = initialState, action) {
    switch (action.type) {
        case "SET_TODOS_SORT_PARAMS": {
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


