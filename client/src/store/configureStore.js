import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";

const middlewares = [];
if (process.env.NODE_ENV !== "production") {
    const { logger } = require("redux-logger");
    middlewares.push(logger);
}

let currentStore;

export default function configureStore(initialState) {
    const store =  createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middlewares)
    );

    currentStore = store;
    return store;
}

export function dispatch () {
    return currentStore.dispatch.apply(currentStore, arguments);
}

export function getCurrentState () {
    return currentStore.getState();
}
