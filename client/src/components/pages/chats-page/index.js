import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";

import ChatsSectionHeader from "../../groups/chats/chats-section-header";
import ChatList from "../../groups/chats/chat-list";
import MessagesThread from "../../groups/chats/messages-thread";
import SendMessageForm from "../../groups/chats/send-message-form";
import CreateChatForm from "../../groups/chats/create-chat-form";
import Modal from "../../commons/modal";

import { setChatSocketConnectionAndHandlers, closeChatSocketConnection } from "../../../websockets/ChatSocket";
import { toggleCreateChatModal } from "../../../actions/ChatActions";

import styles from "./chatsPage.module.scss";

const ChatsPage = ({ selectedChatId, selectedChat, isCreateChatModalOpen }) => {
    useEffect(() => {
        setChatSocketConnectionAndHandlers();

        return closeChatSocketConnection;
    }, []);

    const scrolledMessagesThreadContainerRef = React.createRef();
    const onMessageInputChange = () => {
        scrolledMessagesThreadContainerRef.current.forceUpdate();
    };

    return (
        <Container as="section" className={styles.chatsPage}>
            <section className={styles.chatsSection}>
                <ChatsSectionHeader />

                <section className={styles.chatListAndMessagesContainer}>
                    <ChatList />

                    { selectedChatId &&
                        <section className={styles.messagesContainer}>
                            <MessagesThread messages={selectedChat.messages} ref={scrolledMessagesThreadContainerRef} />

                            <SendMessageForm onChange={onMessageInputChange} />
                        </section>
                    }
                </section>
            </section>


            <Modal isOpen={isCreateChatModalOpen} toggleModal={toggleCreateChatModal}>
                <CreateChatForm />
            </Modal>
        </Container>
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
