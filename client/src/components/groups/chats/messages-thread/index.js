import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import ScrolledContainer from "../../../commons/scrolled-container";

import { getChatMessages } from "../../../../actions/ChatActions";
import { getFormattedTime} from "../../../../helpers/Functions";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";

import styles from "./messagesThread.module.scss";

class MessagesThread extends React.Component {
    componentDidMount() {
        const { passthroughRef } = this.props;

        if (passthroughRef && passthroughRef.current) {
            passthroughRef.current.scrollToBottom();
        }
    }

    componentDidUpdate(prevProps) {
        const { messages, passthroughRef } = this.props;

        if ((passthroughRef && passthroughRef.current) && (!prevProps.messages && messages)) {
            passthroughRef.current.scrollToBottom();
        }
    }

    render() {
        const { messages, selectedChatId, passthroughRef } = this.props;

        return (
            <section className={styles.chatThreadContainer}>
                {
                    (messages && !!Object.keys(messages).length)
                        ? <ScrolledContainer
                            trackVerticalClassName={styles.trackVertical}
                            passthroughRef={passthroughRef}
                            itemsAmount={messages ? Object.keys(messages).length : 0}
                            getMoreItems={() => { getChatMessages(selectedChatId); }}
                            isScrollReversed={true}
                        >
                            {
                                Object.values(messages).map(message => (
                                    <section className={styles.messageContainerWrapper} key={message.id}>
                                        <section className={styles.messageContainer}>
                                            <img className={styles.avatar} src={message._user.avatar || NOIMAGE_IMAGE_URL} alt="" />

                                            <div className={styles.userNameAndMessageContainer}>
                                                <div className={styles.userName}>{message._user.userFullName}</div>
                                                <div className={styles.message}>{message.text}</div>
                                            </div>

                                            <div className={styles.messageDate}>{getFormattedTime(message.updatingDate)}</div>
                                        </section>
                                    </section>
                                ))
                            }
                        </ScrolledContainer>
                        : (
                            <div className={styles.noMessagesText}>You have no chats yet</div>
                        )

                }
            </section>
        );
    }
}

export default MessagesThread;

const datePropValidation = (props, propName, componentName) => {
    if (!moment(props[propName], "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid()) {
        return new Error(`Prop '${propName}' of type 'Date' with invalid value supplied to message of '${componentName}' component. Validation failed.`);
    }
};

MessagesThread.propTypes = {
    messages: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.string,
            text: PropTypes.string,
            updatingDate: datePropValidation,
            _user: PropTypes.shape({
                avatar: PropTypes.string,
                userFullName: PropTypes.string
            })
        })
    ),
    selectedChatId: PropTypes.string,
    passthroughRef: PropTypes.object
};

