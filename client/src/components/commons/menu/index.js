import React from "react";
import { NavLink } from "react-router-dom";
import { Container } from "reactstrap";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

import styles from "./menu.module.scss";

const Menu = ({ location }) => {
    return (
        <Container tag="section" className={classnames(styles.menuWrapper, {[styles.customWidth]: (location && (location.pathname !== "/"))})}>
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

export default withRouter(Menu);
