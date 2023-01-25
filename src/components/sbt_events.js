import React from "react";
import Steps, { Step } from "rc-steps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "rc-steps/assets/index.css";

import {
    faCheckCircle,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const TransactionEvents = ({ events, setAttempt, setError, setTime }) => {
    const { attempt, error, time, evts } = groupArray(events);
    setAttempt(attempt);
    setError(error);
    setTime(time);
    return (
        <div>
            <div className="pt-3" style={{ margin: "-5px" }}>
                <Steps size="small" current={100} direction="vertical">
                    {evts.map((evt, i) => {
                        return (
                            <Step
                                className={`pl-1 ${evts[
                                    i < evts.length - 1 ? i + 1 : 0
                                ][0].actionPerformed.indexOf("Success") > -1
                                    ? "success-trail"
                                    : evts[
                                        i < evts.length - 1 ? i + 1 : 0
                                    ][0].actionPerformed.indexOf("Error") > -1
                                        ? "fail-trail"
                                        : "primary-trail"
                                    }`

                                }
                                icon={
                                    evt[0].actionPerformed.indexOf("Success") > -1 ? (
                                        <FontAwesomeIcon icon={faCheckCircle}  style={{color:'green !important'}}/>
                                    ) : evt[0].actionPerformed.indexOf("Error") > -1 ? (
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            className="failed"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faCheckCircle} className="primary" />
                                    )
                                }
                                description={
                                    <div className="font-10 step-body">
                                        {evt.map((val, i) => {
                                            return (
                                                <div>
                                                    <span>{moment(val.time).format("hh:mm")}</span>
                                                    {val.actionPerformed}
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                            />
                        );
                    })}
                </Steps>
            </div>
        </div>
    );
};
const timeInMinutes = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
};
const groupArray = (data, attempt = 0, error = 0) => {
    const lead = [
        "Init",
        "Attempt to pay",
        "Error",
        "Select payment type",
        "Success",
    ];
    let grouped = Array();
    let subGroup = Array();
    let time = timeSpent(data);

    data.forEach((evt, i) => {
        const action = evt.actionPerformed.split(":")[0];
        if (data.length - 1 === i) {
            if (lead.indexOf(action) > -1 && subGroup.length > 0) {
                attempt += detectAttempt(action);
                error += detectError(action);
                grouped.push(subGroup);
                grouped.push([evt]);
            } else {
                subGroup.push(evt);
                grouped.push(subGroup);
            }
        } else if (lead.indexOf(action) > -1 && subGroup.length > 0) {
            grouped.push(subGroup);
            subGroup = Array(evt);
            attempt += detectAttempt(action);
            error += detectError(action);
        } else subGroup.push(evt);
    });
    return { evts: grouped, attempt, error, time };
};

const detectAttempt = (data) => {
    return data.indexOf("Attempt") > -1 ? 1 : 0;
};
const detectError = (data) => {
    return data.indexOf("Error") > -1 ? 1 : 0;
};

const timeSpent = (data) => {
    return (
        (new Date(data[data.length - 1].time).getTime() -
            new Date(data[0].time).getTime()) /
        1000
    );
};

export default TransactionEvents;
