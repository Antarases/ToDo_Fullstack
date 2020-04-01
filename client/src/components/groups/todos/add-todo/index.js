import React, { useState } from "react";
import classnames from "classnames";

import { Container, Row, Col, Input, Button } from "reactstrap";

import { addTodo } from "../../../../actions/TodoActions";

import styles from './add-todo.module.scss';

const AddTodo = () => {
    const [text, setText] = useState("");
    let imageRef = React.createRef();

    return (
        <React.Fragment>
            <Container tag="section" className={styles.addTodo}>
                <form action=""
                      onSubmit={(e) => {
                          e.preventDefault();

                          addTodo(text, imageRef.current.files[0]);

                          imageRef.current.value = null;
                          setText("");
                      }}
                >
                    <Row>
                        <Col
                            className={styles.title}
                            lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm={{size: 6, offset: 3}} xs={12}
                        >
                            Add Todo
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            className={styles.formFieldsContainer}
                            lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm={{size: 8, offset: 2}} xs={12}
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
                            lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm={{size: 8, offset: 2}} xs={12}
                        >
                            <label htmlFor="file" className={styles.label}>Image:</label>
                            <input
                                id="file"
                                type="file"
                                accept="image/*"
                                ref={imageRef}
                                onChange={(e) => {
                                    {/*imageValidation(imageRef.current, this.imageValidationNode);*/}
                                    {/*this.setState({image: e.target.value});*/}
                                }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            className={styles.submitButtonContainer}
                            lg={{size: 4, offset: 4}} md={{size: 6, offset: 3}} sm={{size: 8, offset: 2}} xs={12}
                        >
                            <Button
                                className={styles.submitButton}
                                type="submit"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Container>
        </React.Fragment>
    );
};

export default AddTodo;
