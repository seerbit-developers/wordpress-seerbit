import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getSubscriberTransaction } from "actions/recurrentActions";
import PlanOverview from "./plan_overview";
import AppTable from "components/app-table";
import { retrySubscription } from "services/recurrentService";
import { useParams } from "react-router-dom"
import { CSVLink } from "react-csv";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import Badge from "components/badge";
import { Button } from "react-bootstrap";
import { alertError, alertExceptionError, alertSuccess } from "modules/alert";
import moment from "moment";
import useWindowSize from "components/useWindowSize";
import "./css/plan_overview.scss";
import {Loader} from "semantic-ui-react";

const exports = [
    {
        text: "Export to Excel",
        value: 1,
        label: 1,
    },
];

const headers = [
    { label: "Currency", key: "currency" },
    { label: "Amount", key: "amount" },
    { label: "Reference", key: "paymentReference" },
    { label: "Time Stamp", key: "createdAt" },
];

function PlanTransactions(props) {
    const [perPage] = useState(25);
    const [expt, setExport] = useState();
    const [selectedPlan, setPlan] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [selectedSubscriber, setSubscriber] = useState(null);
    const [dates, setDates] = useState([]);

    const { plan_subscribers, subscriber_transactions, getSubscriberTransaction, loading, plans } = props;
    const size = useWindowSize()
    const { width } = size;
    const { billingId, planId } = useParams();

    useEffect(() => {
        let planData = plans?.payload.find(element => element?.details?.planId === planId);
        let subscriberData = plan_subscribers?.payload.find(element => element?.billingId === billingId);

        const startDate = moment().subtract(6, 'months').format("DD-MM-yyyy");
        const stopDate = moment().format("DD-MM-yyyy");

        setPlan(planData);
        setSubscriber(subscriberData);
        getSubscriberTransaction(subscriberData?.customerId, planId, 0, perPage, startDate, stopDate,subscriberData?.billingId)
    }, [])

    useEffect(() => {
        const startDate = moment(dates[0]).format("DD-MM-yyyy");
        const stopDate = moment(dates[1]).format("DD-MM-yyyy");

        if (dates[1] && dates[1] !== null) {
            props.getSubscriberTransaction(selectedSubscriber?.customerId, planId, 0, perPage, startDate, stopDate)
        }
    }, [dates])

    const retry = (props) => {
        setProcessing(true)
        let subscriber = plan_subscribers?.payload.find(element => element?.billingId === billingId);
        let planData = plans?.payload.find(element => element?.details?.planId === planId);

        const startDate = moment().subtract(6, 'months').format("DD-MM-yyyy");
        const stopDate = moment().format("DD-MM-yyyy");

        const data = {
            amount: props?.amount,
            email: subscriber?.email,
            currency: props?.currency,
            authorizationCode: subscriber?.authorizationCode,
            paymentReference: props?.paymentReference + Date.now(),
            publicKey: props?.publicKey,

        }

        retrySubscription(data).then(res => {
            if (res?.payload?.code == '00') {
                setProcessing(false)
                getSubscriberTransaction(subscriber?.customerId, planData?.plan, 0, perPage, startDate, stopDate)
                alertSuccess('Retry was successful.')
            } else {
                setProcessing(false)
                alertError(res?.payload?.message
                    ? res?.payload?.message || res?.payload?.responseMessage
                    : "An error occurred while retrying the subscription. Kindly try again");
            }
        }).catch((e) => {
            setProcessing(false)
            alertExceptionError(e)
        });
    }

    const changePage = (from = 1) => {
        const startDate = moment(dates[0]).format("DD-MM-yyyy");
        const stopDate = moment(dates[1]).format("DD-MM-yyyy");
        props.getSubscriberTransaction(selectedSubscriber?.customerId, planId, from, perPage, startDate, stopDate, selectedSubscriber?.billingId)
    };

    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={subscriber_transactions?.payload || []}
                        headers={headers}
                        filename={`${new Date().getTime()}-transactions.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
    };

    const [columns] = React.useState([
        { name: 'Amount', cell: props => <div>{props?.currency} {props?.amount}</div> },
        {
            name: "",
            cell: (props) => {
                return (
                    <div className="text-left" >
                        <Badge
                            status={props?.gatewayResponseCode === "00" ? "success" : "fail"}
                            styles={` p-1 ${props?.gatewayResponseCode === "00" ? "success" : "fail"}-transaction`}
                        >
                            {props?.gatewayResponseCode === "00" ? "Successful" : "Failed"}
                        </Badge>
                    </div>
                );
            },
        },
        { name: 'Reference', cell: props => <div>{props?.paymentReference}</div> },
        { name: 'Time Stamp', cell: props => <div>{moment(props?.createdAt).format("DD-MM-yyyy, hh:mm A")}</div> },
        {
            name: 'Action',
            style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                props && props.gatewayResponseCode === "00" ? "-" : <Button
                    variant="light"
                    style={{ width: "100px", height: "40px", background: "#DFE0EB", }}
                    className="sbt-button p-0"
                    onClick={() => retry(props)}
                    disabled={processing}
                >
                    <span className="font-12 font-black">
                        {processing && (
                            <Loader active inline='centered' />
                        )}{" "}
                        retry debit
                    </span>
                </Button>
            )
        }
    ]);

    const [columnsMobile] = React.useState([
        { name: 'Amount', cell: props => <div>{props?.currency} {props?.amount}</div> },
        {
            name: "",
            cell: (props) => {
                return (
                    <div className="text-left" >
                        <Badge
                            status={props?.gatewayResponseCode === "00" ? "success" : "fail"}
                            styles={` p-1 ${props?.gatewayResponseCode === "00" ? "success" : "fail"}-transaction`}
                        >
                            {props?.gatewayResponseCode === "00" ? "Successful" : "Failed"}
                        </Badge>
                    </div>
                );
            },
        },
        { name: 'Reference', cell: props => <div>{props?.paymentReference}</div> },
        { name: 'Time Stamp', cell: props => <div>{moment(props?.createdAt).format("DD-MM-yyyy, hh:mm A")}</div> },
        {
            name: 'Action',
            style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                props && props.gatewayResponseCode === "00" ? "-" : <Button
                    variant="light"
                    style={{ width: "100px", height: "40px", background: "#DFE0EB", }}
                    className="sbt-button p-0"
                    onClick={() => retry(props)}
                    disabled={processing}
                >
                    <span className="font-12 font-black">
                        {processing && (
                            <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                        )}{" "}
                        retry debit
                    </span>
                </Button>
            )
        }
    ]);

    return (
        <div className="page-container py-5">
            <PlanOverview {...{ selectedPlan, title: "subscribers" }} />
            <div className="font-medium font-20 text-black mr-3 d-none d-lg-block">
                {selectedSubscriber?.cardName && selectedSubscriber?.cardName.toUpperCase().split(" ")[0] + "'S PAYMENTS"}
            </div>
            <hr className="my-3 mb-4" />
            <div className="d-flex flex-row justify-content-between p-0 m-0 mb-3">
                <div className="calender-wrap cursor-pointer pl-2 pr-2 pt-1 sbt-border-success mr-3">
                    <Calendar
                        placeholder="Select Date Range"
                        selectionMode="range"
                        value={dates}
                        onChange={(e) => {
                            setDates(e.value);
                        }}
                        className="font-12 cursor-pointer"
                        maxDate={new Date()}
                        showIcon={true}
                        hideOnDateTimeSelect={true}
                    />
                </div>
                <div>
                    <span className="font-12 font-light export_data">
                        <Dropdown
                            optionLabel="text"
                            style={{ width: 180 }}
                            value={expt}
                            options={exports}
                            onChange={(e) => {
                                setExport(e.target.value);
                            }}
                            itemTemplate={downloadTemplate}
                            placeholder="Export Data"
                            className="font-12 text-left sbt-border-success"
                            showClear={true}
                        />
                    </span>
                </div>
            </div>
            {width >= 991 &&
                <AppTable
                    columns={columns}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    paginate={subscriber_transactions?.rowCount && Math.ceil(subscriber_transactions?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={subscriber_transactions?.rowCount && Math.ceil(subscriber_transactions?.rowCount / perPage) || 0}
                    changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={subscriber_transactions?.currentPage && parseInt(subscriber_transactions?.currentPage) === 0 ?
                        1 : parseInt(subscriber_transactions?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(subscriber_transactions?.currentPage) / perPage) + 1
                    }
                    data={subscriber_transactions?.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />
            }

            {width < 991 &&
                <AppTable
                    hideHeader
                    columns={columnsMobile}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    paginate={subscriber_transactions?.rowCount && Math.ceil(subscriber_transactions?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={subscriber_transactions?.rowCount && Math.ceil(subscriber_transactions?.rowCount / perPage) || 0}
                    changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={subscriber_transactions?.currentPage && parseInt(subscriber_transactions?.currentPage) === 0 ?
                        1 : parseInt(subscriber_transactions?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(subscriber_transactions?.currentPage) / perPage) + 1
                    }
                    data={subscriber_transactions.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />
            }
        </div>
    );
}


const mapStateToProps = state => ({
    plans: state.recurrent.plans,
    plan_subscribers: state.recurrent.plan_subscribers,
    subscriber_transactions: state.recurrent.subscriber_transactions,
    loading: state.recurrent.loading_subscriber_transactions
});

export default connect(mapStateToProps, {
    getSubscriberTransaction,
    retrySubscription
})(PlanTransactions);

const mockData = {
    "status": "SUCCESS",
    "currentPage": 0,
    "pageCount": 10,
    "message": "Successful",
    "responseCode": "00",
    "rowCount": 200,
    "payload": [
        {
            "paymentReference": "PK_1oowoo2o2",
            "amount": 100.00,
            "gatewayResponseCode": "00",
            "authorizationCode": "1211111",
            "currency": "NGN",
            "gatewayResponseMessage": "Transaction Successful",
            "createdAt": "2021-08-02 00:00:00"
        }
    ]
}
