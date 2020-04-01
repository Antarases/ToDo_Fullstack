import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { GET_SELECTED_CHAT } from "../../../../../constants/graphqlQueries/chats";
import { GET_CURRENT_USER } from "../../../../../constants/graphqlQueries/users";

import styles from "./members-info.module.scss";

const MembersInfo = () => {
    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const currentUserId = (currentUserData && currentUserData.currentUser)
        ? currentUserData.currentUser.id
        : null;

    const { data: selectedChatData } = useQuery(GET_SELECTED_CHAT, { fetchPolicy: "cache-only" });
    const selectedChat = selectedChatData
        ? selectedChatData.chat
        : null;

    const chatMembersAmount = (selectedChat && selectedChat.members)
            ? selectedChat.members.length
            : 0;

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
                                selectedChat.members.filter(user => (
                                    user.id !== currentUserId
                                ))[0].userFullName
                            }
                        </div>
                    </React.Fragment>
            }
        </section>
    );
};

export default MembersInfo;
