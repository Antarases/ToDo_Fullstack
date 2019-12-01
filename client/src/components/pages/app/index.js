import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import Menu from "../../commons/menu";
import LoginPage from "../login-page/index";
import TodosPage from "../todos-page/index";
import ChatsPage from "../chats-page/index";

import styles from "./todoApp.module.scss";

import { identifyCurrentUser } from "../../../actions/AppActions";

class App extends React.Component{
    componentDidMount() {
        identifyCurrentUser();
    }

    render() {
        const { isUserLoggedIn, isUserLoginStatusDetermining } = this.props;

        return (
            <div className={styles.todoApp}>
                <BrowserRouter>
                    {
                        isUserLoginStatusDetermining
                            ? (
                                <div>Loading...</div>
                            )
                            : (
                                isUserLoggedIn
                                ? (
                                    <React.Fragment>
                                        <Menu />

                                        <div className={styles.pageWrapper}>
                                            <Switch>
                                                <Route exact path="/" component={TodosPage} />
                                                <Route exact path="/messages" component={ChatsPage} />

                                                <Redirect to="/" />
                                            </Switch>
                                        </div>
                                    </React.Fragment>
                                )
                                : (
                                    <LoginPage />
                                )
                            )
                    }
                </BrowserRouter>
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
