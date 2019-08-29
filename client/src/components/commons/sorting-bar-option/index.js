import React from "react";
import { connect } from "react-redux";
import { Col } from "react-bootstrap";
import PropTypes from "prop-types";

import { getTodos } from "../../../actions/TodoActions";
import { setTodosSortParams } from "../../../actions/TodosSortActions";

import styles from "./sorting-bar-option.module.scss";

class SortingBarOption extends React.Component {
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
        const { sortParam } = this.props;

        return (
            <Col
                className={styles.sortingBarOption}
                sm="auto" xs="12"
                onClick={() => this.setTodosSortParamsAndGetSortedTodos(sortParam)}
            >
                { this.props.children }
            </Col>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentTodosPage: state.todosPagination.currentTodosPage,
        sortField: state.todosSortParams.sortField,
        sortOrder: state.todosSortParams.sortOrder
    };
};

export default connect(mapStateToProps)(SortingBarOption);

SortingBarOption.propTypes = {
    currentTodosPage: PropTypes.number,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    sortParam: PropTypes.string
};
