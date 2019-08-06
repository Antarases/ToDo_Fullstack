import React from 'react';
import { connect } from 'react-redux';

import TodosPage from "../todos-page/index";
import LoginPage from "../login-page/index";

import "./todo-app.component.css";

import { identifyCurrentUser, apiQWE } from "../../../actions/AppActions";

class App extends React.Component{
    componentDidMount() {
        this.props.identifyCurrentUser();
    }

    render() {
        const { isUserLoggedIn, isUserLoginStatusDetermining } = this.props;

        let renderedContent = null;
        if (isUserLoginStatusDetermining) {
            renderedContent = <div>Loading...</div>;
        } else if (isUserLoggedIn) {
            renderedContent = <TodosPage />;
        } else if (!isUserLoggedIn) {
            renderedContent = <LoginPage />;
        }

        return (
            <div id="todo-app">
                { renderedContent }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isUserLoginStatusDetermining: state.app.isUserLoginStatusDetermining,
        isUserLoggedIn: state.app.currentUserStatus.isLoggedIn,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        identifyCurrentUser: () => {
            dispatch(identifyCurrentUser());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
