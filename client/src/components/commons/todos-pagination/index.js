import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight }  from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { getTodos, setEditableTodoId } from "../../../actions/TodoActions";

import { Container, Button } from "reactstrap";

import styles from "./todos-pagination.module.scss";

const TodosPagination = ({
    currentTodosPage,
    totalTodoPagesAmount,
    sortField,
    sortOrder,
    className
}) => (
    <Container
        tag="section"
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
            color={
                currentTodosPage === 1
                    ? "secondary"
                    : "primary"
            }
            size="sm"
            disabled={currentTodosPage === 1}
            onClick={() => {
                setEditableTodoId(null);
                const nextPage = currentTodosPage - 1;

                getTodos(nextPage, sortField, sortOrder, nextPage);
            }}
        >
            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowIcon} size="lg" rotation={180} />
        </Button>

        <Button
            className={classnames(styles.button, styles.next)}
            color={
                currentTodosPage === totalTodoPagesAmount
                    ? "secondary"
                    : "primary"
            }
            size="sm"
            disabled={currentTodosPage === totalTodoPagesAmount}
            onClick={() => {
                setEditableTodoId(null);
                const nextPage = currentTodosPage + 1;

                getTodos(nextPage, sortField, sortOrder, nextPage);
            }}
        >
            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowIcon} size="lg" />
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
