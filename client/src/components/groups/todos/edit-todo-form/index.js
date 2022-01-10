import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import classnames from "classnames";

import { Container, Row, Col, Input, Button } from "reactstrap";
import CenteredSpinner from "../../../commons/centered-spinner";

import { editTodo, setEditableTodoId } from "../../../../actions/TodoActions";

import { GET_EDITABLE_TODO } from "../../../../constants/graphqlQueries/todos";

import styles from "./edit-todo-form.module.scss";

const EditTodoForm = () => {
    const [todoId, setTodoId] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isTodoFetching, setIsTodoFetching] = useState(true);
    const [isTodoFetchingFailed, setIsTodoFetchingFailed] = useState(false);

    const imageRef =  React.createRef();

    const [getEditableTodo] = useLazyQuery(
        GET_EDITABLE_TODO,
        {
            fetchPolicy: "no-cache",
            onCompleted: (data) => {
                const { id, text, image, isCompleted } = data.todos_getEditableTodoFromCache;

                setTodoId(id);
                setText(text);
                setImage(image);
                setIsCompleted(isCompleted);
                setIsTodoFetching(false);
            },
            onError: (error) => {
                setIsTodoFetching(false);
                setIsTodoFetchingFailed(true);
                console.log("Failed to fetch TODO image.", error);
            }
        }
    );
    useEffect(() => {
        getEditableTodo();
    }, []);

    return (
        <Container tag="section" className={styles.editTodoForm}>
            <Row>
                <Col
                    className={styles.title}
                    lg={{size: 10, offset: 1}} md={{size: 10, offset: 1}} sm={{size: 10, offset: 1}} xs={12}
                >
                    Edit Todo
                </Col>
            </Row>

            {
                (!isTodoFetching && !isTodoFetchingFailed)
                && <React.Fragment>
                    <Row>
                        <Col
                            className={styles.formFieldsContainer}
                            lg={{size: 10, offset: 1}} md={{size: 10, offset: 1}} sm={{size: 10, offset: 1}} xs={12}
                        >
                            <label htmlFor="text" className={styles.label}>Text:</label>
                            <Input
                                id="text"
                                type="text"
                                required
                                placeholder="Enter text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            className={classnames(styles.formFieldsContainer, styles.fileContainer)}
                            lg={{size: 10, offset: 1}} md={{size: 10, offset: 1}} sm={{size: 10, offset: 1}} xs={12}
                        >
                            <label htmlFor="file" className={styles.label}>Image:</label>
                            <input
                                id="file"
                                type="file"
                                accept="image/*"
                                ref={imageRef}
                                onChange={(e) => {
                                    {/*imageValidation(imageRef.current, this.imageValidationNode);*/}
                                    setImage(e.target.files[0]);
                                }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            className={classnames(styles.formFieldsContainer, styles.todoCompletionStatus)}
                            lg={{size: 10, offset: 1}} md={{size: 10, offset: 1}} sm={{size: 10, offset: 1}} xs={12}
                        >
                            <label htmlFor="isCompleted" className={styles.label}>Completed: </label>
                            <Input
                                className={styles.checkbox}
                                id="isCompleted"
                                type="checkbox"
                                checked={isCompleted}
                                onChange={(e) => setIsCompleted(e.target.checked)}
                            />
                        </Col>
                    </Row>


                    <Row>
                        <Col
                            className={styles.buttonsContainer}
                            lg={{size: 10, offset: 1}} md={{size: 10, offset: 1}} sm={{size: 10, offset: 1}} xs={12}
                        >
                            <Button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setEditableTodoId(null);
                                }}
                                color="primary"
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={() => editTodo({ todoId, text, image, isCompleted })}
                                color="primary"
                            >
                                Apply
                            </Button>
                        </Col>
                    </Row>
                </React.Fragment>
            }

            {
                (!isTodoFetching && isTodoFetchingFailed)
                && <Row>
                    <section className={styles.errorMessageContainer}>
                        <div className={styles.errorMessage}>
                            Failed to get TODO for editing.
                        </div>

                        <div
                            className={styles.cancelButtonContainer}
                        >
                            <Button
                                className={styles.closeButton}
                                onClick={() => {
                                    setEditableTodoId(null);
                                }}
                                color="primary"
                            >
                                Close
                            </Button>
                        </div>
                    </section>
                </Row>
            }

            { (isTodoFetching && !isTodoFetchingFailed) && <CenteredSpinner /> }
        </Container>
    );
};

export default EditTodoForm;
