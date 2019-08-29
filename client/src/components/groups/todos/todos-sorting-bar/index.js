import React from "react";
import { connect } from "react-redux";
import { Container, Col } from "react-bootstrap";
import PropTypes from "prop-types";

import { getTodos } from "../../../../actions/TodoActions";
import { setTodosSortParams } from "../../../../actions/TodosSortActions";

import styles from "./sorting-bar.module.scss";

class TodosSortingBar extends React.Component {
    setTodosSortParamsAndGetSortedTodos = (sortField) => {
        let { currentTodosPage, sortField: currentSortField, sortOrder } = this.props;

        if(sortField === currentSortField){
            sortOrder = (sortOrder === "asc") ? "desc" : "asc";    //reversing sort direction
        }
        else {
            sortOrder = "asc";
        }

        setTodosSortParams(sortField, sortOrder);
        getTodos(currentTodosPage, sortField, sortOrder);
    };

    render() {
        const { isUserAdmin } = this.props;

        return (
            <Container as="section" className={styles.sortingBar}>
                    <span className={styles.sortingBarTitle}>Sort by:</span>

                    <Col
                        className={styles.sortingBarOptions}
                        sm="auto" xs="12"
                    >
                        { isUserAdmin && <Col
                            className={styles.sortingBarOption}
                            sm="auto" xs="12"
                            onClick={() => this.setTodosSortParamsAndGetSortedTodos("userFullName")}
                        >
                            User Name
                        </Col> }

                        <Col
                            className={styles.sortingBarOption}
                            sm="auto" xs="12"
                            onClick={() => this.setTodosSortParamsAndGetSortedTodos("creationDate")}
                        >
                            Date
                        </Col>

                        <Col
                            className={styles.sortingBarOption}
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
        sortOrder: state.todosSortParams.sortOrder,
        isUserAdmin: state.app.currentUserStatus.isAdmin
    };
};

export default connect(mapStateToProps)(TodosSortingBar);

TodosSortingBar.propTypes = {
    currentTodosPage: PropTypes.number,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    isAdmin: PropTypes.string
};