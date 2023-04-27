import { postRequest } from "./apiService";
import { SLACK_URL } from "../actions/types";
import sha256 from "crypto-js/sha256";
import hmacSHA512  from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";

export const reportError = (error, additionalInfo) => {
    const errorReport = {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timeStamp: new Date().toISOString(),
        additionalInfo: additionalInfo
    };

    const errorReportJson = JSON.stringify(errorReport);
    // const errorReportUrl = `${host}/api/v1/error-report`;
    // const errorReportHeaders = new Headers();
    // errorReportHeaders.append('Content-Type', 'application/json');
    // errorReportHeaders.append('Accept', 'application/json');
    // errorReportHeaders.append('Authorization', `Bearer ${getToken()}`);
    // const errorReportOptions = {
    //     method: 'POST',
    //     headers: errorReportHeaders,
    //     body: errorReportJson
    // };

    // postRequest(errorReportUrl, errorReportOptions);

    // Report error to Slack
    const slackHeaders = new Headers();
    slackHeaders.append('Content-Type', 'application/json');
    slackHeaders.append('Accept', 'application/json');
    // slackHeaders.append('Authorization', `Bearer ${getToken()}`);
    const slackOptions = {
        method: 'POST',
        headers: slackHeaders,
        body: errorReportJson
    };

    postRequest(SLACK_URL, slackOptions);

    return Promise.reject(error);
}