import { combineReducers } from "redux";

import app from "./app";
import todos from "./todos";
import todosPagination from "./todosPagination";
import todosSortParams from "./todosSortParams";
import chats from "./chats";

const rootReducer = combineReducers({
    app,
    todos,
    todosPagination,
    todosSortParams,
    chats
});

export default rootReducer;
