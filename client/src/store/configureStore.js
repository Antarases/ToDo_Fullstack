import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";

const loggerMiddleware = createLogger();

let currentStore;

export default function configureStore(initialState) {
    const store =  createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
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
