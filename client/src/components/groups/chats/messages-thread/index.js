import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import ScrolledContainer from "../../../commons/scrolled-container";

import { getFormattedTime} from "../../../../helpers/Functions";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";

import styles from "./messagesThread.module.scss";

class MessagesThread extends React.Component {
    render() {
        const { messages, innerRef } = this.props;

        return (
            <section className={styles.chatThreadContainer}>
                {
                    (messages && !!Object.keys(messages).length)
                        ? <ScrolledContainer alwaysShowScrollbar trackVerticalClassName={styles.trackVertical} ref={innerRef}>
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

export default React.forwardRef((props, ref) => <MessagesThread
    innerRef={ref} {...props}
/>);

const datePropValidation = (props, propName, componentName) => {
    if (!moment(props[propName], true).isValid()) {
        return new Error(`Prop '${propName}' of type 'Date' with invalid value supplied to '${componentName}'. Validation failed.`);
    }
};

MessagesThread.propTypes = {
    chats: PropTypes.shape({
        name: PropTypes.string,
        lastMessage: PropTypes.string,
        updatingDate: datePropValidation
    }),
    selectedChatId: PropTypes.string
};
