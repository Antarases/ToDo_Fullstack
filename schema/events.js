const { assertAuthenticated, assertIsAdmin }  = require("../helpers/assertFunctions");

const typeDefs = `
    extend type Query {
        allEvents(cursor: String!, limit: Int!): EventsConnection!
        appliedEvents(cursor: String!, limit: Int!): EventsConnection!
        event(eventId: String!): Event
        totalEventsAmount: Int
        totalAppliedEventsAmount: Int
    }
    
    extend type Mutation {
        createEvent(title: String!, description: String, image: String, startDate: Date!, endDate: Date!): Event!
        editEvent(eventId: String!, title: String!, description: String, image: String, startDate: Date!, endDate: Date!): Event!
        deleteEvent(eventId: String!): Event!
        applyToEvent(eventId: String!, userId: String!): Event!
    }
    
    type Event {
        id: String!
        title: String!
        description: String
        image: String
        participants: [User!]
        startDate: Date!
        endDate: Date!
        creationDate: Date
        updatingDate: Date
    }
    
    type EventsConnection {
        data: [Event!]
        paginationMetadata: PaginationMetadata
    }
    
    extend type User {
        appliedEvents(cursor: String!, limit: Int!): EventsConnection!
    }
`;

module.exports.typeDefs = typeDefs;

const resolvers = {
    Query: {
        allEvents: (parent, { cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.getEvents(cursor, limit);
        },
        appliedEvents: (parent, { cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.getEventsByUserId(currentUser.id, cursor, limit)
        },
        event: (parent, { eventId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.getEventById(eventId);
        },
        totalEventsAmount: (parent, args, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.getTotalEventsAmount();
        },
        totalAppliedEventsAmount: (parent, { userId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.getTotalEventsAmountByUserId(currentUser.id);
        },
    },
    Mutation: {
        createEvent: (parent, { title, description, image, startDate, endDate }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertIsAdmin(currentUser);

            return dataSources.eventAPI.createEvent(title, description, image, startDate, endDate);
        },
        editEvent: (parent, { eventId, title, description, image, startDate, endDate }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertIsAdmin(currentUser);

            return dataSources.eventAPI.editEvent(eventId, title, description, image, startDate, endDate);
        },
        deleteEvent: (parent, { eventId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);
            assertIsAdmin(currentUser);

            return dataSources.eventAPI.deleteEventById(eventId);
        },
        applyToEvent: (parent, { eventId }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.applyToEvent(eventId, currentUser.id);
        },
    },
    User: {
        appliedEvents: (parent, { cursor, limit }, { dataSources, currentUser }) => {
            assertAuthenticated(currentUser);

            return dataSources.eventAPI.getEventsByUserId(currentUser.id, cursor, limit)
        },
    }
};

module.exports.resolvers = resolvers;
