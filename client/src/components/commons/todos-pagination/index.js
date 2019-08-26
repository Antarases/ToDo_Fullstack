import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dispatch } from "../../../store/configureStore";
import classnames from "classnames";

import { getTodos, setEditableTodoId } from "../../../actions/TodoActions";
import { setCurrentTodosPage } from "../../../actions/TodosPaginationActions";

import { Container, Button } from "react-bootstrap";

import styles from "./pagination.module.scss";

const TodosPagination = ({
    currentTodosPage,
    totalTodoPagesAmount,
    sortField,
    sortOrder,
    className
}) => (
    <Container
        as="section"
        className={classnames(styles.pagination, className)}
    >

        <span className={styles.paginationText}>
            {`Page `}
            <span className={styles.bold}>{currentTodosPage}</span>
            {` of `}
            <span className={styles.bold}>{totalTodoPagesAmount}</span>
        </span>

        <Button
            className={classnames(styles.button, styles.prev)}
            variant={
                currentTodosPage === 1
                    ? "secondary"
                    : "primary"
            }
            size="sm"
            disabled={currentTodosPage === 1}
            onClick={async () => {
                setEditableTodoId(null);
                const nextPage = currentTodosPage - 1;

                await dispatch(
                    getTodos(nextPage, sortField, sortOrder)
                );
                setCurrentTodosPage(nextPage);
            }}
        >
            <i className={classnames(styles.arrowIcon, "fas fa-angle-right fa-lg")}></i>
        </Button>

        <Button
            className={classnames(styles.button, styles.next)}
            variant={
                currentTodosPage === totalTodoPagesAmount
                    ? "secondary"
                    : "primary"
            }
            size="sm"
            disabled={currentTodosPage === totalTodoPagesAmount}
            onClick={async () => {
                setEditableTodoId(null);
                const nextPage = currentTodosPage + 1;

                await dispatch(
                    getTodos(nextPage, sortField, sortOrder)
                );
                setCurrentTodosPage(nextPage);
            }}
        >
            <i className={classnames(styles.arrowIcon, "fas fa-angle-right fa-lg")}></i>
        </Button>
    </Container>
);

const mapStateToProps = (state) => {
    return {
        currentTodosPage: state.todosPagination.currentTodosPage,
        totalTodoPagesAmount: state.todosPagination.totalTodoPagesAmount,
        sortField: state.todosSortParams.sortField,
        sortOrder: state.todosSortParams.sortOrder
    }
};

export default connect(mapStateToProps)(TodosPagination);

TodosPagination.propTypes = {
    currentTodosPage: PropTypes.number,
    totalTodoPagesAmount: PropTypes.number,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    className: PropTypes.string
};
