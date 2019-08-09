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
    sortDirection
}) => (
    <Container
        id="pagination"
        as="section"
    >

        <span>
            Page {currentTodosPage} of {totalTodoPagesAmount}
        </span>

        <Button
            className="prev"
            style={{
                display: currentTodosPage === 1 ?
                    'none' :
                    'inline-block'
            }}
            onClick={async () => {
                const nextPage = currentTodosPage - 1;

                await dispatch(
                    getTodos(nextPage, sortField, sortDirection)
                );
                setCurrentTodosPage(nextPage);
            }}
        >
            &lt;
        </Button>

        <Button
            className="next"
            style={{
                display: currentTodosPage === totalTodoPagesAmount ?
                    'none' :
                    'inline-block'
            }}
            onClick={async () => {
                const nextPage = currentTodosPage + 1;

                await dispatch(
                    getTodos(nextPage, sortField, sortDirection)
                );
                setCurrentTodosPage(nextPage);
            }}
        >
            &gt;
        </Button>
    </Container>
);

const mapStateToProps = (state) => {
    return {
        currentTodosPage: state.todosPagination.currentTodosPage,
        totalTodoPagesAmount: state.todosPagination.totalTodoPagesAmount,
        sortField: state.todosSortParams.sortField,
        sortDirection: state.todosSortParams.sortDirection
    }
};

export default connect(mapStateToProps)(TodosPagination);

TodosPagination.propTypes = {
    currentTodosPage: PropTypes.number,
    totalTodoPagesAmount: PropTypes.number,
    sortField: PropTypes.string,
    sortDirection: PropTypes.string
};
