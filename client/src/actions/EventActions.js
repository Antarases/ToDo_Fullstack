import apolloClient, { cache } from "../apolloClient";
import { gql } from "@apollo/client";

import {getCompressedBase64Image, isNewListRequestsAllowed} from "../helpers/functions";

import {showNotificationModal} from "./NotificationsModalActions";

import { FETCHED_EVENTS_LIMIT } from "../constants/events";

import {initialData} from "../schema";
import {GET_CURRENT_USER} from "../constants/graphqlQueries/users";

const EVENT_FIELDS_WITHOUT_IMAGE_FRAGMENT = gql`
    fragment EventFieldsWithoutImageFragment on Event {
        id
        title
        description
        startDate
        endDate
        participants {
            id
        }
        creationDate
        updatingDate
    }
`;

const EVENT_FIELDS_FRAGMENT = gql`
    fragment EventFieldsFragment on Event {
        ...EventFieldsWithoutImageFragment
        image
    }
    ${EVENT_FIELDS_WITHOUT_IMAGE_FRAGMENT}
`;

export const GET_EVENTS_FROM_CACHE = gql`
    query getEventsFromCache {
        events @client {
            ...EventFieldsFragment
        }
    }
    ${EVENT_FIELDS_FRAGMENT}
`;

const getEventsFromCache = async () => {
    const { events } = await cache.readQuery({
        query: GET_EVENTS_FROM_CACHE
    });

    return events;
};

const addEventsToEventList = (events) => {
    cache.updateQuery({
        query: GET_EVENTS_FROM_CACHE
    }, (data) => {
        return {
            events: [
                ...data?.events,
                ...events.map(event => ({
                    image: event.image || null,
                    ...event
                }))
            ]
        };
    });
};

const getTotalEventsAmount = async () => {
    const { data: totalEventsAmountData } = await apolloClient.query({
        query: gql`
            query GetTotalEventsAmount {
                totalEventsAmount
            }
        `,
        fetchPolicy: "no-cache"
    });

    return totalEventsAmountData?.totalEventsAmount ?? null;
};

const getEventsCursor = async () => {
    const { clientData } = await cache.readQuery({
        query: gql`
            query GetEventsCursor {
                clientData {
                    events {
                        eventsCursor
                    }
                }
            }
        `
    });

    return clientData.events.eventsCursor;
};

const setEventsCursor = (eventsCursor) => {
    cache.writeQuery({
        query: gql`
            query SetEventsCursor {
                clientData {
                    events {
                        eventsCursor
                        __typename
                    }
                    __typename
                }
            }
        `,
        data: {
            clientData: {
                events: {
                    eventsCursor,
                    __typename:"Events"
                },
                __typename: "ClientData"
            },
        }
    });
};

export const GET_IS_EVENT_LIST_LOADING = gql`
    query GetIsEventListLoading {
        clientData @client {
            events {
                isEventListLoading
            }
        }
    }
`;

export const getIsEventListLoading = async () => {
    const { clientData } = await cache.readQuery({
        query: GET_IS_EVENT_LIST_LOADING
    });

    return clientData.events.isEventListLoading;
};

const setIsEventListLoading = (isEventListLoading) => {
    cache.writeQuery({
        query: gql`
            query SetIsEventListLoading {
                clientData @client {
                    events {
                        isEventListLoading
                    }
                }
            }
        `,
        data: {
            clientData: {
                events: {
                    isEventListLoading,
                    __typename:"Events"
                },
                __typename: "ClientData"
            },
        }
    });
};

const getTimeOfEndingLoadingFullEventList = async () => {
    const { clientData } = await cache.readQuery({
        query: gql`
            query GetTimeOfEndingLoadingFullEventList {
                clientData @client {
                    events {
                        timeOfEndingLoadingFullEventList
                    }
                }
            }
        `
    });

    return clientData.events.timeOfEndingLoadingFullEventList;
};

const setTimeOfEndingLoadingFullEventList = (time) => {
    cache.writeQuery({
        query: gql`
            query SetTimeOfEndingLoadingFullEventList {
                clientData @client {
                    events {
                        timeOfEndingLoadingFullEventList
                    }
                }
            }
        `,
        data: {
            clientData: {
                events: {
                    timeOfEndingLoadingFullEventList: time,
                    __typename:"Events"
                },
                __typename: "ClientData"
            },
        }
    });
};

const getEventsImages = async (eventsCursor) => {
    const eventsData = await apolloClient.query({
        query: gql`
            query GetAllEvents($cursor: String!, $limit: Int!) {
                allEvents(cursor: $cursor, limit: $limit) @connection(key: "allEvents") {
                    data {
                        id
                        image
                    }
                }
            }
        `,
        variables: {
            cursor: eventsCursor,
            limit: FETCHED_EVENTS_LIMIT
        },
        fetchPolicy: "no-cache"
    });

    eventsData?.data?.allEvents?.data.forEach(event => {
        cache.updateFragment({
            id: "Event:" + event.id,
            fragment: gql`
                fragment EventImageFragment on Event {
                    id
                    image
                }
            `,
        }, (data) => ({
            ...data,
            image: event.image
        }));
    });
};

export const getEventList = async () => {
    try {
        const [
            currentEvents,
            eventsCursor,
            isEventListLoading,
            timeOfEndingLoadingFullEventList
        ] = await Promise.all([
            getEventsFromCache(),
            getEventsCursor(),
            getIsEventListLoading(),
            getTimeOfEndingLoadingFullEventList()
        ]);

        const currentEventsAmount = currentEvents.length;

        if (
            isNewListRequestsAllowed(isEventListLoading, timeOfEndingLoadingFullEventList)
        ) {
            setIsEventListLoading(true);

            const [
                events,
                totalEventsAmount
            ] = await Promise.all([
                async function() {
                    const { data: eventsData } = await apolloClient.query({
                        query: gql`
                            query GetAllEvents($cursor: String!, $limit: Int!) {
                                allEvents(cursor: $cursor, limit: $limit) @connection(key: "allEvents") {
                                    data {
                                        ...EventFieldsWithoutImageFragment
                                    }
                                    paginationMetadata {
                                        nextCursor
                                    }
                                }
                            }
                            ${EVENT_FIELDS_WITHOUT_IMAGE_FRAGMENT}
                        `,
                        variables: {
                            cursor: eventsCursor,
                            limit: FETCHED_EVENTS_LIMIT
                        },
                        fetchPolicy: "no-cache"
                    });

                    return eventsData?.allEvents || initialData.events;
                }(),
                getTotalEventsAmount()
            ]);

            const fetchedEventsAmount = events?.data?.length || 0;

            if (fetchedEventsAmount) {
                addEventsToEventList(events.data);
            }

            events.paginationMetadata.nextCursor
            && setEventsCursor(events.paginationMetadata.nextCursor);

            if ((currentEventsAmount + fetchedEventsAmount) >= totalEventsAmount) {
                setTimeOfEndingLoadingFullEventList(Date.now());
            }
            setIsEventListLoading(false);

            if (fetchedEventsAmount) {
                getEventsImages(eventsCursor);
            }
        }
    } catch (error) {
        console.error("An error occurred during getting event list.", error);

        showNotificationModal({
            body: "An error occurred during getting event list. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};

export const createEvent = async ({ title, description, image, startDate, endDate }) => {
    try {
        const compressedImageBase64 = !!image
            ? await getCompressedBase64Image(image, 700)
            : null;

        const { data: currentUserData } = await apolloClient.query({
            query: GET_CURRENT_USER
        });

        const currentUserId = currentUserData?.currentUser?.id;

        if (currentUserId) {
            await apolloClient.mutate({
                mutation: gql`
                    mutation CreateEvent($title: String!, $description: String, $image: String, $startDate: Date!, $endDate: Date!) {
                         createEvent(title: $title, description: $description, image: $image, startDate: $startDate, endDate: $endDate) {
                            ...EventFieldsFragment
                         }
                    }
                    ${EVENT_FIELDS_FRAGMENT}
                `,
                variables: {
                    title,
                    description,
                    image: compressedImageBase64,
                    startDate,
                    endDate
                }
            });

            showNotificationModal({
                header: null,
                body: "Event has been created",
                buttons: [{ text: "OK" }],
                onClose: null,
                showSuccessIcon: true,
                closeOnBackdropClick: true
            });
        }
    } catch (error) {
        console.error(error);

        showNotificationModal({
            body: "An error occurred during event creation. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};

/*-----------------------------------------------------*/

export const GET_APPLIED_EVENTS_FROM_CACHE = gql`
    query getAppliedEventsFromCache {
        appliedEvents @client {
            ...EventFieldsFragment
        }
    }
    ${EVENT_FIELDS_FRAGMENT}
`;

const getAppliedEventsFromCache = async () => {
    const { appliedEvents } = await cache.readQuery({
        query: GET_APPLIED_EVENTS_FROM_CACHE
    });

    return appliedEvents;
};

const addEventsToAppliedEventList = (appliedEvents) => {
    cache.updateQuery({
        query: GET_APPLIED_EVENTS_FROM_CACHE
    }, (data) => {
        return {
            appliedEvents: [
                ...data?.appliedEvents,
                ...appliedEvents.map(appliedEvent => ({
                    image: appliedEvent.image || null,
                    ...appliedEvent
                }))
            ]
        };
    });
};

const getTotalAppliedEventsAmount = async () => {
    const { data: totalAppliedEventsAmountData } = await apolloClient.query({
        query: gql`
            query GetTotalAppliedEventsAmount {
                totalAppliedEventsAmount
            }
        `,
        fetchPolicy: "no-cache"
    });

    return totalAppliedEventsAmountData?.totalAppliedEventsAmount ?? null;
};

const getAppliedEventsCursor = async () => {
    const { clientData } = await cache.readQuery({
        query: gql`
            query GetAppliedEventsCursor {
                clientData {
                    events {
                        appliedEventsCursor
                    }
                }
            }
        `
    });

    return clientData.events.appliedEventsCursor;
};

const setAppliedEventsCursor = (appliedEventsCursor) => {
    cache.writeQuery({
        query: gql`
            query SetAppliedEventsCursor {
                clientData {
                    events {
                        appliedEventsCursor
                        __typename
                    }
                    __typename
                }
            }
        `,
        data: {
            clientData: {
                events: {
                    appliedEventsCursor,
                    __typename:"Events"
                },
                __typename: "ClientData"
            },
        }
    });
};

export const GET_IS_APPLIED_EVENT_LIST_LOADING = gql`
    query GetIsAppliedEventListLoading {
        clientData @client {
            events {
                isAppliedEventListLoading
            }
        }
    }
`;

export const getIsAppliedEventListLoading = async () => {
    const { clientData } = await cache.readQuery({
        query: GET_IS_APPLIED_EVENT_LIST_LOADING
    });

    return clientData.events.isAppliedEventListLoading;
};

const setIsAppliedEventListLoading = (isAppliedEventListLoading) => {
    cache.writeQuery({
        query: gql`
            query SetIsAppliedEventListLoading {
                clientData @client {
                    events {
                        isAppliedEventListLoading
                    }
                }
            }
        `,
        data: {
            clientData: {
                events: {
                    isAppliedEventListLoading,
                    __typename:"Events"
                },
                __typename: "ClientData"
            },
        }
    });
};

const getTimeOfEndingLoadingFullAppliedEventList = async () => {
    const { clientData } = await cache.readQuery({
        query: gql`
            query GetTimeOfEndingLoadingFullAppliedEventList {
                clientData @client {
                    events {
                        timeOfEndingLoadingFullAppliedEventList
                    }
                }
            }
        `
    });

    return clientData.events.timeOfEndingLoadingFullAppliedEventList;
};

const setTimeOfEndingLoadingFullAppliedEventList = (time) => {
    cache.writeQuery({
        query: gql`
            query SetTimeOfEndingLoadingFullAppliedEventList {
                clientData @client {
                    events {
                        timeOfEndingLoadingFullAppliedEventList
                    }
                }
            }
        `,
        data: {
            clientData: {
                events: {
                    timeOfEndingLoadingFullAppliedEventList: time,
                    __typename:"Events"
                },
                __typename: "ClientData"
            },
        }
    });
};

const getAppliedEventImages = async (appliedEventsCursor) => {
    const appliedEventsData = await apolloClient.query({
        query: gql`
            query GetAppliedEvents($cursor: String!, $limit: Int!) {
                appliedEvents(cursor: $cursor, limit: $limit) @connection(key: "appliedEvents") {
                    data {
                        id
                        image
                    }
                }
            }
        `,
        variables: {
            cursor: appliedEventsCursor,
            limit: FETCHED_EVENTS_LIMIT
        },
        fetchPolicy: "no-cache"
    });

    appliedEventsData?.data?.appliedEvents?.data.forEach(appliedEvent => {
        cache.updateFragment({
            id: "Event:" + appliedEvent.id,
            fragment: gql`
                fragment AppliedEventImageFragment on Event {
                    id
                    image
                }
            `,
        }, (data) => ({
            ...data,
            image: appliedEvent.image
        }));
    });
};

export const getAppliedEventList = async () => {
    try {
        const [
            currentAppliedEvents,
            appliedEventsCursor,
            isAppliedEventListLoading,
            timeOfEndingLoadingFullAppliedEventList
        ] = await Promise.all([
            getAppliedEventsFromCache(),
            getAppliedEventsCursor(),
            getIsAppliedEventListLoading(),
            getTimeOfEndingLoadingFullAppliedEventList()
        ]);

        const currentAppliedEventsAmount = currentAppliedEvents.length;

        if (
            isNewListRequestsAllowed(isAppliedEventListLoading, timeOfEndingLoadingFullAppliedEventList)
        ) {
            setIsAppliedEventListLoading(true);

            const [
                appliedEvents,
                totalAppliedEventsAmount
            ] = await Promise.all([
                async function() {
                    const { data: appliedEventsData } = await apolloClient.query({
                        query: gql`
                            query GetAppliedEvents($cursor: String!, $limit: Int!) {
                                appliedEvents(cursor: $cursor, limit: $limit) @connection(key: "appliedEvents") {
                                    data {
                                        ...EventFieldsWithoutImageFragment
                                    }
                                    paginationMetadata {
                                        nextCursor
                                    }
                                }
                            }
                            ${EVENT_FIELDS_WITHOUT_IMAGE_FRAGMENT}
                        `,
                        variables: {
                            cursor: appliedEventsCursor,
                            limit: FETCHED_EVENTS_LIMIT
                        },
                        fetchPolicy: "no-cache"
                    });

                    return appliedEventsData?.appliedEvents || initialData.appliedEvents;
                }(),
                getTotalAppliedEventsAmount()
            ]);

            const fetchedAppliedEventsAmount = appliedEvents?.data?.length || 0;

            if (fetchedAppliedEventsAmount) {
                addEventsToAppliedEventList(appliedEvents.data);
            }

            appliedEvents.paginationMetadata.nextCursor
            && setAppliedEventsCursor(appliedEvents.paginationMetadata.nextCursor);

            if ((currentAppliedEventsAmount + fetchedAppliedEventsAmount) >= totalAppliedEventsAmount) {
                setTimeOfEndingLoadingFullAppliedEventList(Date.now());
            }
            setIsAppliedEventListLoading(false);

            if (fetchedAppliedEventsAmount) {
                getAppliedEventImages(appliedEventsCursor);
            }
        }
    } catch (error) {
        console.error("An error occurred during getting applied event list.", error);

        showNotificationModal({
            body: "An error occurred during getting applied event list. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
};

export const applyToEvent = async (eventId) => {
    try {
        const { data: currentUserData } = await apolloClient.query({
            query: GET_CURRENT_USER
        });

        const currentUserId = currentUserData?.currentUser?.id;

        if (currentUserId) {
            const { data: appliedEventData } = await apolloClient.mutate({
                mutation: gql`
                    mutation ApplyToEvent($eventId: String!, $userId: String!) {
                         applyToEvent(eventId: $eventId, userId: $userId) {
                            ...EventFieldsFragment
                         }
                    }
                    ${EVENT_FIELDS_FRAGMENT}
                `,
                variables: {
                    eventId,
                    userId: currentUserId
                }
            });

            const appliedEvent = appliedEventData?.applyToEvent;

            if (appliedEvent) {
                //Add appliedEvent to appliedEvents array, to the proper place based on start date, if appliedEvent start date is less than the start date of the last event in the list
                //Otherwise, if the event start date is > of the last event in the list, it will be loaded later during page update(with useQuery or during getting items upon scroll)
                cache.updateQuery({
                    query: GET_APPLIED_EVENTS_FROM_CACHE
                }, (data) => {
                    const newAppliedEvents = [];

                    data.appliedEvents.forEach((currentAppliedEvent, i, arr) => {
                        if (
                            (i < (arr.length - 1))
                            && (appliedEvent.startDate > currentAppliedEvent.startDate)
                            && (appliedEvent.startDate < arr[i+1].startDate)
                        ) {
                            newAppliedEvents.push(
                                currentAppliedEvent,
                                appliedEvent
                            );
                        } else if (
                            (i === 0)
                            && (appliedEvent.startDate < currentAppliedEvent.startDate)
                        ) {
                            newAppliedEvents.push(
                                appliedEvent,
                                currentAppliedEvent
                            );
                        } else {
                            newAppliedEvents.push(currentAppliedEvent);
                        }
                    });

                    return {
                        appliedEvents: newAppliedEvents
                    };
                });
            }

            showNotificationModal({
                header: null,
                body: "You have been applied to event",
                buttons: [{ text: "OK" }],
                onClose: null,
                showSuccessIcon: true,
                closeOnBackdropClick: true
            });
        }
    } catch (error) {
        console.error(error);

        showNotificationModal({
            body: "An error occurred during applying to event. " + error,
            buttons: [{ text: "OK" }],
            showFailIcon: true
        });
    }
}
