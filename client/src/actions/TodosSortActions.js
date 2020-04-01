import apolloClient from "../apolloClient";

import {SET_TODOS_SORT_PARAMS } from "../constants/graphqlQueries/todosPaginationAndSortParams";

export const setTodosSortParams = (newSortField, currentTodosPage, currentSortField, currentSortOrder) => {
    const sortOrder = ((newSortField === currentSortField) && (currentSortOrder === "asc"))   //reversing sort direction
        ? "desc"
        : "asc";

    apolloClient.mutate({
        mutation: SET_TODOS_SORT_PARAMS,
        variables: {
            sortField: newSortField,
            sortOrder
        }
    });
};
