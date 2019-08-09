import React from "react";
import { connect } from "react-redux";
import { dispatch } from "../../../../store/configureStore";
import { Container, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import { getTodos } from "../../../../actions/TodoActions";
import { setTodosSortParams } from "../../../../actions/TodosSortActions";

import "./sorting-bar.css";

class TodosSortingBar extends React.Component {
    setTodosSortParamsAndGetSortedTodos = async (sortField) => {
        let { currentTodosPage, sortField: currentSortField, sortDirection } = this.props;

        if(sortField === currentSortField){
            sortDirection = (sortDirection === "asc") ? "desc" : "asc";    //reversing sort direction
        }
        else {
            sortDirection = "asc";
        }

        setTodosSortParams(sortField, sortDirection);
        dispatch(getTodos(currentTodosPage, sortField, sortDirection));
    };

    render() {
        const { isUserAdmin } = this.props;

        return (
            <Container as="section" id="sorting-bar">
                    <span className="sortingBarTitle">Sort by:</span>

                    <Col
                        className="sortingBarOptions"
                        sm="auto" xs="12"
                    >
                        { isUserAdmin && <Col
                            className="sortingBarOption"
                            sm="auto" xs="12"
                            onClick={() => this.setTodosSortParamsAndGetSortedTodos("userFullName")}
                        >
                            User Name
                        </Col> }

                        <Col
                            className="sortingBarOption"
                            sm="auto" xs="12"
                            onClick={() => this.setTodosSortParamsAndGetSortedTodos("creationDate")}
                        >
                            Date
                        </Col>

                        <Col
                            className="sortingBarOption"
                            sm="auto" xs="12"
                            onClick={() => this.setTodosSortParamsAndGetSortedTodos("isCompleted")}
                        >
                            Status
                        </Col>
                    </Col>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentTodosPage: state.todosPagination.currentTodosPage,
        sortField: state.todosSortParams.sortField,
        sortDirection: state.todosSortParams.sortDirection,
        isUserAdmin: state.app.currentUserStatus.isAdmin
    };
};

export default connect(mapStateToProps)(TodosSortingBar);

TodosSortingBar.propTypes = {
    currentTodosPage: PropTypes.number,
    sortField: PropTypes.string,
    sortDirection: PropTypes.string,
    isAdmin: PropTypes.string
};