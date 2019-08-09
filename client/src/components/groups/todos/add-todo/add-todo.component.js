import React from "react";
import { dispatch } from "../../../../store/configureStore";
import { Container, Row, Col, FormControl, Button } from "react-bootstrap";
import { addTodo } from "../../../../actions/TodoActions";

import './add-todo.component.css';

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
                <Container componentClass="section" id="add-todo">
                    <form action=""
                          onSubmit={(e) => {
                              e.preventDefault();

                              dispatch(
                                  addTodo( this.state.text, this.image.files[0] )
                              );

                              this.image.value = null;
                              this.setState({ text: "" });
                          }}
                    >
                        <Row>
                            <Col
                                className="title"
                                lg={4} md={6} sm={6} xs={12}
                                lgOffset={4} mdOffset={3} smOffset={3}
                            >
                                Add Todo
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
                                    value={this.state.text}
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

                        <Col
                            className="submitButtonContainer"
                            lg={4} md={6} sm={6} xs={12}
                            lgOffset={4} mdOffset={3} smOffset={3}
                        >
                            <Button
                                type="submit"
                                variant="primary"
                            >
                                Submit
                            </Button>
                        </Col>
                    </form>
                </Container>
            </React.Fragment>
        )
    }
}

export default AddTodo;
