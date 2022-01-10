import React  from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Menu from "../../commons/menu";
import NotificationsModal from "../../commons/notifications-modal";
import LoginPage from "../login-page/index";
import TodosPage from "../todos-page/index";
import ChatsPage from "../chats-page/index";

import { GET_CURRENT_USER } from "../../../constants/graphqlQueries/users";

import styles from "./app.module.scss";

const App = () => {
    const { data: currentUserData, loading: isCurrentUserDataLoading } = useQuery(GET_CURRENT_USER);

    return (
        <div className={styles.todoApp}>
            <BrowserRouter>
                {
                    isCurrentUserDataLoading
                        ? (
                            <div>Loading...</div>
                        )
                        : (
                            (currentUserData && currentUserData.currentUser)
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

                                        <NotificationsModal/>
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
};

export default App;
