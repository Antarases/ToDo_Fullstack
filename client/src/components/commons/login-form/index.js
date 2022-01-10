import React from "react";
import { useQuery } from "@apollo/client";
import PropTypes  from "prop-types";
import classnames from "classnames";

import { Container, Col } from "reactstrap";

import { resetStore } from "../../../actions/AppActions";

import { GET_CURRENT_USER } from "../../../constants/graphqlQueries/users";

import styles from "./login-form.module.scss";

const LoginForm = ({ loginFormClassName }) => {
    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const isUserLoggedIn = (currentUserData && currentUserData.currentUser);

    return (
        <Container  tag="section" className={classnames(styles.loginForm, loginFormClassName)}>
            { !isUserLoggedIn && <Col>
                <a href="/auth/google">Login with Google</a>
            </Col> }

            { isUserLoggedIn && <Col>
                <a href="/api/logout" onClick={resetStore}>
                    Logout
                </a>
            </Col> }
        </Container>
    );
};

export default LoginForm;

LoginForm.propTypes = {
    loginFormClassName: PropTypes.string
};
