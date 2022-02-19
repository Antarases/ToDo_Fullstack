import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import ScrolledContainer from "../../../commons/scrolled-container";

import { getChatMessages } from "../../../../actions/ChatActions";
import { getFormattedTime} from "../../../../helpers/functions";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";

import styles from "./messages-thread.module.scss";

class MessagesThread extends React.Component {
    componentDidMount() {
        const { passthroughRef } = this.props;

        if (passthroughRef && passthroughRef.current) {
            passthroughRef.current.scrollToBottom();
        }
    }

    componentDidUpdate(prevProps) {
        const { messages, passthroughRef } = this.props;

        if (
            (passthroughRef && passthroughRef.current)
            && (
                (!prevProps.messages && messages)
                || ((prevProps.messages && messages) && (!prevProps.messages.length && messages.length))
            )
        ) {
            passthroughRef.current.scrollToBottom();
        }
    }

    render() {
        const { messages, selectedChatId, passthroughRef } = this.props;

        return (
            <section className={styles.chatThreadContainer}>
                {
                    (messages && !!messages.length)
                        ? <ScrolledContainer
                            trackVerticalClassName={styles.trackVertical}
                            passthroughRef={passthroughRef}
                            itemsAmount={messages ? messages.length : 0}
                            getMoreItems={() => { getChatMessages(selectedChatId); }}
                            isScrollReversed={true}
                        >
                            {
                                messages.map(message => (
                                    <section className={styles.messageContainerWrapper} key={message.id}>
                                        <section className={styles.messageContainer}>
                                            <img className={styles.avatar} src={message.author.avatar || NOIMAGE_IMAGE_URL} alt="" />

                                            <div className={styles.userNameAndMessageContainer}>
                                                <div className={styles.userName}>{message.author.userFullName}</div>
                                                <div className={styles.message}>{message.text}</div>
                                            </div>

                                            <div className={styles.messageDate}>{getFormattedTime(message.updatingDate)}</div>
                                        </section>
                                    </section>
                                ))
                            }
                        </ScrolledContainer>
                        : (
                            <div className={styles.noMessagesText}>You have no messages yet</div>
                        )

                }
            </section>
        );
    }
}

export default MessagesThread;

const datePropValidation = (props, propName, componentName) => {
    if (
        ((props[propName] !== null) && (props[propName] !== undefined))
        && !moment(props[propName], "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid()
    ) {
        return new Error(`Prop '${propName}' of type 'Date' with invalid value supplied to message of '${componentName}' component. Validation failed.`);
    }
};

MessagesThread.propTypes = {
    messages: PropTypes.arrayOf(
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

