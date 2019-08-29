import React from "react";
import { connect } from "react-redux";
import { dispatch } from "../../../../store/configureStore";
import PropTypes from "prop-types";
import classnames from "classnames";

import { Container, Row, Col, FormControl, Button } from "react-bootstrap";

import { editTodo, setEditableTodoId } from "../../../../actions/TodoActions";

import styles from "./edit-todo-form.module.scss";

class EditTodoForm extends React.Component{
    state = {
        text: "",
        image: null,
        isCompleted: false,
        isTodoFetchingFailed: false
    };

    async componentDidMount() {
        const { text, image, isCompleted } = this.props.editableTodo;

        try {
            let imageFile = null;
            if (image) {
                const fetchedImage = await fetch(image);
                 imageFile = await fetchedImage.blob();
            }

            this.setState({ text, image: imageFile, isCompleted });
        } catch (err) {
            this.setState({ isTodoFetchingFailed: true });
            console.log("Failed to fetch TODO image.", err);
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.editableTodo.id && prevProps.editableTodo && (this.props.editableTodo.id !== prevProps.editableTodo.id)) {
            const { text, image, isCompleted } = this.props.editableTodo;

            try {
                let imageFile = null;
                if (image) {
                    const fetchedImage = await fetch(image);
                    imageFile = await fetchedImage.blob();
                }

                this.setState({text, image: imageFile, isCompleted, isTodoFetchingFailed: false});
            } catch (err) {
                this.setState({ isTodoFetchingFailed: true });
                console.log("Failed to fetch TODO image.", err);
            }
        }
    }

    render(){
        let { editableTodoId } = this.props;
        const { text, image, isCompleted, isTodoFetchingFailed } = this.state;

        return (
            <Container as="section" className={styles.editTodoForm}>
                <Row>
                    <Col
                        className={styles.title}
                        lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 6, offset: 3}} xs={12}
                    >
                        Edit Todo
                    </Col>
                </Row>

                { !isTodoFetchingFailed
                    ? <React.Fragment>
                        <Row>
                            <Col
                                className={styles.formFieldsContainer}
                                lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}} xs={12}
                            >
                                <label htmlFor="text" className={styles.label}>Text:</label>
                                <FormControl
                                    id="text"
                                    type="text"
                                    required
                                    placeholder="Enter text"
                                    value={text}
                                    onChange={(e) => this.setState({text: e.target.value})}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                className={styles.formFieldsContainer}
                                lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}} xs={12}
                            >
                                <label htmlFor="file" className={styles.label}>Image:</label>
                                <FormControl
                                    id="file"
                                    type="file"
                                    accept="image/*"
                                    ref={node => this.image = node}
                                    onChange={(e) => {
                                        {/*imageValidation(this.image, this.imageValidationNode);*/}
                                        this.setState({image: e.target.files[0]});
                                    }}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                className={classnames(styles.formFieldsContainer, styles.todoCompletionStatus)}
                                lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}} xs={12}
                            >
                                <label htmlFor="isCompleted" className={styles.label}>Completed: </label>
                                <FormControl
                                    className={styles.checkbox}
                                    id="isCompleted"
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={(e) => this.setState({isCompleted: e.target.checked})}
                                />
                            </Col>
                        </Row>


                        <Col
                            className={styles.buttonsContainer}
                            lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}} xs={12}
                        >
                            <Button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setEditableTodoId(null);
                                }}
                                variant="primary"
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={async () => {
                                    await editTodo(
                                        editableTodoId,
                                        text,
                                        isCompleted,
                                        image
                                    );

                                    setEditableTodoId(null);
                                }}
                                variant="primary"
                            >
                                Apply
                            </Button>
                        </Col>
                    </React.Fragment>
                    : <Row>
                        <Col
                            className="errorMessage"
                            lg={4} md={6} sm={6} xs={12}
                            lgOffset={4} mdOffset={3} smOffset={3}
                        >
                            Failed to get TODO for editing.
                        </Col>
                    </Row>
                }
            </Container>
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
