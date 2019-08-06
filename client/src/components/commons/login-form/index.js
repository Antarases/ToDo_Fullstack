import React from "react";

import { Grid, Col } from "react-bootstrap";

import "./login-form.component.css";

class LoginForm extends React.Component{
    render(){
        return (
            <Grid  componentClass="section" id="login-form">
                <Col>
                    <a href="/auth/google">Login with Google</a>
                </Col>

                <Col>
                    <a href="/api/logout">Logout</a>
                </Col>
            </Grid>
        );
    }
}

export default LoginForm;
