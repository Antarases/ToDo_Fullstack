import gql from "graphql-tag";

export const GET_SELECTED_CHAT_ID = gql`
    query GetSelectedChatId {
        clientData @client {
            chats {
                selectedChatId
            }
        }
    }
`;

export const SET_SELECTED_CHAT_ID = gql`
    mutation SelSelectedChatId($chatId: String!) {
        chats__setSelectedChatId(chatId: $chatId) @client
    }
`;

export const GET_SELECTED_CHAT = gql`
    query GetSelectedChat($selectedChatId: String!) {
        clientData @client {
            chats {
                selectedChatId @client @export(as: "selectedChatId")
            }
        }
        chat(id: $selectedChatId) {
            id
            name
            members {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            messages {
                id
                text
                author {
                    id
                    googleId
                    userFullName
                    email
                    avatar
                    isAdmin
                }
                creationDate
                updatingDate
            }
            lastMessage
            creationDate
            updatingDate
        }
    }
`;

export const ADD_CHATS_TO_CHAT_LIST = gql`
    mutation AddChatsToChatList($chats: [Chat!]) {
        chats__addChatsToChatList(chats: $chats) @client
    }
`;

export const GET_CHATS = gql`
    query GetChats($skip: Int!, $limit: Int!) {
        chats(skip: $skip, limit: $limit) @connection(key: "chats") {
            id
            name
            members {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            messages(cursor: "", limit: 0) @connection(key: "messages") {  #this returns an empty data array; required to firing queries on cache for getting current messages amount.
                data {
                    id
                }
                paginationMetadata {
                    nextCursor
                }
            }
            lastMessage
            creationDate
            updatingDate
        }
    }
`;

export const GET_CHATS_FROM_CACHE = gql`
    query GetChatsFromCache {
        chats @client {
            id
            name
            members {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            lastMessage
            creationDate
            updatingDate
        }
    }
`;

export const RELOCATE_CHAT_TO_TOP_OF_CHAT_LIST = gql`
    mutation RelocateChatToTopOfChatList($chatId: String!) {
        chats__relocateChatToTopOfChatList(chatId: $chatId) @client
    }
`;

export const GET_TOTAL_CHATS_AMOUNT = gql`
    query GetTotalChatsAmount {
        totalChatsAmount
    }
`;

export const GET_MESSAGES_CURSOR = gql`
    query GetMessagesCursor {
        clientData @client {
            chats {
                messagesCursor
            }
        }
    }
`;

export const SET_MESSAGES_CURSOR = gql`
    mutation SetMessagesCursor($messagesCursor: String!) {
        chats__setMessagesCursor(messagesCursor: $messagesCursor) @client
    }
`;

export const GET_CHAT_MESSAGES = gql`
    query GetChatMessages($chatId: String!, $cursor: String!, $limit: Int!) {
        chat(chatId: $chatId) {
            messages(cursor: $cursor, limit: $limit) {
                data {
                    id
                    text
                    author {
                        id
                        googleId
                        userFullName
                        email
                        avatar
                        isAdmin
                    }
                    creationDate
                    updatingDate
                }
                paginationMetadata {
                    nextCursor
                }
            }
        }
    }
`;

export const GET_CHAT_MESSAGES_AMOUNT_FROM_CACHE = gql`
    query GetChatMessagesAmountFromCache($chatId: String!) {
        chats__getChatMessagesAmountFromCache(chatId: $chatId) @client
    }
`;

export const GET_TOTAL_CHAT_MESSAGES_AMOUNT = gql`
    query GetTotalChatMessagesAmount($chatId: String!) {
        totalChatMessagesAmount(chatId: $chatId)
    }
`;

export const ADD_CHAT_MESSAGE = gql`
    mutation AddChatMessage($chatId: String!, $message: Message!) {
        chats__addChatMessage(chatId: $chatId, message: $message) @client
    }
`;

export const ADD_MESSAGES_TO_MESSAGE_LIST = gql`
    mutation AddMessagesToMessageList($chatId: String!, $messages: [Message!]!) {
        chats__addMessagesToMessageList(chatId: $chatId, messages: $messages) @client
    }
`;

export const SEND_MESSAGE = gql`
    mutation SendMessage($chatId: String!, $text: String!) {
        sendMessage(chatId: $chatId, text: $text) {
            id
            text
            author {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            creationDate
            updatingDate
        }
    }
`;

export const SUBSCRIPTION__MESSAGE_SENT = gql`
    subscription OnMessageSent {
        messageSent {
            id
            text
            author {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            chatId
            creationDate
            updatingDate
        }
    }
`;

export const GET_IS_CREATE_CHAT_MODAL_OPEN = gql`
    query GetIsCreateChatModalOpen {
        clientData @client {
            chats {
                isCreateChatModalOpen
            }
        }
    }
`;

export const TOGGLE_CREATE_CHAT_MODAL = gql`
    mutation ToggleCreateChatModal {
        chats__toggleCreateChatModal @client
    }
`;

export const RESET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST = gql`
    mutation ResetTimeOfEndingLoadingFullCurrentChatMessageList {
        chats__resetTimeOfEndingLoadingFullCurrentChatMessageList @client
    }
`;

export const CLEAR_CURRENT_CHAT_MESSAGES = gql`
    mutation ClearCurrentChatMessages {
        chats__clearCurrentChatMessages @client
    }
`;

export const GET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST = gql`
    query GetTimeOfEndingLoadingFullChatList {
        clientData @client {
            chats {
                timeOfEndingLoadingFullChatList
            }
        }
    }
`;

export const SET_TIME_OF_ENDING_LOADING_FULL_CHAT_LIST = gql`
    mutation SetTimeOfEndingLoadingFullChatList($time: number) {
        chats__setTimeOfEndingLoadingFullChatList(time: $time) @client
    }
`;

export const GET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST = gql`
    query GetTimeOfEndingLoadingFullCurrentChatMessageList {
        clientData @client {
            chats {
                timeOfEndingLoadingFullCurrentChatMessageList
            }
        }
    }
`;

export const SET_TIME_OF_ENDING_LOADING_FULL_CURRENT_CHAT_MESSAGE_LIST = gql`
    mutation SetTimeOfEndingLoadingFullCurrentChatMessageList($time: number) {
        chats__setTimeOfEndingLoadingFullCurrentChatMessageList(time: $time) @client
    }
`;

export const GET_IS_CHAT_LIST_LOADING = gql`
    query GetIsChatListLoading {
        clientData @client {
            chats {
                isChatListLoading
            }
        }
    }
`;

export const SET_IS_CHAT_LIST_LOADING = gql`
    mutation SetIsChatListLoading($isLoading: Boolean!) {
        chats__setIsChatListLoading(isLoading: $isLoading) @client
    }
`;

export const GET_IS_MESSAGE_LIST_LOADING = gql`
    query GetIsMessageListLoading {
        clientData @client {
            chats {
                isMessageListLoading
            }
        }
    }
`;

export const SET_IS_MESSAGE_LIST_LOADING = gql`
    mutation SetIsMessageListLoading($isLoading: Boolean!) {
        chats__setIsMessageListLoading(isLoading: $isLoading) @client
    }
`;

export const CREATE_CHAT = gql`
    mutation CreateChat($chatName: String!, $userIds: [String!]!) {
         createChat(chatName: $chatName, userIds: $userIds) {
            id
            name
            members {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            messages(cursor: "", limit: 0) @connection(key: "messages") {  #this returns an empty data array; required to firing queries on cache for getting current messages amount.
                data {
                    id
                }
                paginationMetadata {
                    nextCursor
                }
            }
            lastMessage
            creationDate
            updatingDate
         }
    }
`;

export const ADD_CHAT_TO_LIST = gql`
    mutation AddChatToList($chat: Chat!) {
        chats__addChatToList(chat: $chat) @client
    }
`;

export const SUBSCRIPTION__CHAT_CREATED = gql`
    subscription OnChatCreated {
        chatCreated {
            id
            name
            members {
                id
                googleId
                userFullName
                email
                avatar
                isAdmin
            }
            messages(cursor: "", limit: 0) @connection(key: "messages") {  #this returns an empty data array; required to firing queries on cache for getting current messages amount.
                data {
                    id
                }
                paginationMetadata {
                    nextCursor
                }
            }
            lastMessage
            creationDate
            updatingDate
        }
    }
`;
