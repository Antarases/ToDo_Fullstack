import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";

import UserList from "../../../commons/userList";

import { createChat } from "../../../../websockets/ChatSocket";
import { getUserList, toggleCreateChatModal } from "../../../../actions/ChatActions";

import styles from "./create-chat-form.module.scss";

const CreateChatForm = ({ userList }) => {
    useEffect(() => {
        getUserList();
    }, []);

    const [chatName, setChatName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const handleUserSelection = (selectedUserId) => {
        if (selectedUserIds.indexOf(selectedUserId) === -1) {
            setSelectedUserIds([...selectedUserIds, selectedUserId]);
        } else {
            let newSelectedUserIds = selectedUserIds.filter(id => {
                return id !== selectedUserId
            });

            setSelectedUserIds(newSelectedUserIds);
        }
    };

    const handleChatCreation = () => {
        if (chatName && selectedUserIds.length) {
            createChat(chatName, selectedUserIds);
            setChatName("");
            setSelectedUserIds([]);
            toggleCreateChatModal();
        }
    };

    return (
        <section className={styles.createChatForm}>
            <header className={styles.header}>
                <span className={styles.title}>
                    New chat
                </span>

                <div className={styles.closeModalButton} onClick={toggleCreateChatModal}>
                    Close
                </div>
            </header>


            <input
                className={styles.chatNameInput}
                type="text"
                placeholder="Enter chat name"
                onChange={(e) => setChatName(e.target.value)}
            />

            <UserList
                userList={userList}
                selectedUserIds={selectedUserIds}
                onClick={handleUserSelection}
                getMoreItems={getUserList}
            />

            <footer className={styles.footer}>
                <div
                    className={classnames(styles.button, {[styles.disabled]: !(chatName && selectedUserIds.length)})}
                    onClick={handleChatCreation}
                >
                    Create
                </div>
            </footer>
        </section>
    );
};

const mapStateToProps = (state) => {
    return {
        userList: state.chats.userList
    };
};

export default connect(mapStateToProps)(CreateChatForm);

CreateChatForm.propTypes = {
    userList: PropTypes.object
};
