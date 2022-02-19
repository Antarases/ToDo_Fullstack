const mongoose = require("mongoose");
const helpers = require("../helpers/functions");

const Event = mongoose.model("events");
const User = mongoose.model("users");

class EventAPI {
    static eventReducer(event) {
        return event
            ? {
                id: event.id,
                title: event.title,
                description: event.description,
                image: event.image,
                participants: event._participants,
                startDate: event.startDate,
                endDate: event.endDate,
                creationDate: event.creationDate,
                updatingDate: event.updatingDate
            }
            : null;
    }

    async getEvents(cursor, limit) {
        cursor = helpers.decodeBase64ToString(cursor);
        limit = +limit;

        let events;
        if (limit > 0) {
            if (cursor) {
                events = await Event
                    .find(
                        { "startDate": { $gt: cursor }},
                        null,
                        {
                            sort: { startDate: "asc" },
                            limit
                        }
                    )
                    .populate({ path: "_participants", model: User })
                    .exec();
            } else {
                events = await Event
                    .find(
                        {},
                        null,
                        {
                            sort: { startDate: "asc" },
                            limit
                        }
                    )
                    .populate({ path: "_participants", model: User })
                    .exec();
            }

            events = Array.isArray(events)
                ? events.map(event => EventAPI.eventReducer(event))
                : [];
        } else {
            events = [];
        }

        return {
            data: events,
            paginationMetadata: {
                nextCursor: events.length
                    ? helpers.encodeStringToBase64(JSON.stringify(Number(events[events.length - 1].startDate)))
                    : null
            }
        };
    }

    async getEventsByUserId(userId, cursor, limit) {
        cursor = helpers.decodeBase64ToString(cursor);
        limit = +limit;

        let events;
        if (limit > 0) {
            if (cursor) {
                const eventsQueryResult = await User
                    .findById(
                        userId,
                        "_appliedEvents"
                    )
                    .populate({
                        path: "_appliedEvents",
                        model: Event,
                        // "match", "sort" and "limit" applies only to the Event model, not to the User model.
                        match: {
                            "startDate": { $gt: cursor }
                        },
                        options: {
                            sort: { startDate: "asc" },
                            limit
                        },
                        populate: { path: "_participants", model: User }
                    })
                    .exec();

                events = eventsQueryResult && eventsQueryResult._appliedEvents;
            } else {
                const eventsQueryResult = await User
                    .findById(
                        userId,
                        "_appliedEvents"
                    )
                    .populate({
                        path: "_appliedEvents",
                        model: Event,
                        options: {
                            sort: { startDate: "asc" },
                            limit
                        },
                        populate: { path: "_participants", model: User }
                    })
                    .exec();

                events = eventsQueryResult && eventsQueryResult._appliedEvents;
            }

            events = Array.isArray(events)
                ? events.map(event => EventAPI.eventReducer(event))
                : [];
        } else {
            events = [];
        }

        return {
            data: events,
            paginationMetadata: {
                nextCursor: events.length
                    ? helpers.encodeStringToBase64(JSON.stringify(Number(events[events.length - 1].startDate)))
                    : null
            }
        };
    }

    async getEventById(eventId) {
        const event = await Event.findById(eventId);

        return EventAPI.eventReducer(event);
    }

    async createEvent(title, description, image, startDate, endDate) {
        const event = await new Event({
            title,
            description,
            image,
            startDate,
            endDate
        })
        .save();

        return EventAPI.eventReducer(event);
    }

    async editEvent(eventId, title, description, image, startDate, endDate) {
        let editedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                title,
                description,
                image,
                startDate,
                endDate
            },
            {
                new: true,   //return the modified document rather than the original
            }
        )
        .populate({ path: "_participants", model: User })
        .exec();

        return EventAPI.eventReducer(editedEvent);
    }

    async deleteEventById(eventId) {
        let deletedEvent = await Event.findByIdAndDelete(eventId).exec();

        //TODO: Delete event from User's model "_appliedEvents" field

        return EventAPI.eventReducer(deletedEvent);
    }

    async applyToEvent(eventId, userId) {
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { _appliedEvents: eventId  }
            }
        )
        .exec();

        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                $addToSet: { _participants: userId  }
            },
            {
                new: true,
            }
        )
        .populate({ path: "_participants", model: User })
        .exec();

        return EventAPI.eventReducer(event);
    }

    async getTotalEventsAmount() {
        return await Event.countDocuments().exec();
    }

    async getTotalEventsAmountByUserId(userId) {
        const user = await User.findById(userId);

        return user._appliedEvents && user._appliedEvents.length;
    }
}

module.exports = EventAPI;
