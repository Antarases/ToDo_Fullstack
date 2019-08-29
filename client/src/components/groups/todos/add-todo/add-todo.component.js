import React from "react";
import { Container, Row, Col, FormControl, Button } from "react-bootstrap";
import { addTodo } from "../../../../actions/TodoActions";

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
        }
    }

    render(){
        return (
            <React.Fragment>
                <Container as="section" className={styles.addTodo}>
                    <form action=""
                          onSubmit={(e) => {
                              e.preventDefault();

                              addTodo(this.state.text, this.image.files[0]);

                              this.image.value = null;
                              this.setState({ text: "" });
                          }}
                    >
                        <Row>
                            <Col
                                className={styles.title}
                                lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 6, offset: 3}} xs={12}
                            >
                                Add Todo
                            </Col>
                        </Row>

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
                                    value={this.state.text}
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
                                        {/*this.setState({image: e.target.value});*/}
                                    }}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                className={styles.submitButtonContainer}
                                lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} sm={{span: 8, offset: 2}} xs={12}
                            >
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className={styles.submitButton}
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
