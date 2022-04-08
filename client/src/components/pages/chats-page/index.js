import React, { Suspense, lazy, useRef} from "react";
import { useQuery, useSubscription } from "@apollo/client";

import ChatsSectionHeader from "../../groups/chats/chats-section-header";
import ChatList from "../../groups/chats/chat-list";
const MessagesThread = lazy(() => import("../../groups/chats/messages-thread"));
const SendMessageForm = lazy(() => import("../../groups/chats/send-message-form"));
const CreateChatForm = lazy(() => import("../../groups/chats/create-chat-form"));
import Modal from "../../commons/modal";

import { getChatByIdFromCache, relocateChatToTopOfChatList, getChatById, addChatToChatList, addChatMessage, toggleCreateChatModal } from "../../../actions/ChatActions";

import { GET_SELECTED_CHAT, SUBSCRIPTION__MESSAGE_SENT, SUBSCRIPTION__CHAT_CREATED, GET_IS_CREATE_CHAT_MODAL_OPEN } from "../../../constants/graphqlQueries/chats";

import styles from "./chats-page.module.scss";

const ChatsPage = () => {
    const { data: selectedChatData } = useQuery(GET_SELECTED_CHAT, { fetchPolicy: "cache-only" });
    const selectedChat = selectedChatData
        ? selectedChatData.chat
        : null;

    const { data: isCreateChatModalOpenData } = useQuery(GET_IS_CREATE_CHAT_MODAL_OPEN);
    const isCreateChatModalOpen = isCreateChatModalOpenData.clientData.chats.isCreateChatModalOpen;

    const scrolledMessagesThreadContainerRef = useRef(null);

    useSubscription(SUBSCRIPTION__CHAT_CREATED, {
        onSubscriptionData: (data) => {
            const chat = data.subscriptionData.data.chatCreated;

            addChatToChatList(chat);
        }
    });

    useSubscription(SUBSCRIPTION__MESSAGE_SENT, {
        onSubscriptionData: async (data) => {
            try {
                const message = data.subscriptionData.data.messageSent;
                const chatId = message.chatId;

                const isChatInCache = !!(await getChatByIdFromCache(chatId));

                if (isChatInCache) {
                    await relocateChatToTopOfChatList(chatId);

                    addChatMessage(chatId, message);
                } else {
                    const chat = await getChatById(chatId);

                    addChatToChatList(chat);
                }
            } catch (error) {
                console.error(`An error occured during execution of callback of subscription to message receiving.`, error);
            }
        }
    });

    const onMessageInputChange = () => {
        scrolledMessagesThreadContainerRef.current
        && scrolledMessagesThreadContainerRef.current.forceUpdate();
    };

    return (
        <section className={styles.chatsPage}>
            <section className={styles.chatsSection}>
                <ChatsSectionHeader />

                <section className={styles.chatListAndMessagesContainer}>
                    <ChatList />

                    { selectedChat &&
                        <section className={styles.messagesContainer}>
                            <Suspense fallback={""}>
                                <MessagesThread messages={selectedChat.messages} selectedChatId={selectedChat.id} passthroughRef={scrolledMessagesThreadContainerRef} />

                                <SendMessageForm selectedChatId={selectedChat.id} onChange={onMessageInputChange} />
                            </Suspense>
                        </section>
                    }
                </section>
            </section>

            <Modal isOpen={isCreateChatModalOpen} toggleModal={toggleCreateChatModal}>
                <Suspense fallback={""}>
                    <CreateChatForm />
                </Suspense>
            </Modal>
        </section>
    );
};

export default ChatsPage;
