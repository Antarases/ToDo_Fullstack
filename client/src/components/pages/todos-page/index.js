import React, { Suspense, lazy }  from "react";
import { useQuery, useSubscription } from "@apollo/client";

const EditTodoForm = lazy(() => import("../../groups/todos/edit-todo-form"));
import AddTodo from "../../groups/todos/add-todo";
import TodosSortingBar from "../../groups/todos/todos-sorting-bar";
import TodosPagination from "../../commons/todos-pagination";
import TodoList from "../../groups/todos/todo-list";
import Modal from "../../commons/modal";

import { setEditableTodoId } from "../../../actions/TodoActions";
import { showNotificationModal } from "../../../actions/NotificationsModalActions";

import { GET_TODOS, GET_EDITABLE_TODO_ID, SUBSCRIPTION__TODO_ADDED, SUBSCRIPTION__TODO_EDITED } from "../../../constants/graphqlQueries/todos";
import { GET_TODOS_PAGINATION_AND_SORT_PARAMS } from "../../../constants/graphqlQueries/todosPaginationAndSortParams";

import styles from "./todos-page.module.scss";

const TodosPage = () => {
    const { data: todosPaginationAndSortParamsData, } = useQuery(GET_TODOS_PAGINATION_AND_SORT_PARAMS);
    const {
        todosPagination: { currentTodosPage },
        todosSortParams: { sortField, sortOrder }
    } = todosPaginationAndSortParamsData.clientData;

    const { data: todosData, loading: isTodosLoading, refetch: refetchTodos } = useQuery(GET_TODOS, {
        variables: {
            page: currentTodosPage,
            sortField,
            sortOrder
        },
        fetchPolicy: "cache-and-network",
        onError: (error) => {
            console.error("An error occurred during getting todos.", error);

            showNotificationModal({
                body: "An error occurred during getting todos.",
                buttons: [{ text: "OK" }],
                showFailIcon: true
            });
        }

    });
    const todos = todosData
        ? todosData.todos
        : [];
    const isTodos = !!todos.length;

    const { data: editableTodoIdData } = useQuery(GET_EDITABLE_TODO_ID);
    const { editableTodoId } = editableTodoIdData.clientData.todos;

    useSubscription(SUBSCRIPTION__TODO_ADDED, {
        onSubscriptionData: () => {
            refetchTodos();
        }
    });

    useSubscription(SUBSCRIPTION__TODO_EDITED, {
        onSubscriptionData: () => {
            refetchTodos();
        }
    });

    return (
        <section className={styles.todosPageContainer}>
            <AddTodo />

            { isTodos && <TodosSortingBar /> }
            { isTodos && <TodosPagination /> }
            <TodoList todos={todos} isTodosLoading={isTodosLoading} />
            { isTodos && <TodosPagination className={styles.bottomTodoPagination} /> }

            {
                !!editableTodoId
                && <Modal isOpen={true} toggleModal={() => setEditableTodoId(null)} contentClassName={styles.modalContent}>
                    <Suspense fallback={""}>
                        <EditTodoForm />
                    </Suspense>
                </Modal>
            }
        </section>
    );
};

export default TodosPage;
