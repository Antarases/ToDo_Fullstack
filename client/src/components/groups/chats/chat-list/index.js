import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import classnames from "classnames";

import ScrolledContainer from "../../../commons/scrolled-container";

import { getChatList, getChatMessages, getChatMessagesAmount, setSelectedChatId } from "../../../../actions/ChatActions";

import { getFormattedDate } from "../../../../helpers/functions";

import { GET_CHATS_FROM_CACHE, GET_SELECTED_CHAT_ID } from "../../../../constants/graphqlQueries/chats";

import styles from "./chat-list.module.scss";

const ChatList = () => {
    useEffect(() => {
        getChatList();
    }, []);

    const { data: chatsData } = useQuery(GET_CHATS_FROM_CACHE);
    const chats = chatsData.chats;

    const { data: selectedChatIdData } = useQuery(GET_SELECTED_CHAT_ID);
    const selectedChatId = selectedChatIdData.clientData.chats.selectedChatId;

    return (
        <section className={styles.chatsContainer}>
            {
                (chats && chats.length)
                    ? (
                        <ScrolledContainer
                            className={styles.scrolledContainer}
                            trackVerticalClassName={styles.trackVertical}
                            thumbVerticalClassName={styles.thumbVertical}
                            itemsAmount={chats ? chats.length : 0}
                            getMoreItems={getChatList}
                        >
                            {
                                chats.map(chat => (
                                    <section
                                        className={classnames(styles.chat, {[styles.selected]: (chat.id === selectedChatId)})}
                                        onClick={async () => {
                                            if (chat.id !== selectedChatId) {
                                                setSelectedChatId(chat.id);

                                                (getChatMessagesAmount(chat.id) === 0)
                                                && getChatMessages(chat.id);
                                            }
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
};

export default ChatList;
