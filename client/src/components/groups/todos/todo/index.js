import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Container, Col, Button } from "react-bootstrap";

import { smoothScrollUp } from "../../../../helpers/Functions";
import { setEditableTodoId } from "../../../../actions/TodoActions";

import './todo.component.css';

let Todo = ({
    id,
    text,
    isCompleted,
    image,
    isAdmin,
    editableTodoId
}) => {
    return (
        <Container as="section" className="todo">
            <div className="user-info">
                <img src={image} alt="" className="todoImage" />

                {/*<div className="user-name">*/}
                    {/*{username}*/}
                {/*</div>*/}

                <div className="status">
                    <span className="text">Status:</span>
                    <i className={"fas fa-check icon " + (isCompleted ? "completed" : "incompleted")}></i>
                </div>

                <Button
                    onClick={() => {
                        (editableTodoId !== id) && setEditableTodoId(id);
                        smoothScrollUp();
                    }}
                    className="ediTodoButton"
                >
                    <i className="fas fa-edit"></i>
                    <span className="text">
                        Edit
                    </span>
                </Button>
            </div>

            <div className="desctiption">
                {text}
            </div>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        editableTodoId: state.todos.editableTodoId
    };
};

Todo.propTypes = {
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
    image: PropTypes.string,
    isAdmin: PropTypes.bool
};

export default connect(mapStateToProps)(Todo);
