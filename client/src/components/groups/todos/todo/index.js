import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit }  from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { Container, Button } from "reactstrap";

import { setEditableTodoId } from "../../../../actions/TodoActions";

import { NOIMAGE_IMAGE_URL } from "../../../../constants/app";
import { GET_CURRENT_USER } from "../../../../constants/graphqlQueries/users";
import { GET_EDITABLE_TODO_ID } from "../../../../constants/graphqlQueries/todos";

import styles from "./todo.module.scss";

let Todo = ({
    id,
    text,
    isCompleted,
    image,
    authorFullName
}) => {
    const { data: currentUserData, loading: isCurrentUserDataLoading } = useQuery(GET_CURRENT_USER);
    const { data: editableTodoIdData } = useQuery(GET_EDITABLE_TODO_ID);
    const { editableTodoId } = editableTodoIdData.clientData.todos;

    return (
        <Container tag="section" className={styles.todo}>
            <div className={styles.userInfo}>
                <img
                    src={image || NOIMAGE_IMAGE_URL}
                    className={styles.todoImage}
                    alt=""
                />

                {
                    (!isCurrentUserDataLoading && currentUserData.currentUser.isAdmin)
                    && <div className={styles.authorFullName}>
                        <span className={styles.text}>Author:</span>
                        <span className={styles.fullName}>{authorFullName}</span>
                    </div>
                }

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

export default Todo;

Todo.propTypes = {
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
    image: PropTypes.string,
    authorFullName: PropTypes.string,
};
