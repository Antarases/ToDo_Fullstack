import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import classnames from "classnames";

import UserList from "../../../commons/user-list";

import { toggleCreateChatModal, createChat } from "../../../../actions/ChatActions";
import { getUserList } from "../../../../actions/UserActions";

import { GET_CURRENT_USER, GET_USERS_FROM_CACHE } from "../../../../constants/graphqlQueries/users";

import styles from "./create-chat-form.module.scss";

const CreateChatForm = () => {
    useEffect(() => {
        getUserList();
    }, []);

    const [chatName, setChatName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const currentUser = currentUserData
        ? currentUserData.currentUser
        : null;

    const { data: usersData } = useQuery(GET_USERS_FROM_CACHE);
    const userList = (usersData && currentUser)
        ? usersData.users.filter(user => (
            user.id !== currentUser.id
        ))
        : [];

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

export default CreateChatForm;
