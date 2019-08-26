import React from 'react';
import { connect } from 'react-redux';
import { dispatch } from "../../../store/configureStore";

import TodosPage from "../todos-page/index";
import LoginPage from "../login-page/index";

import styles from "./todoApp.module.scss";

import { identifyCurrentUser } from "../../../actions/AppActions";

class App extends React.Component{
    componentDidMount() {
        dispatch(
            identifyCurrentUser()
        );
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
            <div className={styles.todoApp}>
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

export default connect(mapStateToProps)(App);
