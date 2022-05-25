import { gql } from "@apollo/client";

import { initialData } from "./index";

import { getSelectedChatId } from "../actions/ChatActions";


const userReducer = (user) => {
    return user
        ? {
            id: user.id || null,
            googleId: user.googleId || null,
            userFullName: user.userFullName || null,
            email: user.email || null,
            avatar: user.avatar || null,
            isAdmin: user.isAdmin || null
        }
        : null;
};

const messageReducer = (message) => {
    return message
        ? {
            id: message.id || null,
            text: message.text || null,
            author: userReducer(message.author) || null,
            chatId: message.chatId || null,
            creationDate: message.creationDate || null,
            updatingDate: message.creationDate || null
        }
        : null;
};

const messagesReducer = (messages) => {
    return (messages && messages.length)
        ? messages.map(message => messageReducer(message))
        : [];
};

const chatReducer = (chat) => {
    return chat
        ? {
            id: chat.id || null,
            name: chat.name || null,
            members: chat.members || null,
            messages: messagesReducer(chat.messages && chat.messages.data),
            lastMessage: chat.lastMessage || null,
            creationDate: chat.creationDate || null,
            updatingDate: chat.updatingDate || null,
            isMessageListLoading: chat.isMessageListLoading || false,
            timeOfEndingLoadingFullMessageList: chat.timeOfEndingLoadingFullMessageList || null,
            messagesCursor: chat.messagesCursor || "",
            __typename: chat.__typename
        }
        : null;
};

export const chatsReducer = (chats) => {
    return (chats && chats.length)
        ? chats.map(chat => chatReducer(chat))
        : [];
};


const chatResolvers = {
    Query: {
        chats__getChatByIdFromCache: (parent, { chatId }, { cache, getCacheKey }) => {
            const cacheId = getCacheKey({ __typename: "Chat", id: chatId });

            const fragment = gql`
                fragment GetChatByIdFromCache on Chat {
                    id
                }
            `;

            const chat = cache.readFragment({ fragment, id: cacheId });

            return chat;
        },
    },
    Mutation: {
        chats__addChatToChatList: (parent, { chat }, { cache }) => {
            const query = gql`
                query AddChatToChatList {
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
                            __typename
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
                                __typename
                            }
                            creationDate
                            updatingDate
                            __typename
                        }
                        lastMessage
                        creationDate
                        updatingDate
                        __typename
                    }
                }
            `;

            const queryResults = cache.readQuery({ query });

            let normalizedChat = chatReducer(chat);
            normalizedChat = {
                ...normalizedChat,
                messages: normalizedChat.messages.map(message => {
                    return {
                        ...message,
                        author: {
                            ...message.author,
                            __typename: "User"
                        },
                        __typename: "Message"
                    }
                }),
                __typename: "Chat"
            };

            const newData = {
                chats: [
                    normalizedChat,
                    ...queryResults.chats
                ]
            };

            cache.writeQuery({ query, data: newData });
        },
        chats__setChatsCursor: (parent, { chatsCursor }, { cache }) => {
            const query = gql`
                query SetChatsCursor {
                    clientData @client {
                        chats {
                            chatsCursor
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const newData = {
                clientData: {
                    chats: {
                        chatsCursor,
                        __typename: "Chats"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
        chats__setSelectedChatId: (parent, { chatId }, { cache }) => {
            const query = gql`
                query SetSelecteChatId {
                    clientData @client {
                        chats {
                            selectedChatId
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const newData = {
                clientData: {
                    chats: {
                        selectedChatId: chatId,
                        __typename: "Chats"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
        chats__relocateChatToTopOfChatList: (parent, { chatId }, { cache, getCacheKey }) => {
            const query = gql`
                query RelocateChatToTopOfChatList {
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
                            __typename
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
                                __typename
                            }
                            creationDate
                            updatingDate
                            __typename
                        }
                        lastMessage
                        creationDate
                        updatingDate
                        __typename
                    }
                }
            `;
            const queryResults = cache.readQuery({ query });

            const cacheId = getCacheKey({ __typename: "Chat", id: chatId });
            const fragment = gql`
                fragment GetChat on Chat {
                    id
                    name
                    members {
                        id
                        googleId
                        userFullName
                        email
                        avatar
                        isAdmin
                        __typename
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
                            __typename
                        }
                        creationDate
                        updatingDate
                        __typename
                    }
                    lastMessage
                    creationDate
                    updatingDate
                    __typename
                }
            `;
            const chat = cache.readFragment({ fragment, id: cacheId });

            const newData = {
                chats: [
                    { ...chat },
                    ...queryResults.chats.filter(chat => (chat.id !== chatId))
                ]
            };

            cache.writeQuery({ query, data: newData });
        },
        chats__addMessagesToMessageList: (parent, { chatId, messages }, { cache, getCacheKey }) => {
            const cacheId = getCacheKey({ __typename: "Chat", id: chatId });

            const fragment = gql`
                fragment AddMessagesToMessageList on Chat {
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
                            __typename
                        }
                        creationDate
                        updatingDate
                        __typename
                    }
                    __typename
                }
            `;

            const chat = cache.readFragment({ fragment, id: cacheId });

            const editedChat = {
                messages: [
                    ...messages,
                    ...chat.messages
                ],
                __typename: "Chat"
            };

            cache.writeFragment({ fragment, id: cacheId, data: editedChat });
        },
        chats__addChatMessage: async (parent, { chatId, message }, { cache, getCacheKey }) => {
            const selectedChatId = await getSelectedChatId();
            const cacheId = getCacheKey({ __typename: "Chat", id: chatId });

            const fragment = gql`
                fragment AddChatMessage on Chat {
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
                            __typename
                        }
                        creationDate
                        updatingDate
                        __typename
                    }
                    lastMessage
                    __typename
                }
            `;

            const chat = cache.readFragment({ fragment, id: cacheId });

            const normalizedMessage = messageReducer(message);
            const newMessages = (chatId === selectedChatId) // Setting empty message list. This is required, according to design, for cases when chat №1 is selected and message for chat №2 comes over websocket. According to current design, unselected chats should have no messages.
                ? [
                    ...chat.messages,
                    {
                        ...normalizedMessage,
                        author: {
                            ...normalizedMessage.author,
                            __typename: "User"
                        },
                        __typename: "Message"
                    }
                ]
                : [];
            const editedChat = {
                messages: newMessages,
                lastMessage: normalizedMessage.text,
                __typename: "Chat"
            };

            cache.writeFragment({ fragment, id: cacheId, data: editedChat });
        },
        chats__toggleCreateChatModal: (parent, args, { cache }) => {
            const query = gql`
                query ToggleCreateChatModal {
                    clientData @client {
                        chats {
                            isCreateChatModalOpen
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const queryResults = cache.readQuery({ query });
            const newData = {
                clientData: {
                    chats: {
                        isCreateChatModalOpen: !queryResults.clientData.chats.isCreateChatModalOpen,
                        __typename: "Chats"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
        chats__setIsChatListLoading: (parent, { isLoading }, { cache }) => {
            const query = gql`
                query SetIsChatListLoading {
                    clientData @client {
                        chats {
                            isChatListLoading
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const newData = {
                clientData: {
                    chats: {
                        isChatListLoading: isLoading,
                        __typename: "Chats"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
        chats__setTimeOfEndingLoadingFullChatList: (parent, { time }, { cache }) => {
            const query = gql`
                query SetTimeOfEndingLoadingFullChatList {
                    clientData @client {
                        chats {
                            timeOfEndingLoadingFullChatList
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const newData = {
                clientData: {
                    chats: {
                        timeOfEndingLoadingFullChatList: time,
                        __typename: "Chats"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
    }
};

export default chatResolvers;
