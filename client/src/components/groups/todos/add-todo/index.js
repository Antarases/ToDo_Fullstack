import React from "react";
import classnames from "classnames";

import { Container, Row, Col, Input, Button } from "reactstrap";
import { addTodo } from "../../../../websockets/TodoSocket";

import styles from './add-todo.module.scss';

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
class AddTodo extends React.Component {
    constructor(props){
        super (props);

        this.state={
            username: '',
            email: '',
            isPreview: false,
            text: ""
        };

        this.imageRef = React.createRef();
    }

    render(){
        return (
            <React.Fragment>
                <Container tag="section" className={styles.addTodo}>
                    <form action=""
                          onSubmit={(e) => {
                              e.preventDefault();

                              addTodo(this.state.text, this.imageRef.current.files[0]);

                              this.imageRef.current.value = null;
                              this.setState({ text: "" });
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
                                    value={this.state.text}
                                    onChange={(e) => this.setState({text: e.target.value})}
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
                                    ref={this.imageRef}
                                    onChange={(e) => {
                                        {/*imageValidation(this.imageRef.current, this.imageValidationNode);*/}
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
        )
    }
}

export default AddTodo;
