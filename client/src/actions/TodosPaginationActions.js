import apolloClient from "../apolloClient";

import { SET_CURRENT_TODOS_PAGE } from "../constants/graphqlQueries/todosPaginationAndSortParams";

export const setCurrentTodosPage = (pageNumber) => {
    apolloClient.mutate({
        mutation: SET_CURRENT_TODOS_PAGE,
        variables: {
            pageNumber
        }
    });
};
