import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getSubscriberTransaction } from "actions/recurrentActions";
import AppTable from "components/app-table";
import { retrySubscription } from "services/recurrentService";
import { useParams, useHistory } from "react-router-dom"
import { CSVLink } from "react-csv";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import Badge from "components/badge";
import { Button } from "react-bootstrap";
import { alertError, alertExceptionError, alertSuccess } from "modules/alert";
import moment from "moment";
import useWindowSize from "components/useWindowSize";
import styled from "styled-components";
import LeftChevron from "../../assets/images/svg/leftChevron";
import ConfirmAction from "../../modules/confirmAction";

const CloseTag = styled.div`
  font-size: 1.5em;
  color: grey;
  display: flex;
  cursor: pointer;
  .icon {
    font-size: 1em;
  }
`;

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

function SubscriptionTransactions(props) {
    const [perPage] = useState(25);
    const [expt, setExport] = useState();
    const [processing, setProcessing] = useState(false);
    const [selectedSubscription, setSubscriber] = useState(null);
    const [dates, setDates] = useState([]);
    const [triggerRetry, setTriggerRetry] = useState(false);
    const [transaction, setTransaction] = useState(null);

    const { subscriber_subscriptions, subscriber_transactions, loading, getSubscriberTransaction } = props;
    const size = useWindowSize()
    const { width } = size;
    const history = useHistory();
    const { billingId } = useParams();

    useEffect(() => {
        let subscriptionData = subscriber_subscriptions?.payload.find(element => element?.billingId === billingId);
        setSubscriber(subscriptionData)
        const startDate = moment().subtract(6, 'months').format("DD-MM-yyyy");
        const stopDate = moment().format("DD-MM-yyyy");
        props.getSubscriberTransaction(subscriptionData?.customerId, subscriptionData?.plan, 0, perPage, startDate, stopDate, billingId)
    }, [])

    useEffect(() => {
        let subscriptionData = subscriber_subscriptions?.payload.find(element => element?.billingId === billingId);
        const startDate = moment(dates[0]).format("DD-MM-yyyy");
        const stopDate = moment(dates[1]).format("DD-MM-yyyy");

        if (dates[1] && dates[1] !== null) {
            props.getSubscriberTransaction(subscriptionData?.customerId, subscriptionData?.plan, 0, perPage, startDate, stopDate, billingId)
        }
    }, [dates])

    const retry = () => {
        let subscription = subscriber_subscriptions?.payload.find(element => element?.billingId === billingId);

        const startDate = moment().subtract(6, 'months').format("DD-MM-yyyy");
        const stopDate = moment().format("DD-MM-yyyy");

        const data = {
            amount: transaction?.amount,
            email: subscription?.email,
            currency: transaction?.currency,
            authorizationCode: subscription?.authorizationCode,
            paymentReference: transaction?.paymentReference,
            publicKey: transaction?.publicKey,

        }
        setProcessing(true)
        retrySubscription(data).then(res => {
            if (res?.payload?.code == '00') {
                setTriggerRetry(false)
                setProcessing(false)
                getSubscriberTransaction(subscription?.customerId, subscription?.plan, 0, perPage, startDate, stopDate, billingId)
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

    const onRetry = (d)=>{
        setTransaction(d)
        setTriggerRetry(true)
    }

    const changePage = (from = 1) => {
        let subscriptionData = subscriber_subscriptions?.payload.find(element => element?.billingId === billingId);
        props.getSubscriberTransaction(subscriptionData?.customerId, subscriptionData?.plan, from, perPage, startDate, stopDate, billingId)
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
        { name: 'Reference', cell: props => <div title={props?.paymentReference}>{props?.paymentReference.substr(0, 15)}</div> },
        { name: 'Time Stamp', cell: props => <div>{moment(props?.createdAt).format("DD-MM-yyyy, hh:mm A")}</div> },
        {
            name: 'Action',
            style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                props && props.gatewayResponseCode === "00" ? "-" : <Button
                    variant="light"
                    style={{ width: "100px", height: "40px", background: "#DFE0EB", }}
                    className="sbt-button p-0"
                    onClick={() => onRetry(props)}
                >
                    <span className="font-12 font-black">
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
                    onClick={() => onRetry(props)}
                >
                    <span className="font-12 font-black">
                        retry debit
                    </span>
                </Button>
            )
        }
    ]);

    return (
        <div className="page-container py-5">

                <ConfirmAction
                    show={triggerRetry}
                    title='RETRY DEBIT'
                    message={`Are you sure you want to trigger a debit to this customer?`}
                    handler={() =>
                        retry()
                    }
                    process={processing}
                    close={(e) => setTriggerRetry(false)}
                />

            <div className="d-flex flex-row justify-content-between mb-5">
                <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-3">
                    {selectedSubscription?.cardName && selectedSubscription?.cardName.toUpperCase().split(" ")[0] + "'S PAYMENTS"}
                </div>
                <div onClick={(e) => {
                    history.goBack()
                }} className="backk pb-5">
                    <LeftChevron /> return to subscriptions
                </div>

            </div>
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
                <AppTable
                    columns={width >= 991 ? columns : columnsMobile}
                    fixedLayout={false}
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
        </div>
    );
}


const mapStateToProps = state => ({
    plans: state.recurrent.plans,
    subscriber_subscriptions: state.recurrent.subscriber_subscriptions,
    subscriber_transactions: state.recurrent.subscriber_transactions,
    loading: state.recurrent.loading_subscriber_transactions
});

export default connect(mapStateToProps, {
    getSubscriberTransaction,
    retrySubscription
})(SubscriptionTransactions);
