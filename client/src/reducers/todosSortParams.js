import { SET_TODOS_SORT_PARAMS } from "../constants/todosSortParams";

const initialState = {
    sortField: null,
    sortDirection: null
};

export default function todosSortParams(state = initialState, action) {
    switch (action.type) {
        case SET_TODOS_SORT_PARAMS: {
            const { sortField = state.sortField, sortDirection = state.sortDirection } = action;

            return {
                ...state,
                sortField,
                sortDirection
            }
        }

        default:
            return state;
    }
};


