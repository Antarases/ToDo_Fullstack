import gql from "graphql-tag";
import merge from "lodash/merge";

import todoResolvers from "./todos";
import todosPaginationResolvers from "./todosPagination";
import todosSortParamsResolvers from "./todosSortParams";
import chatResolvers from "./chats";
import userResolvers from "./users";
import notificationModalResolvers from "./notificationsModal";

export const initialData = {
    clientData: {
        __typename: "ClientData",
        todos: {
            __typename: "Todos",
            totalTodosAmount: null,
            editableTodoId: null
        },
        todosPagination: {
            __typename: "TodosPagination",
            currentTodosPage: 1
        },
        todosSortParams: {
            __typename: "TodosSortParams",
            sortField: "creationDate",
            sortOrder: "asc"
        },
        chats: {
            __typename: "Chats",
            selectedChatId: null,
            messagesCursor: "",
            isChatListLoading: false,
            timeOfEndingLoadingFullChatList: null,
            isMessageListLoading: false,
            timeOfEndingLoadingFullCurrentChatMessageList: null,
            isCreateChatModalOpen: false
        },
        users: {
            __typename: "Users",
            isUserListLoading: false,
            timeOfEndingLoadingFullUserList: null,
        },
        notificationsModal: {
            __typename: "NotificationsModal",
            queue: [],
            currentModal: false
        }
    },
    chats: [],
    users: []
};

export const typeDefs = gql`
    enum AllowedSortFields {
        userFullName
        creationDate
        isCompleted
    }
    
    enum AllowedSortOrders {
        asc
        desc
    }
`;

export const resolvers = merge(todoResolvers, todosPaginationResolvers, todosSortParamsResolvers, chatResolvers, userResolvers, notificationModalResolvers);
