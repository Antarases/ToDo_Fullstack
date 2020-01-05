import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Todo from "../todo";

import styles from "./todo-list.module.scss";

class TodoList extends React.Component {
    render() {
        const { todos, isTodosLoading } = this.props;

        return (
            <div className={styles.todoList}>
                {
                    Object.values(todos).map(todo => (
                        <Todo
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            image={todo.image}
                            isCompleted={todo.isCompleted}
                            authorFullName={todo.authorFullName}
                        />
                    ))
                }

                {
                    (!isTodosLoading && !Object.keys(todos).length)
                    && <div className={styles.noTodosText}>You have no todos yet</div>
                }
                { isTodosLoading && <div className={styles.isLoading}>Todos are being loaded...</div> }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todos: state.todos.todos,
        isTodosLoading: state.todos.isTodosLoading
    };
};

export default connect(mapStateToProps)(TodoList);

TodoList.propTypes = {
    todos: PropTypes.object,
    isTodosLoading: PropTypes.bool
};
