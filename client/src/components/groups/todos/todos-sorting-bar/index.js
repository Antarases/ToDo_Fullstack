import React from "react";
import { connect } from "react-redux";
import { dispatch } from "../../../../store/configureStore";
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
            <section id="sorting-bar" >
                Sort by:

                { isUserAdmin && <div onClick={() => this.setTodosSortParamsAndGetSortedTodos("userFullName")} >
                    User Name
                </div> }

                <div onClick={() => this.setTodosSortParamsAndGetSortedTodos("creationDate")} >
                    Date
                </div>

                <div onClick={() => this.setTodosSortParamsAndGetSortedTodos("isCompleted")} >
                    Status
                </div>
            </section>
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