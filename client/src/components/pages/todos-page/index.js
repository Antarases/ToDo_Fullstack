import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import LoginForm from "../../commons/login-form";
import EditTodoForm from "../../groups/todos/edit-todo-form"
import AddTodo from "../../groups/todos/add-todo/add-todo.component";
import TodosSortingBar from "../../groups/todos/todos-sorting-bar";
import TodosPagination from "../../commons/todos-pagination";
import TodoList from "../../groups/todos/todo-list";

import "./todos-page.css";

class TodosPage extends React.Component{
    render() {
        const { isTodos, editableTodoId } = this.props;

        return (
            <div id="todo-app">
                <LoginForm />

                { editableTodoId && <EditTodoForm /> }

                <AddTodo />

                { isTodos && <TodosSortingBar /> }
                { isTodos && <TodosPagination /> }
                <TodoList />
                { isTodos && <TodosPagination className="bottomTodoPagination" /> }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isTodos: !!Object.keys(state.todos.todos).length,
        editableTodoId: state.todos.editableTodoId
    }
};

export default connect(mapStateToProps)(TodosPage);

TodosPage.propTypes = {
    isTodos: PropTypes.bool
};
