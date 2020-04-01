import gql from "graphql-tag";

import { initialData } from "./index";

const todosSortParamsResolvers = {
    Mutation: {
        todosSortParams__setSortParams: (
            parent,
            {
                sortField = initialData.todosSortParams.sortField,
                sortOrder = initialData.todosSortParams.sortOrder
            },
            { cache }
        ) => {
            const query = gql`
                query SetSortParams {
                    clientData @client {
                        todosSortParams {
                            sortField
                            sortOrder
                        }
                    }
                }
            `;

            const newData = {
                clientData: {
                    todosSortParams: {
                        sortField,
                        sortOrder,
                        __typename: "TodosSortParams"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeData({ query, data: newData });
        },
    }
};

export default todosSortParamsResolvers;
