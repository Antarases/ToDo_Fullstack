import React from "react";
import { connect } from "react-redux";
import { dispatch } from "../../../../store/configureStore";
import PropTypes from "prop-types";

import { Grid, Row, Col, FormControl, Button } from "react-bootstrap";

import { editTodo, setEditableTodoId } from "../../../../actions/TodoActions";

import "./edit-todo-form.css";

class EditTodoForm extends React.Component{
    state = {
        text: "",
        isCompleted: false
    };

    componentDidMount() {
        const { text, isCompleted } = this.props.editableTodo;

        this.setState({ text, isCompleted });
    }

    componentDidUpdate(prevProps) {
        if (this.props.editableTodo.id && prevProps.editableTodo && (this.props.editableTodo.id !== prevProps.editableTodo.id)) {
            const { text, isCompleted } = this.props.editableTodo;

            this.setState({ text, isCompleted });
        }
    }

    render(){
        let { editableTodoId } = this.props;
        const { text, isCompleted } = this.state;

        return (
            <Grid
                componentClass="section"
                id="edit-todo-form"
            >
                <Row>
                    <Col
                        className="title"
                        lg={4} md={6} sm={6} xs={12}
                        lgOffset={4} mdOffset={3} smOffset={3}
                    >
                        Edit Todo
                    </Col>
                </Row>

                <Row>
                    <Col
                        className="text"
                        componentClass="label"
                        lg={4} md={6} sm={6} xs={12}
                        lgOffset={4} mdOffset={3} smOffset={3}
                    >
                        <span>Text:</span>
                        <FormControl
                            type="text"
                            required
                            placeholder="Enter text"
                            bsSize="small"
                            value={text}
                            onChange={(e) => this.setState({text: e.target.value})}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col
                        className="text"
                        componentClass="label"
                        lg={4} md={6} sm={6} xs={12}
                        lgOffset={4} mdOffset={3} smOffset={3}
                    >
                        <span>Image:</span>
                        <FormControl
                            type="file"
                            accept="image/*"
                            required
                            inputRef={node => this.image = node}
                            onChange={(e) => {
                                {/*imageValidation(this.image, this.imageValidationNode);*/}
                                {/*this.setState({image: e.target.value});*/}
                            }}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col
                        className="todoCompletionStatus"
                        componentClass="label"
                        lg={4} md={6} sm={6} xs={12}
                        lgOffset={4} mdOffset={3} smOffset={3}
                    >
                        <span>Completed: </span>
                        <FormControl
                            type="checkbox"
                            bsSize="small"
                            checked={isCompleted}
                            onChange={(e) => this.setState({isCompleted: e.target.checked})}
                        />
                    </Col>
                </Row>


                <Col
                    className="submitButtonContainer"
                    lg={4} md={6} sm={6} xs={12}
                    lgOffset={4} mdOffset={3} smOffset={3}
                >
                    <Button
                        onClick={async () => {
                            await dispatch(editTodo(
                                editableTodoId,
                                text,
                                isCompleted,
                                this.image.files[0]
                            ));

                            setEditableTodoId(null);
                        }}
                        bsStyle="primary"
                    >
                        Apply
                    </Button>
                </Col>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    const { editableTodoId } = state.todos;
    const editableTodo = state.todos.todos[editableTodoId];

    return {
        editableTodoId,
        editableTodo
    };
};

export default connect(mapStateToProps)(EditTodoForm);

EditTodoForm.propTypes = {
    editableTodoId: PropTypes.string,
    editableTodo: PropTypes.object
};
