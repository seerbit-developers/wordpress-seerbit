import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getPlanSubscriberPlans } from "actions/recurrentActions";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import { cancelSubscription } from "services/recurrentService";
import { alertExceptionError, alertSuccess, alertError } from "modules/alert";
import AppTable from "components/app-table";
import Badge from "components/badge";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom"
import Copy from "assets/images/svg/copy.svg";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {handleCopy} from "utils"
import {AppModalCenter} from "components/app-modal";
import Button from "components/button";
import {useTranslation} from "react-i18next";

function SubscriberSubscriptions({getPlanSubscriberPlans, ...props}) {
    const [perPage] = useState(25);
    const {t} = useTranslation()
    const [processing, setProcessing] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [confirmAction, setConfirmAction] = useState(false);
    const { loading, subscriber_subscriptions } = props;
    const history = useHistory();
    const size = useWindowSize();
    const { customerId, cardName } = useParams();
    const { width } = size;

    useEffect(() => {
        getPlanSubscriberPlans(customerId)
    }, [customerId])

    const onCancel = (d)=>{
        setConfirmAction(true);
        setSubscription(d)
    }
    const cancel = () => {
        const data = {
            amount: subscription?.amount,
            currency: subscription?.currency,
            country: subscription?.country,
            mobileNumber: subscription?.mobileNumber,
            billingId: subscription?.billingId,
            publicKey: subscription?.publicKey,
            status: subscription.status === "CANCELED" ? "ACTIVE" : "CANCELED"
        }
        setProcessing(true);
        cancelSubscription(data).then(res => {
            setProcessing(false);
            if (res.responseCode == '00') {
                setConfirmAction(false)
                getPlanSubscriberPlans(customerId)
                alertSuccess(`Subscription was successfully ${subscription?.status === 'CANCELED' ? 'restored' : 'canceled'}.`)
            } else {
                alertError(res.message
                    ? res.message || res.responseMessage
                    : `An error occurred while ${subscription?.status === 'CANCELED' ? 'restoring' : 'canceling'} the subscription. Kindly try again`);
            }
        }).catch((e) => {
            setProcessing(false);
            alertExceptionError(e)
        });
    }

    const actionsWithCancel = (status)=>
       ( [
            { label: 'View Payments', value: 'view' },
            { label: `${status === 'CANCELED' ? 'Restore' : 'Cancel'} Subscription`, value: 'cancel' }
        ]
    );

    const [actions] = React.useState(
        [
            { label: 'View Payments', value: 'view' }
        ]
    );

    const onTableActionChange = (action, props) => {
        if (action.value === 'view') {
            history.push(`/subscribers/${props?.billingId}/transactions`);
        }
        if (action.value === 'cancel') {
            onCancel(props);
        }
    }

    const [columns] = React.useState([
        {
            name: 'Plan Name', cell: props => props?.productId
        },
        { name: 'Amount', cell: props => <div>{props?.currency} {props?.amount}</div> },
        { name: 'Interval', cell: props => <div>{props?.billingCycle && props?.billingCycle.toLowerCase()}</div> },
        {
            name: 'Plan Code', cell: props => <span className="row p-0 m-0">
                <div className="cut-text">
                    {props?.plan}
                </div>
                <img
                    src={Copy}
                    width="15"
                    height="15"
                    className="cursor-pointer"
                    onClick={(e) => {
                        handleCopy(e, props?.plan);
                    }}
                />
            </span>
        },
        { name: 'Subcribed On', cell: props => <div>{moment(props?.createdAt).format("DD-MM-yyyy, hh:mm A")}</div> },
        { name: 'No of Payments', cell: props => <div>{`${props?.chargeCount} of ${props?.limit}`}</div> },
        {
            name: "Status",
            cell: (props) => {
                return (
                    <div className="text-left" >
                        <Badge
                            status={props?.status === "ACTIVE" ? "success" : "default"}
                            styles={` p-1 ${props?.status === "ACTIVE" ? "success" : "default"}-transaction`}
                        >
                            {props?.status && props?.status.toLowerCase()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            name: '',
            style: { width: '50px', paddingRight: '0px', textAlign: 'right' },
            cell: (props) => (
                <TableDropdown
                    data={
                    props?.status ?
                            actionsWithCancel(props?.status)
                            : []
                }
                    onChange={(action) => onTableActionChange(action, props)} />
            )
        }
    ]);

    const [columnsMobile] = React.useState([
        {
            name: 'Plan Name', cell: props => props?.productId
        },
        { name: 'Amount', cell: props => <div>{props?.currency} {props?.amount}</div> },
        {
            name: 'Plan Code', cell: props => <span className="row p-0 m-0">
                <div className="cut-text">
                    {props?.planId}
                </div>
                <img
                    src={Copy}
                    width="15"
                    height="15"
                    className="cursor-pointer"
                    onClick={(e) => {
                        handleCopy(e, props?.planId);
                    }}
                />
            </span>
        },
        {
            name: "Status",
            cell: (props) => {
                return (
                    <div className="text-left" >
                        <Badge
                            status={props?.status === "ACTIVE" ? "success" : "default"}
                            styles={` p-1 ${props?.status === "ACTIVE" ? "success" : "default"}-transaction`}
                        >
                            {props?.status && props?.status.toLowerCase()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            name: '',
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        }
    ]);

    return (
        <div className="page-container py-5">
            <AppModalCenter
                isOpen={confirmAction}
                close={()=>setConfirmAction(false)}
                title={'Accept selected disputes'}
            >
                <div className='d-flex align-items-center mb-4'>
                    <h4 className='d-inline-block mr-2 mb-0'>{`Confirm action to ${subscription?.status === 'CANCELED' ? 'restore' : 'cancel'} subscription`} </h4>
                    <span></span>
                </div>
                <div className="d-flex justify-content-between align-content-center mt-3">
                    <Button
                        size='md'
                        full
                        buttonType='secondary'
                        className="mr-3"
                        onClick={() => setConfirmAction(false)}
                    >{t('Cancel')}
                    </Button>
                    <Button
                        full
                        size='md'
                        className="ml-3"
                        onClick={() => cancel()}
                    >
                        {processing ? 'Processing...' : t('Confirm')}
                    </Button>
                </div>
            </AppModalCenter>
            <div className="d-flex flex-row justify-content-between mb-5">
                <div className="font-medium pb-3 font-20 text-black">
                    {"SUBSCRIPTIONS FOR " + cardName.toUpperCase().split(" ")[0]}
                </div>
                <div onClick={(e) => {
                    history.goBack()
                }} className="backk pb-5">
                    <LeftChevron /> return to subscribers
                </div>
            </div>
            {width >= 991 &&
                <AppTable
                    columns={width >= 991 ? columns : columnsMobile}
                    fixedLayout={false}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    paginate={subscriber_subscriptions?.rowCount && Math.ceil(subscriber_subscriptions?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={subscriber_subscriptions?.rowCount && Math.ceil(subscriber_subscriptions?.rowCount / perPage) || 0}
                    changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={subscriber_subscriptions?.currentPage && parseInt(subscriber_subscriptions?.currentPage) === 0 ?
                        1 : parseInt(subscriber_subscriptions?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(subscriber_subscriptions?.currentPage) / perPage) + 1
                    }
                    data={subscriber_subscriptions?.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />
            }
        </div>
    );
}


const mapStateToProps = state => ({
    subscriber_subscriptions: state.recurrent.subscriber_subscriptions,
    loading: state.recurrent.loading_subscriber_subscriptions
});

export default connect(mapStateToProps, { getPlanSubscriberPlans, cancelSubscription })(SubscriberSubscriptions);
