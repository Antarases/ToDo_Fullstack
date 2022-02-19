import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import apolloClient from "./apolloClient";

import App from "./components/pages/app";

import "./index.css";

/*---- Polyfills -------------------------------------------------------------------*/
import "whatwg-fetch";
import "promise-polyfill/src/polyfill";
import setAsap from 'setasap';
/*-----------------------------------------------------------------------------------*/

Promise._immediateFn = setAsap;

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <LocalizationProvider dateAdapter={DateAdapter} injectFirst>
            <App/>
        </LocalizationProvider>
    </ApolloProvider>,
    document.getElementById("root")
);
