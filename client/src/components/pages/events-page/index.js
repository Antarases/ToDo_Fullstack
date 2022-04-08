import React, { lazy, useState } from "react";
import { useQuery } from "@apollo/client";
import classnames from "classnames";

import { Container, Row, Col } from "reactstrap";

import EventList from "../../groups/events/event-list";
const CreateEventForm = lazy(() => import("../../groups/events/create-event-form"));

import { getEventList, getAppliedEventList, GET_EVENTS_FROM_CACHE, GET_APPLIED_EVENTS_FROM_CACHE, GET_IS_EVENT_LIST_LOADING, GET_IS_APPLIED_EVENT_LIST_LOADING } from "../../../actions/EventActions";

import {GET_CURRENT_USER} from "../../../constants/graphqlQueries/users";

import styles from "./events-page.module.scss";

const EventsPage = () => {
    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const isCurrentUserAdmin = currentUserData.currentUser.isAdmin;

    const [selectedTab, setSelectedTab] = useState("eventList");

    const tabs = [
        {
            name: "eventList",
            text: "Events",
        },
        {
            name: "appliedEventList",
            text: "Applied Events",
        },
        {
            name: "createEventForm",
            text: "Create Event",
            showOnlyForAdmins: true
        }
    ];

    return (
        <section className={styles.eventsPage}>
            <Container>
                <Row>
                    <Col>
                        <section className={styles.tabs}>
                            {
                                tabs.map(tab => {
                                    if (tab.showOnlyForAdmins && !isCurrentUserAdmin) {
                                        return null;
                                    } else {
                                        return <span
                                            className={classnames(styles.tab, {[styles.selectedTab]: tab.name === selectedTab})}
                                            key={tab.name}
                                            onClick={() => setSelectedTab(tab.name)}
                                        >
                                                { tab.text }
                                            </span>;
                                    }
                                })
                            }
                        </section>
                    </Col>
                </Row>
            </Container>

            {
                (selectedTab === "eventList")
                && <EventList
                    title="Event List"
                    getEvents={getEventList}
                    getEventsFromCache_GqlQuery={GET_EVENTS_FROM_CACHE}
                    getIsEventListLoading_GqlQuery={GET_IS_EVENT_LIST_LOADING}
                    queriedItemsFieldName="events"
                    queriedIsItemsLoadingFieldName="isEventListLoading"
                    showApplyButtonAndAppliedText
                />
            }
            {
                (selectedTab === "appliedEventList")
                && <EventList
                    title="Applied Event List"
                    getEvents={getAppliedEventList}
                    getEventsFromCache_GqlQuery={GET_APPLIED_EVENTS_FROM_CACHE}
                    getIsEventListLoading_GqlQuery={GET_IS_APPLIED_EVENT_LIST_LOADING}
                    queriedItemsFieldName="appliedEvents"
                    queriedIsItemsLoadingFieldName="isAppliedEventListLoading"
                />
            }
            {
                (isCurrentUserAdmin && selectedTab === "createEventForm")
                && <CreateEventForm />
            }
        </section>
    );
};

export default EventsPage;
