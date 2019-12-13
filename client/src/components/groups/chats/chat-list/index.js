import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";

import ScrolledContainer from "../../../commons/scrolled-container";

import { getChatList, setSelectedChat, getChatMessages } from "../../../../actions/ChatActions";

import { getFormattedDate } from "../../../../helpers/Functions";

import styles from "./chatList.module.scss";

class ChatList extends React.Component {
    componentDidMount() {
        getChatList();
    }

    render() {
        const { chats, selectedChatId } = this.props;

        return (
            <section className={styles.chatsContainer}>
                {
                    (chats && Object.keys(chats).length)
                    ? (
                        <ScrolledContainer
                            className={styles.scrolledContainer}
                            trackVerticalClassName={styles.trackVertical}
                            thumbVerticalClassName={styles.thumbVertical}
                            itemsAmount={chats ? Object.keys(chats).length : 0}
                            getMoreItems={getChatList}
                        >
                            {
                                Object.values(chats).map(chat => (
                                    <section
                                        className={classnames(styles.chat, {[styles.selected]: (chat.id === selectedChatId)})}
                                        onClick={() => {
                                            setSelectedChat(chat.id);
                                            getChatMessages(chat.id);
                                        }}
                                        key={chat.id}
                                    >
                                        <div  className={styles.avatar} style={{ background: chat.avatar ? `url(${chat.avatar})` : "grey" }}/>

                                        <div className={styles.chatNameAndLastMessageContainer}>
                                            <div className={styles.chatName}>{chat.name}</div>
                                            <div className={styles.lastMessage}>{chat.lastMessage}</div>
                                        </div>

                                        <div className={styles.lastMessageDate}>{getFormattedDate(chat.updatingDate)}</div>
                                    </section>
                                ))
                            }
                        </ScrolledContainer>
                    )
                    : <div className={styles.noChatsText}>You have no chats yet</div>
                }
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        chats: state.chats.chats,
        selectedChatId: state.chats.selectedChatId
    };
};

export default connect(mapStateToProps)(ChatList);

const datePropValidation = (props, propName, componentName) => {
    if (
        ((props[propName] !== null) && (props[propName] !== undefined))
        && !moment(props[propName], true).isValid()
    ) {
        return new Error(`Prop '${propName}' of type 'Date' with invalid value supplied to '${componentName}'. Validation failed.`);
    }
};

ChatList.propTypes = {
    chats: PropTypes.shape({
        id: PropTypes.string,
        avatar: PropTypes.string,
        name: PropTypes.string,
        lastMessage: PropTypes.string,
        updatingDate: datePropValidation
    }),
    selectedChatId: PropTypes.string
};
