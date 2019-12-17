import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";

import DropdownMenu from "../../../commons/dropdown-menu";
import BackButton from "../../../commons/back-button";
import MembersInfo from "./members-info";

import { setSelectedChat, toggleCreateChatModal } from "../../../../actions/ChatActions";

import styles from "./chats-section-header.module.scss";

const ChatsSectionHeader = ({ selectedChatId }) => {
    return (
        <section className={styles.chatsSectionHeader}>
            <DropdownMenu menuContainerClassName={classnames(styles.menuContainer, {[styles.hideOnSmallScreens]: selectedChatId})}>
                <div
                    onClick={toggleCreateChatModal}
                >
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

const mapStateToProps = (state) => {
    return {
        selectedChatId: state.chats.selectedChatId
    };
};

export default connect(mapStateToProps)(ChatsSectionHeader);

ChatsSectionHeader.propTypes = {
    selectedChatId: PropTypes.string
};
