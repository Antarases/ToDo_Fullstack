import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Todo from "../todo";

import { getTodos } from "../../../../actions/TodoActions";

import { INITIAL_TODOS_PAGE } from "../../../../constants/todosPagination";

class TodoList extends React.Component {
    componentDidMount() {
        this.props.getTodos(INITIAL_TODOS_PAGE, "", "asc");
    }

    render() {
        const { todos } = this.props;

        return (
            <div id="todo-list">
                {
                    Object.values(todos).map(todo => (
                        <Todo
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            image={todo.image}
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

const mapDispatchToProps = (dispatch) => {
    return {
        getTodos: (page, sortField, sortDirection) => { dispatch(getTodos(page, sortField, sortDirection)); }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);

TodoList.propTypes = {
    todos: PropTypes.object,
    getTodos: PropTypes.func
};
