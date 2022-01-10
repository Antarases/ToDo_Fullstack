import { gql } from "@apollo/client";

export const GET_TODOS_PAGINATION_AND_SORT_PARAMS = gql`
    query GetTodosPaginationAndSortParams {
        clientData @client {
            todosPagination {
                currentTodosPage
            }
            todosSortParams {
                sortField
                sortOrder
            }
        }
    }
`;

export const SET_TODOS_SORT_PARAMS = gql`
    mutation SetTodosSortParams($sortField: AllowedSortFields!, $sortOrder: AllowedSortOrders!) {
        todosSortParams__setSortParams(sortField: $sortField, sortOrder: $sortOrder) @client
    }
`;


export const SET_CURRENT_TODOS_PAGE = gql`
    mutation SetCurrentTodosPage($pageNumber: Int!) {
        todosPagination__setCurrentPage(pageNumber: $pageNumber) @client
    }
`;
