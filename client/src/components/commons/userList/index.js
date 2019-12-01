import React from "react";
import PropTypes from "prop-types";

import User from "../user";
import ScrolledContainer from "../../commons/scrolled-container";

import styles from "./userList.module.scss";

const UserList = ({ userList, selectedUserIds = [], onClick }) => {
    return (
        <section className={styles.userListContainer}>
            {
                (userList && !!Object.keys(userList).length)
                    ? <ScrolledContainer>
                        {
                            Object.values(userList).map(user => (
                                (user && !!Object.keys(user).length)
                                && <User
                                    user={user}
                                    isSelected={selectedUserIds.indexOf(user.id) !== -1}
                                    onClick={() => { if (!!onClick) { onClick(user.id); } }}
                                    key={user.id}
                                />
                            ))
                        }
                    </ScrolledContainer>
                    : <div className={styles.noUsersText}>There are no users to be displayed</div>
            }
        </section>
    );
};

export default UserList;

UserList.propTypes = {
    userList: PropTypes.object,
    selectedUserIds: PropTypes.array,
    onClick: PropTypes.func
};

