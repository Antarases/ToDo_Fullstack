import { SET_TODOS_SORT_PARAMS } from "../constants/todosSortParams";

const initialState = {
    sortField: null,
    sortOrder: null
};

export default function todosSortParams(state = initialState, action) {
    switch (action.type) {
        case SET_TODOS_SORT_PARAMS: {
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


