import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";

import Menu from "./menu";
import BackButton from "../../../commons/back-button";
import MembersInfo from "./members-info";

import { setSelectedChat } from "../../../../actions/ChatActions";

import styles from "./chats-section-header.module.scss";

const ChatsSectionHeader = ({ selectedChatId }) => {
    return (
        <section className={styles.chatsSectionHeader}>
            <BackButton
                backButtonContainerClassName={classnames(styles.backButtonContainer, {[styles.hideOnSmallScreens]: !selectedChatId})}
                backButtonClassName={styles.backButton}
                onClick={() => setSelectedChat(null)}
            />

            <Menu chatsMenuContainerClassName={classnames({[styles.hideOnSmallScreens]: selectedChatId})} />

            <MembersInfo />
        </section>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedChatId: state.chats.selectedChatId
    };
};

export default connect(mapStateToProps)(ChatsSectionHeader);

ChatsSectionHeader.propTypes = {
    selectedChatId: PropTypes.string
};
