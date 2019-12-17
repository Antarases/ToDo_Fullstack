import React from "react";
import { NavLink } from "react-router-dom";
import { Container } from "reactstrap";

import LoginForm from "../../commons/login-form";
import DropdownMenu from "../../commons/dropdown-menu";

import styles from "./menu.module.scss";

const Menu = () => {
    const navLinks = [
        <NavLink
            to="/"
            exact
            className={styles.link}
            activeClassName={styles.selectedLink}
            key="/"
        >
            Todos
        </NavLink>,

        <NavLink
            to="/messages"
            exact
            className={styles.link}
            activeClassName={styles.selectedLink}
            key="/messages"
        >
            Messages
        </NavLink>
    ];

    return (
        <Container tag="section" className={styles.menuWrapper}>
            <section className={styles.menuContainer}>
                <section className={styles.navigation}>
                    <div className={styles.navLinks}>
                        {navLinks}
                    </div>

                    <DropdownMenu
                        menuContainerClassName={styles.dropdownMenuContainer}
                        menuButtonContainerClassName={styles.menuButtonContainer}
                        menuClassName={styles.menu}
                        openClassName={styles.open}
                        menuButtonText="Navigation"
                    >
                        {navLinks}
                    </DropdownMenu>
                </section>

                <LoginForm loginFormClassName={styles.loginForm} />
            </section>
        </Container>
    );
};

export default Menu;
