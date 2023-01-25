import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getSubcriptions, dispatchSubcriptions } from "actions/recurringActions";
import { updateSubscriptionStatus } from "services/recurringService";
import moment from "moment";
import AppTable from "components/app-table";
import { Spinner } from "react-bootstrap";
import { alertError, alertExceptionError, alertSuccess } from "modules/alert";

function Subcriptions(props) {
    const [check, setCheck] = useState(false);
    const [selectedId, setId] = useState();
    const [process, setProcess] = useState(false);
    const { subscriptions, loading } = props;

    useEffect(() => {
        props.getSubcriptions()
    }, [])

    const editSubscriptionStatus = (e, row) => {
        e.preventDefault();
        setId(row)
        setCheck(!check)
        const p = {
            "billingId": row.billingId,
            "amount": row.amount,
            "country": row.country,
            "status": e.target.checked ? "ACTIVE" : 'INACTIVE'
        }
        updateSubscriptionStatus(p)
            .then(res => {
                if (res.responseCode === '00') {
                    setProcess(false)
                    props.dispatchSubcriptions(
                        {
                            billingId: res.payload.data.subscriptions.billingId,
                            subscriptions: res.payload.data.subscriptions
                        }
                    )
                    alertSuccess('Update Successful')
                } else {
                    alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                }
            })
            .catch(e => {
                setProcess(false)
                alertExceptionError(e)
            })
    }

    const [columns] = React.useState([
        { name: 'Card Name', cell: row => <div>{row.cardName}</div> },
        { name: 'Billing Id', cell: row => <div>{row.billingId}</div> },
        { name: 'Date', cell: row => <div>{moment(row.startDate).format("DD-MM-yyyy, hh:mm A")}</div> },
        { name: 'Plan', cell: row => <div>{row.plan}</div> },
        {
            name: 'Status', cell: row => <div className="form-group form-inline font-14" style={{ color: "#3F99F0" }}>
                <div className="form-group p-0">
                    {selectedId === row.id && check ? (
                        <Spinner animation="border" size="sm" className="mr-1" />
                    ) : (
                        <input
                            type="checkbox"
                            className=" mr-2"
                            checked={row.status === "ACTIVE" ? true : false}
                            onChange={e => editSubscriptionStatus(e, row)}
                            disabled={check}
                        />
                    )}
                </div>{" "}
                {row.status === "ACTIVE" ? "active" : "inactive"}
            </div>
        },
    ]);

    const [columnsMobile] = React.useState([
        { name: 'Card Name', cell: row => <div>{row.cardName}</div> },
        { name: 'Billing Id', cell: row => <div>{row.billingId}</div> },
        { name: 'Card Number', cell: row => <div>{row.cardNumber}</div> },
        { name: 'Plan', cell: row => <div>{row.plan}</div> },
        { name: 'Status', cell: row => <div>{row.plan}</div> },
    ]);

    return (
        <div className="page-container py-5">
            <AppTable
                columns={columns}
                fixedLayout={false}
                loading={loading}
                paginate={false}
                data={subscriptions ? subscriptions : []}
                className="mt-5"
                rowClass="row-height"
                headerClass=""
            />
        </div>
    );
}


const mapStateToProps = state => ({
    subscriptions: state.recurring.subscriptions,
    loading: state.recurring.loading_subscriptions
});

export default connect(mapStateToProps, { getSubcriptions, dispatchSubcriptions })(Subcriptions);
