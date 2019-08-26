import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit }  from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { Container, Button } from "react-bootstrap";

import { smoothScrollUp } from "../../../../helpers/Functions";
import { setEditableTodoId } from "../../../../actions/TodoActions";

import styles from "./todo.module.scss";

let Todo = ({
    id,
    text,
    isCompleted,
    image,
    authorFullName,
    isAdmin,
    editableTodoId
}) => {
    return (
        <Container as="section" className={styles.todo}>
            <div className={styles.userInfo}>
                <img
                    src={image || "https://c-lj.gnst.jp/public/img/common/noimage.jpg?20190112050043"}
                    alt=""
                    className={styles.todoImage}
                />

                { isAdmin && <div className={styles.authorFullName}>
                    <span className={styles.text}>Author:</span>
                    <span className={styles.fullName}>{authorFullName}</span>
                </div> }

                <div className={styles.status}>
                    <span className={styles.text}>Status:</span>
                    <FontAwesomeIcon
                        icon={faCheck}
                        className={classnames(
                            styles.icon,
                            {[styles.completed]: isCompleted, [styles.incompleted]: !isCompleted}
                        )}
                    />
                </div>

                <Button
                    onClick={() => {
                        (editableTodoId !== id) && setEditableTodoId(id);
                        smoothScrollUp();
                    }}
                    className={styles.ediTodoButton}
                >
                    <FontAwesomeIcon icon={faEdit} />
                    <span className={styles.text}>
                        Edit
                    </span>
                </Button>
            </div>

            <div className={styles.desctiption}>
                {text}
            </div>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        editableTodoId: state.todos.editableTodoId,
        isAdmin: state.app.currentUserStatus.isAdmin
    };
};

Todo.propTypes = {
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
    image: PropTypes.string,
    authorFullName: PropTypes.string,
    isAdmin: PropTypes.bool
};

export default connect(mapStateToProps)(Todo);
