import { gql } from "@apollo/client";

const todosPaginationResolvers = {
    Mutation: {
        todosPagination__setCurrentPage: (parent, { pageNumber }, { cache }) => {
            const query = gql`
                query SetCurrentTodosPage {
                    clientData @client {
                        todosPagination {
                            currentTodosPage
                        }
                    }
                }
            `;

            const newData = {
                clientData: {
                    todosPagination: {
                        currentTodosPage: pageNumber,
                        __typename: "TodosPagination"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
    }
};

export default todosPaginationResolvers;
