import React from "react";
import { NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";

import styles from "./menu.module.scss";

const Menu = () => {
    return (
        <Container as="section" className={styles.menuWrapper}>
            <section className={styles.menuContainer}>
                    <NavLink
                        to="/"
                        exact
                        className={styles.link}
                        activeClassName={styles.selectedLink}
                    >
                        Todos
                    </NavLink>

                    <NavLink
                        to="/messages"
                        exact
                        className={styles.link}
                        activeClassName={styles.selectedLink}
                    >
                        Messages
                    </NavLink>
            </section>
        </Container>
    );
};

export default Menu;
