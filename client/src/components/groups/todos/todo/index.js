import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit }  from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { Container, Button } from "reactstrap";

import { smoothScrollUp } from "../../../../helpers/Functions";
import { setEditableTodoId } from "../../../../actions/TodoActions";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";

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
        <Container tag="section" className={styles.todo}>
            <div className={styles.userInfo}>
                <img
                    src={image || NOIMAGE_IMAGE_URL}
                    className={styles.todoImage}
                    alt=""
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
                    className={styles.ediTodoButton}
                    color="primary"
                    onClick={() => {
                        (editableTodoId !== id) && setEditableTodoId(id);
                        smoothScrollUp();
                    }}
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
