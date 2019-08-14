import React from "react";
import { connect } from "react-redux";
import PropTypes  from "prop-types";

import { Container, Col } from "react-bootstrap";

import "./login-form.component.css";

class LoginForm extends React.Component{
    render(){
        const { isUserLoggedIn } = this.props;

        return (
            <Container  as="section" id="login-form">
                { !isUserLoggedIn && <Col>
                    <a href="/auth/google">Login with Google</a>
                </Col> }

                <Col>
                    <a href="/api/logout">Logout</a>
                </Col>
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
