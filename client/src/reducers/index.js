import { combineReducers } from "redux";

import app from "./app";
import todos from "./todos";
import todosPagination from "./todosPagination";
import todosSortParams from "./todosSortParams";

const rootReducer = combineReducers({
    app,
    todos,
    todosPagination,
    todosSortParams
});

export default rootReducer;
