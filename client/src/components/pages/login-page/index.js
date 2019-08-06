import React from "react";

import LoginForm from "../../commons/login-form";

class LoginPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <LoginForm />

                Login to create todos!
            </React.Fragment>
        );
    }
}

export default LoginPage;
