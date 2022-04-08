import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";

import SuspenseFallback from "../../commons/suspense-fallback";
const Menu = lazy(() => import("../../commons/menu"));
const NotificationsModal = lazy(() => import("../../commons/notifications-modal"));
const LoginPage = lazy(() => import("../login-page/index"));
const TodosPage = lazy(() => import("../todos-page/index"));
const ChatsPage = lazy(() => import("../chats-page/index"));
const EventsPage = lazy(() => import("../events-page/index"));

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
                            <SuspenseFallback />
                        )
                        : (
                            (currentUserData && currentUserData.currentUser)
                                ? (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <Menu />

                                        <div className={styles.pageWrapper}>
                                            <Suspense fallback={<SuspenseFallback />}>
                                                <Switch>
                                                    <Route exact path="/" component={TodosPage} />
                                                    <Route exact path="/messages" component={ChatsPage} />
                                                    <Route exact path="/events" component={EventsPage} />

                                                    <Redirect to="/" />
                                                </Switch>
                                            </Suspense>
                                        </div>

                                        <NotificationsModal/>
                                    </Suspense>
                                )
                                : (
                                    <Suspense fallback={<SuspenseFallback />}>
                                        <LoginPage />
                                    </Suspense>
                                )
                        )
                }
            </BrowserRouter>
        </div>
    );
};

export default App;
