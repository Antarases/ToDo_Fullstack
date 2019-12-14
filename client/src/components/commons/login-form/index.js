import React from "react";
import { connect } from "react-redux";
import PropTypes  from "prop-types";

import { Container, Col } from "reactstrap";

import styles from "./login-form.module.scss";

class LoginForm extends React.Component{
    render(){
        const { isUserLoggedIn } = this.props;

        return (
            <Container  tag="section" className={styles.loginForm}>
                { !isUserLoggedIn && <Col>
                    <a href="/auth/google">Login with Google</a>
                </Col> }

                { isUserLoggedIn && <Col>
                    <a href="/api/logout">Logout</a>
                </Col> }
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.app.currentUserStatus.isLoggedIn
    }
};

export default connect(mapStateToProps)(LoginForm);

LoginForm.propTypes = {
    isUserLoggedIn: PropTypes.bool
};
