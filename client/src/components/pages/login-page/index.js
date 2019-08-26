import React from "react";
import { Container } from "react-bootstrap";

import LoginForm from "../../commons/login-form";

import styles from "./loginPage.module.scss";

class LoginPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <LoginForm />

                <Container as="section" className={styles.heroText}>
                    <h1>Login to create todos!</h1>
                </Container>
            </React.Fragment>
        );
    }
}

export default LoginPage;
