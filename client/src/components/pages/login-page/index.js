import React from "react";
import { Container } from "reactstrap";

import LoginForm from "../../commons/login-form";

import styles from "./login-page.module.scss";

class LoginPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <LoginForm loginFormClassName={styles.loginForm} />

                <Container tag="section" className={styles.heroText}>
                    <h1>Login to create todos!</h1>
                </Container>
            </React.Fragment>
        );
    }
}

export default LoginPage;
