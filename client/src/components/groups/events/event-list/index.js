import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import moment from "moment";
import classnames from "classnames";

import { Container, Row, Col } from "reactstrap";
import Button from '@mui/material/Button';

import ScrolledContainer from "../../../commons/scrolled-container";

import Icons from "../../../../icons";

import { applyToEvent } from "../../../../actions/EventActions";

import { DATE_TIME_INPUT_FORMAT } from "../../../../constants/app";
import {GET_CURRENT_USER} from "../../../../constants/graphqlQueries/users";

import styles from "./event-list.module.scss";

const EventList = ({ title, getEvents, getEventsFromCache_GqlQuery, getIsEventListLoading_GqlQuery, queriedItemsFieldName, queriedIsItemsLoadingFieldName, showApplyButtonAndAppliedText }) => {
    useEffect(() => {
        getEvents();
    }, []);

    const { data: eventsData } = useQuery(getEventsFromCache_GqlQuery);
    const events = eventsData[queriedItemsFieldName];

    const { data: isLoadingData } = useQuery(getIsEventListLoading_GqlQuery);
    const isEventsLoading = isLoadingData.clientData.events[queriedIsItemsLoadingFieldName];

    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const currentUserId = currentUserData?.currentUser?.id;

    return (
        <Container tag="section" className={styles.eventList}>
            <Row>
                <Col className={styles.title}>
                    { title }
                </Col>
            </Row>

            <section className={styles.eventsContainer}>
                {
                    Boolean(events?.length)
                    && <ScrolledContainer
                        className={styles.scrolledContainer}
                        contentContainerClassName={styles.contentContainer}
                        trackVerticalClassName={styles.trackVertical}
                        thumbVerticalClassName={styles.thumbVertical}
                        itemsAmount={events?.length || 0}
                        getMoreItems={getEvents}
                    >
                        {
                            events.map(event => (
                                <section
                                    className={styles.event}
                                    key={event.id}
                                    style={{
                                        background: event.image
                                            ? `url(${event.image})`
                                            : "grey"
                                    }}
                                >
                                    <div className={styles.title}>{event.title}</div>

                                    <div className={styles.description}>{event.description}</div>

                                    <div className={styles.datesContainer}>
                                        <div className={classnames(styles.dateContainer, styles.startDate)}>
                                            <div className={styles.dateTitle}>Start date:</div>
                                            <div className={styles.date}>{moment(event.startDate).format(DATE_TIME_INPUT_FORMAT)}</div>
                                        </div>

                                        <div className={styles.dateContainer}>
                                            <div className={styles.dateTitle}>End date:</div>
                                            <div className={styles.date}>{moment(event.endDate).format(DATE_TIME_INPUT_FORMAT)}</div>
                                        </div>
                                    </div>

                                    {
                                        showApplyButtonAndAppliedText
                                        && <React.Fragment>
                                            {
                                                (event.participants.some(participant =>
                                                    participant.id === currentUserId
                                                ))
                                                    ? <div className={styles.appliedContainer}>
                                                        <img className={styles.icon} src={Icons.SuccessCheck} alt="" />
                                                        Applied
                                                    </div>
                                                    : <Button
                                                        className={styles.applyButton}
                                                        variant="contained"
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => applyToEvent(event.id)}
                                                    >
                                                        Apply
                                                    </Button>
                                            }
                                        </React.Fragment>
                                    }

                                    <div className={styles.backdrop}></div>
                                </section>
                            ))
                        }
                    </ScrolledContainer>
                }

                {
                    (isEventsLoading && !events.length)
                    && <div className={styles.isLoading}>Events are being loaded...</div>
                }

                {
                    (!isEventsLoading && !events.length)
                    && <div className={styles.noEventsText}>There are no events yet</div>
                }
            </section>
        </Container>
    );
};

export default EventList;

EventList.propTypes = {
    title: PropTypes.string,
    getEvents: PropTypes.func,
    getEventsFromCache_GqlQuery: PropTypes.object,
    getIsEventListLoading_GqlQuery: PropTypes.object,
    queriedItemsFieldName: PropTypes.string,
    queriedIsItemsLoadingFieldName: PropTypes.string,
    showApplyButtonAndAppliedText: PropTypes.bool
}
