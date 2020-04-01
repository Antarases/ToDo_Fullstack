import React from "react";
import { useQuery } from "@apollo/react-hooks";
import classnames from "classnames";

import DropdownMenu from "../../../commons/dropdown-menu";
import BackButton from "../../../commons/back-button";
import MembersInfo from "./members-info";

import { setSelectedChat, toggleCreateChatModal } from "../../../../actions/ChatActions";

import { GET_SELECTED_CHAT_ID } from "../../../../constants/graphqlQueries/chats";

import styles from "./chats-section-header.module.scss";

const ChatsSectionHeader = () => {
    const { data: selectedChatIdData } = useQuery(GET_SELECTED_CHAT_ID);
    const selectedChatId = selectedChatIdData
        ? selectedChatIdData.clientData.chats.selectedChatId
        : null;

    return (
        <section className={styles.chatsSectionHeader}>
            <DropdownMenu menuContainerClassName={classnames(styles.menuContainer, {[styles.hideOnSmallScreens]: selectedChatId})}>
                <div onClick={toggleCreateChatModal}>
                    <span className={classnames(styles.icon, styles.createChat)} />
                    Create chat
                </div>
            </DropdownMenu>

            <BackButton
                backButtonContainerClassName={classnames(styles.backButtonContainer, {[styles.hideOnSmallScreens]: !selectedChatId})}
                backButtonClassName={styles.backButton}
                onClick={() => setSelectedChat(null)}
            />

            <MembersInfo />
        </section>
    );
};

export default ChatsSectionHeader;
