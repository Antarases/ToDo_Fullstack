import React from "react";
import { Container } from "react-bootstrap";

import LoginForm from "../../commons/login-form";

import "./login-page.css";

class LoginPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <LoginForm />

                <Container as="section" className="heroText">
                    <h1>Login to create todos!</h1>
                </Container>
            </React.Fragment>
        );
    }
}

export default LoginPage;
