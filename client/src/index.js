import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

/*---- Polyfills -------------------------------------------------------------------*/
import "whatwg-fetch";
import "promise-polyfill/src/polyfill";
import setAsap from 'setasap';
/*-----------------------------------------------------------------------------------*/

import configureStore from "./store/configureStore";
import App from "./components/pages/app";

import "./index.css";

Promise._immediateFn = setAsap;

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
