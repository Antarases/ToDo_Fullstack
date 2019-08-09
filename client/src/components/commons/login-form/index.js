import React from "react";

import { Container, Col } from "react-bootstrap";

import "./login-form.component.css";

class LoginForm extends React.Component{
    render(){
        return (
            <Container  as="section" id="login-form">
                <Col>
                    <a href="/auth/google">Login with Google</a>
                </Col>

                <Col>
                    <a href="/api/logout">Logout</a>
                </Col>
            </Container>
        );
    }
}

export default LoginForm;
