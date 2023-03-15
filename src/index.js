/** @format */

import * as React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import {I18nextProvider} from "react-i18next";
import enGB from 'rsuite/locales/en_GB';
import FR from 'assets/i18n/rsuite/translations/fr';
import i18n from "./i18n";
import en from 'date-fns/locale/en-GB';
import fr from 'date-fns/locale/fr';
import { CustomProvider } from 'rsuite';
import {getLanguage} from "utils/localStorage";
Sentry.init({
    // eslint-disable-next-line max-len
    dsn: "https://2cf1804ea61b42fb93c82bbd4adad5ff@o526763.ingest.sentry.io/5651671",
    environment: process.env.REACT_APP_ENV,
    tracesSampleRate: 0.2,
});

let lng = getLanguage() === 'fre' ? fr : en

document.addEventListener( 'DOMContentLoaded', function () {
    var element = document.getElementById( 'root' );
    if ( typeof element !== 'undefined' && element !== null ) {
        ReactDOM.render(
            <HashRouter>
                <I18nextProvider i18n={i18n}>
                    <CustomProvider locale={lng === 'fre' ? FR : enGB}>
                        <App />
                    </CustomProvider>
                </I18nextProvider>
            </HashRouter>,
            document.getElementById("root") || document.createElement('div')
        )
    }
} )


