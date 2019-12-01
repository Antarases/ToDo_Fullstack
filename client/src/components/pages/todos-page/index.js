import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setTodoSocketConnectionAndHandlers, closeTodoSocketConnection } from "../../../websockets/TodoSocket";

import LoginForm from "../../commons/login-form";
import EditTodoForm from "../../groups/todos/edit-todo-form"
import AddTodo from "../../groups/todos/add-todo/add-todo.component";
import TodosSortingBar from "../../groups/todos/todos-sorting-bar";
import TodosPagination from "../../commons/todos-pagination";
import TodoList from "../../groups/todos/todo-list";

import styles from "./todosPage.module.scss";

const TodosPage = ({ isTodos, editableTodoId }) => {
    useEffect(() => {
        setTodoSocketConnectionAndHandlers();

        return closeTodoSocketConnection;
    }, []);

    return (
        <section className={styles.todosPageContainer}>
            <LoginForm />

            { editableTodoId && <EditTodoForm /> }

            <AddTodo />

            { isTodos && <TodosSortingBar /> }
            { isTodos && <TodosPagination /> }
            <TodoList />
            { isTodos && <TodosPagination className={styles.bottomTodoPagination} /> }
        </section>
    );
};

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
