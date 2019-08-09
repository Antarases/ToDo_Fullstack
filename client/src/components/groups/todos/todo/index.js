import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Container, Col, Button } from "react-bootstrap";

import { smoothScrollUp } from "../../../../helpers/Functions";
import { setEditableTodoId } from "../../../../actions/TodoActions";

import './todo.component.css';

let Todo = ({
    id,
    username,
    email,
    text,
    status,
    image,
    isAdmin,
    isPreview,
    editableTodoId
}) => {
    let completed;
    if(status === 0){
        completed = false;
    } else if(status === 10){
        completed = true;
    }

    return (
        <Container
            className="todo"
            as="section"
        >
            <span className="user-info">
                <img src={image} alt="" className="todoImage" />

                {/*<div className="user-name">*/}
                    {/*{username}*/}
                {/*</div>*/}

                {/*<div className="email">*/}
                    {/*{email}*/}
                {/*</div>*/}
                {/*<div className="readiness">*/}
                    {/*Status: {completed ? 'completed' : 'not completed' }*/}
                {/*</div>*/}

                <Col lg={12} md={12} sm={12} xs={12}>
                    <Button
                        onClick={() => {
                            (editableTodoId !== id) && setEditableTodoId(id);
                            smoothScrollUp();
                        }}
                        className="glyphicon glyphicon-edit"
                        id="edit-todo-button"
                    >
                        <span className="text">
                            Edit
                        </span>
                    </Button>
                </Col>
            </span>

            <Col
                className="text"
                lg={8} md={7} sm={6} xs={12}
            >
                {text}
            </Col>
        </Container>
    );
};

Todo.propTypes = {
    username: PropTypes.string,
    email: PropTypes.string,
    text: PropTypes.string,
    status: PropTypes.number,
    image: PropTypes.string
    // isAdmin: PropTypes.bool,
    // isPreview: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        // isAdmin: state.signIn.isAdmin
        editableTodoId: state.todos.editableTodoId
    };
};

Todo = connect(
    mapStateToProps
)(Todo);

export default Todo;
