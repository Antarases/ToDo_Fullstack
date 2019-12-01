import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./user.module.scss";

const User = ({ user, isSelected, onClick = null }) => {
    return (
        <section
            className={classnames(styles.userContainer, {[styles.selected]: isSelected})}
            onClick={() => { if (!!onClick) { onClick(); } }}
        >
            <img className={styles.avatar} src={user.avatar} alt="Avatar"/>
            <div className={styles.userName}>{user.userFullName}</div>
        </section>
    );
};

export default User;

User.propTypes = {
    user: PropTypes.object,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};
