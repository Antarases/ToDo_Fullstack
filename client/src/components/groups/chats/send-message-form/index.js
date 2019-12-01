import React from "react";
import { connect } from "react-redux"
import PropTypes from "prop-types";

import { sendMessage } from "../../../../websockets/ChatSocket";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";

import styles from "./send-message-form.module.scss";

const SendMessageForm = ({ avatar, selectedChatId, onChange }) => {
    const messageInputRef = React.createRef();

    const onSendButtonClick = () => {
        sendMessage(messageInputRef.current.innerHTML, selectedChatId);

        messageInputRef.current.innerHTML = null;
    };

    return (
        <section className={styles.sendMessageFormContainer}>
            <img className={styles.avatar} src={avatar || NOIMAGE_IMAGE_URL} alt="Avatar"/>

            <div className={styles.messageInputWrapper}>
                <div
                    className={styles.messageInput}
                    contentEditable="true"
                    placeholder="Write a message..."
                    onInput={onChange}
                    ref={messageInputRef}
                />
            </div>

            <div
                className={styles.sendButton}
                onClick={onSendButtonClick}
            >
                Send
            </div>
        </section>
    );
};

const mapStateToProps = (state) => {
    return {
        avatar: state.app.userData.avatar,
        selectedChatId: state.chats.selectedChatId
    };
};

export default connect(mapStateToProps)(SendMessageForm);

SendMessageForm.propTypes = {
    avatar: PropTypes.string,
    selectedChatId: PropTypes.string,
    onChange: PropTypes.func
};
