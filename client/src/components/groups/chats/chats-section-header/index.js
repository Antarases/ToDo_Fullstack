import React from "react";

import Menu from "./menu";
import MembersInfo from "./members-info";

import styles from "./chats-section-header.module.scss";

const ChatsSectionHeader = () => {
    return (
        <section className={styles.chatsSectionHeader}>
            <Menu />

            <MembersInfo />
        </section>
    );
};

export default ChatsSectionHeader;
