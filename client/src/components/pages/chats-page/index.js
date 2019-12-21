import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ChatsSectionHeader from "../../groups/chats/chats-section-header";
import ChatList from "../../groups/chats/chat-list";
import MessagesThread from "../../groups/chats/messages-thread";
import SendMessageForm from "../../groups/chats/send-message-form";
import CreateChatForm from "../../groups/chats/create-chat-form";
import Modal from "../../commons/modal";

import { setChatSocketConnectionAndHandlers, closeChatSocketConnection } from "../../../websockets/ChatSocket";
import { toggleCreateChatModal } from "../../../actions/ChatActions";

import styles from "./chats-page.module.scss";

const ChatsPage = ({ selectedChatId, selectedChat, isCreateChatModalOpen }) => {
    useEffect(() => {
        setChatSocketConnectionAndHandlers();

        return closeChatSocketConnection;
    }, []);

    const scrolledMessagesThreadContainerRef = useRef(null);

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

                    { selectedChatId &&
                        <section className={styles.messagesContainer}>
                            <MessagesThread messages={selectedChat.messages} selectedChatId={selectedChatId} passthroughRef={scrolledMessagesThreadContainerRef} />

                            <SendMessageForm onChange={onMessageInputChange} />
                        </section>
                    }
                </section>
            </section>


            <Modal isOpen={isCreateChatModalOpen} toggleModal={toggleCreateChatModal}>
                <CreateChatForm />
            </Modal>
        </section>
    );
};

const mapStateToProps = (state) => {
    const selectedChatId = state.chats.selectedChatId;
    const selectedChat = selectedChatId
        ? state.chats.chats[selectedChatId]
        : {};

    return {
        selectedChatId,
        selectedChat,
        isCreateChatModalOpen: state.chats.isCreateChatModalOpen
    };
};

export default connect(mapStateToProps)(ChatsPage);

ChatsPage.propTypes = {
    selectedChatId: PropTypes.string,
    selectedChat: PropTypes.object,
    isCreateChatModalOpen: PropTypes.bool

};
