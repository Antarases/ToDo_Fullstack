import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight }  from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { Container, Button } from "reactstrap";

import { setEditableTodoId } from "../../../actions/TodoActions";
import { setCurrentTodosPage } from "../../../actions/TodosPaginationActions";

import { GET_TODOS_PAGINATION_AND_SORT_PARAMS } from "../../../constants/graphqlQueries/todosPaginationAndSortParams";
import { GET_TOTAL_TODOS_AMOUNT } from "../../../constants/graphqlQueries/todos";
import { TODOS_PER_PAGE } from "../../../constants/todosPagination";

import styles from "./todos-pagination.module.scss";

const TodosPagination = ({ className }) => {
    const { data: todosPaginationAndSortParamsData } = useQuery(GET_TODOS_PAGINATION_AND_SORT_PARAMS);
    const {
        todosPagination: { currentTodosPage }
    } = todosPaginationAndSortParamsData.clientData;

    const { data: totalTodosAmountData } = useQuery(GET_TOTAL_TODOS_AMOUNT);

    const totalTodoPagesAmount = totalTodosAmountData
        ? Math.ceil(totalTodosAmountData.totalTodosAmount / TODOS_PER_PAGE)
        : null;

    return (
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
                    setCurrentTodosPage(nextPage);
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
                    setCurrentTodosPage(nextPage);
                }}
            >
                <FontAwesomeIcon icon={faAngleRight} className={styles.arrowIcon} size="lg" />
            </Button>
        </Container>
    );
};

export default TodosPagination;

TodosPagination.propTypes = {
    className: PropTypes.string
};
