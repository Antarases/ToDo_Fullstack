import React, { useEffect, useState } from "react";
import classnames from "classnames";

import { toggleCreateChatModal } from "../../../../../actions/ChatActions";

import styles from "./menu.module.scss";

const Menu = () => {
    const CHATS_MENU_CONTAINER_CLASS_NAME = styles.chatsMenuContainer;

    useEffect(() => {
        const closeChatMenu = (e) => {
            if (e.target.className.indexOf(CHATS_MENU_CONTAINER_CLASS_NAME) === -1) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("click", closeChatMenu);

        return () => { window.removeEventListener("click", closeChatMenu); };
    }, [CHATS_MENU_CONTAINER_CLASS_NAME]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleIsMenuOpen = () => {
        isMenuOpen
            ? setIsMenuOpen(false)
            : setIsMenuOpen(true);
    };

    return (
        <section
            className={CHATS_MENU_CONTAINER_CLASS_NAME}
            onClick={(e) => { e.stopPropagation(); toggleIsMenuOpen(); }}
        >
            <div className={classnames(styles.menuButtonContainer, {[styles.open]: isMenuOpen})}>
                            <span className={classnames(styles.hamburgerMenuButton, {[styles.open]: isMenuOpen})}>
                                <span className={styles.iconBar} />
                                <span className={styles.iconBar} />
                                <span className={styles.iconBar} />
                            </span>
            </div>

            <section className={classnames(styles.menu, {[styles.open]: isMenuOpen})}>
                <div
                    className={styles.menuItem}
                    onClick={toggleCreateChatModal}
                >
                    <span className={classnames(styles.icon, styles.createChat)} />
                    Create chat
                </div>
            </section>
        </section>
    );
};

export default Menu;
