import React from "react";
import PropTypes from "prop-types";

import Todo from "../todo";

import styles from "./todo-list.module.scss";

const TodoList = ({ todos = [], isTodosLoading }) => {
    return (
        <div className={styles.todoList}>
            {
                todos.map(todo => (
                    <Todo
                        key={todo.id}
                        id={todo.id}
                        text={todo.text}
                        image={todo.image}
                        isCompleted={todo.isCompleted}
                        authorFullName={todo.author.userFullName}
                    />
                ))
            }

            {
                (!isTodosLoading && !todos.length)
                && <div className={styles.noTodosText}>You have no todos yet</div>
            }
            { (isTodosLoading && !todos.length) && <div className={styles.isLoading}>Todos are being loaded...</div> }
        </div>
    );
};

export default TodoList;

TodoList.propTypes = {
    todos: PropTypes.array,
    isTodosLoading: PropTypes.bool
};
