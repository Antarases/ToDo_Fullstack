import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dispatch } from "../../../store/configureStore";

import { getTodos } from "../../../actions/TodoActions";
import { setCurrentTodosPage } from "../../../actions/TodosPaginationActions";

import { Container, Button } from "react-bootstrap";

import "./pagination.css";

const TodosPagination = ({
    currentTodosPage,
    totalTodoPagesAmount,
    sortField,
    sortOrder,
    className
}) => (
    <Container
        as="section"
        className={"pagination " + className}
    >

        <span className="paginationText">
            {`Page `}
            <span className="bold">{currentTodosPage}</span>
            {` of `}
            <span className="bold">{totalTodoPagesAmount}</span>
        </span>

        <Button
            className="button prev"
            variant={
                currentTodosPage === 1
                    ? "secondary"
                    : "primary"
            }
            size="sm"
            disabled={currentTodosPage === 1}
            onClick={async () => {
                const nextPage = currentTodosPage - 1;

                await dispatch(
                    getTodos(nextPage, sortField, sortOrder)
                );
                setCurrentTodosPage(nextPage);
            }}
        >
            <i class="fas fa-angle-right fa-lg arrow-icon"></i>
        </Button>

        <Button
            className="button next"
            variant={
                currentTodosPage === totalTodoPagesAmount
                    ? "secondary"
                    : "primary"
            }
            size="sm"
            disabled={currentTodosPage === totalTodoPagesAmount}
            onClick={async () => {
                const nextPage = currentTodosPage + 1;

                await dispatch(
                    getTodos(nextPage, sortField, sortOrder)
                );
                setCurrentTodosPage(nextPage);
            }}
        >
            <i class="fas fa-angle-right fa-lg arrow-icon"></i>
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
