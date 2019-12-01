import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import styles from "./members-info.module.scss";

const MembersInfo = ({ selectedChat, currentUserId }) => {
    const chatMembersAmount = selectedChat._members ? Object.keys(selectedChat._members).length : 0;

    return (
        !!chatMembersAmount
        && <section className={styles.membersInfoContainer}>
            {
                (chatMembersAmount >= 3)
                    ? <React.Fragment>
                        <div className={styles.chatName}>
                            {selectedChat.name}
                        </div>
                        <div className={styles.chatMembersAmount}>
                            {chatMembersAmount} members
                        </div>
                    </React.Fragment>
                    : <React.Fragment>
                        <div className={styles.chatName}>
                            {
                                Object.values(selectedChat._members).filter(user => (
                                    user.id !== currentUserId
                                ))[0].userFullName
                            }
                        </div>
                    </React.Fragment>
            }
        </section>
    );
};

const mapStateToProps = (state) => {
    const selectedChatId = state.chats.selectedChatId;
    const selectedChat = selectedChatId
        ? state.chats.chats[selectedChatId]
        : {};

    return {
        selectedChat,
        currentUserId: state.app.userData.id
    };
};

export default connect(mapStateToProps)(MembersInfo);

MembersInfo.propTypes = {
    selectedChat: PropTypes.object,
    currentUserId: PropTypes.string
};


