import { gql } from "@apollo/client";

import { getEditableTodoId } from "../actions/TodoActions";

const todoResolvers = {
    Query: {
        todos_getEditableTodoFromCache: (parent, args, { cache, getCacheKey }) => {
            const editableTodoId = getEditableTodoId();

            const todoCacheId = getCacheKey({ __typename: "Todo", id: editableTodoId });

            const fragment = gql`
                fragment GetEditableTodo on Todo {
                    id
                    text
                    image
                    isCompleted
                }
            `;

            const todo = cache.readFragment({ fragment, id: todoCacheId });

            return todo;
        },
    },
    Mutation: {
        todos__setEditableTodoId: (parent, { id }, { cache }) => {
            const query = gql`
                query SetEditableTodoId {
                    clientData {
                        todos {
                            editableTodoId
                        }
                    }
                }
            `;

            const newData = {
                clientData: {
                    todos: {
                        editableTodoId: id,
                        __typename: "Todos"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData })
        },
    }
};

export default todoResolvers;
