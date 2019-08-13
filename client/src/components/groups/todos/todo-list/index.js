import React from "react";
import { connect } from "react-redux";
import { dispatch } from "../../../../store/configureStore"
import PropTypes from "prop-types";

import Todo from "../todo";

import { getTodos } from "../../../../actions/TodoActions";

import { INITIAL_TODOS_PAGE } from "../../../../constants/todosPagination";

import "./todo-list.css";

class TodoList extends React.Component {
    componentDidMount() {
        dispatch(
            getTodos(INITIAL_TODOS_PAGE)
        );
    }

    render() {
        const { todos } = this.props;

        return (
            <div className="todoList">
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
