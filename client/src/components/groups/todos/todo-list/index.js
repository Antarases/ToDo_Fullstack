import React from "react";
import { connect } from "react-redux";
import { dispatch } from "../../../../store/configureStore"
import PropTypes from "prop-types";

import Todo from "../todo";

import { getTodos } from "../../../../actions/TodoActions";

import { INITIAL_TODOS_PAGE } from "../../../../constants/todosPagination";
import { initialState as sortParamsInitialState } from "../../../../reducers/todosSortParams";

import styles from "./todo-list.module.scss";

class TodoList extends React.Component {
    componentDidMount() {
        getTodos(INITIAL_TODOS_PAGE, sortParamsInitialState.sortField, sortParamsInitialState.sortOrder);
    }

    render() {
        const { todos } = this.props;

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
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todos: state.todos.todos
    };
};

export default connect(mapStateToProps)(TodoList);

TodoList.propTypes = {
    todos: PropTypes.object
};
