import React from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";

import { sendMessage } from "../../../../actions/ChatActions";

import { GET_CURRENT_USER } from "../../../../constants/graphqlQueries/users";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";

import styles from "./send-message-form.module.scss";

const SendMessageForm = ({ selectedChatId, onChange }) => {
    const messageInputRef = React.createRef();

    const onSendButtonClick = () => {
        sendMessage(selectedChatId, messageInputRef.current.innerHTML);

        messageInputRef.current.innerHTML = null;
    };

    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const currentUser = currentUserData
        ? currentUserData.currentUser
        : {};

    return (
        <section className={styles.sendMessageFormContainer}>
            <img className={styles.avatar} src={currentUser.avatar || NOIMAGE_IMAGE_URL} alt="Avatar"/>

            <div className={styles.messageInputWrapper}>
                <div
                    className={styles.messageInput}
                    contentEditable="true"
                    placeholder="Write a message..."
                    onInput={onChange}
                    onPaste={ (e) => {
                        e.preventDefault();

                        const text = (e.originalEvent || e).clipboardData.getData('text/plain');

                        messageInputRef.current.innerHTML = text;
                    }}
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

export default SendMessageForm;

SendMessageForm.propTypes = {
    selectedChatId: PropTypes.string,
    onChange: PropTypes.func
};
