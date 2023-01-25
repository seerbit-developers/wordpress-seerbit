import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    updateOrderStatus,
    loadProductOrdersDetails,
    setErrorLog,
    clearState,
} from "actions/postActions";
import Button from "components/button";
import AppTable from "components/app-table";
import moment from "moment";
import "./css/view.scss";
import AppModal from "../../components/app-modal";
import {completeOrder, getOrderDetails} from "../../services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {appBusy} from "../../actions/appActions";
function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function ViewOrder(props) {
    const {
        setOpen,
        storeId,
        selectedOrder,
        isOpen,
        reload
    } = props;

    const [loadingDetails, setLoadingDetails] = useState(false);
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        if (selectedOrder && isOpen === true)
        {
            setLoadingDetails(true);
            getOrderDetails(storeId,selectedOrder.id)
                .then(res=>{
                    setLoadingDetails(false)
                    if (res.responseCode === '00'){
                        setOrders(res.payload)
                    }else{
                        alertError(res.message ? res.message : 'Unable to make request at the moment')
                    }
                }).catch(e=>{
                setLoadingDetails(false)
                alertExceptionError(e)
            })
        }
    }, [isOpen]);

    const calculateTotal = () => {
        return orders ? orders.reduce((accumulator, data) => {
            return accumulator + (data.amount * data.quantity);
        }, 0) : 0
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.appBusy(true, 'Updating Order status')
        completeOrder(storeId,selectedOrder.transactionRef,{
            orderStatus: "COMPLETED"
        })
            .then(res=>{
                props.appBusy(false)
                if (res.responseCode === '00'){
                    alertSuccess("Order was successfully completed.")
                    reload()
                }else{
                    alertError(res.message ? res.message : 'Unable to make request at the moment')
                }
            }).catch(e=>{
            props.appBusy(false)
            alertExceptionError(e)
        })

    }

    const [fullColumns] = React.useState([
        {
            name: '',
            style: { width: '200px' },
            cell: row => (
                <div>
                    <img src={row.productImageUrl} alt="product-img" width="50" height="50" className="mr-2" />
                    {row.productName}
                </div>
            )
        },
        {
            name: 'Cost',
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>
                {data.amount}
            </span>
        },
        {
            name: 'Qty',
            style: { width: '30px', paddingRight: '15px', textAlign: 'right' },
            cell: data => <div>
                <div style={{ textAlign: 'right', paddingRight: '0px', }}>x{data.quantity}</div>
            </div>
        },
        {
            name: 'Total',
            style: { width: '100px', paddingRight: '15px', textAlign: 'right' },
            cell: data => <div>
                <div style={{ textAlign: 'right', paddingRight: '0px', }}>{formatNumber(data.amount * data.quantity)}</div>
            </div>
        }
    ]);

    return (
        <AppModal
            title={"Order Details"}
            isOpen={isOpen}
            close={() => {
                setOpen(false);
                setOpen(false);
            }}>
            {selectedOrder &&
            <div className="px-3 py-4">
                <div className="sbt-order" style={{marginBottom: 313}}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="mt-5">{selectedOrder.orderStatus === "COMPLETED" ? <div
                            className="alert alert-success text-center "
                            style={{width: "100px"}}
                            role="alert"
                        >
                            <div
                                className="py-1 font-14">{selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1).toLowerCase()}</div>
                        </div> : <div
                            className="alert alert-light text-center py-2"
                            style={{width: "100px", backgroundColor: "#DAE2ED"}}
                            role="alert"
                        >
                            <div
                                className="py-1 font-14">{selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1).toLowerCase()}</div>
                        </div>}
                        </div>
                        <div className="mt-3">
                            <div className="col-lg-12 m-0 p-0">
                                <div className="table-title mt-4">
                                    Order Details
                                </div>
                                <AppTable
                                    columns={fullColumns}
                                    loading={loadingDetails}
                                    paginate={false}
                                    data={orders && orders || []}
                                    className=""
                                    rowClass="row-height"
                                    headerClass=""
                                />
                                <div className="mt-4">
                                    <div className="d-flex flex-row justify-content-between my-2">
                                        <div className="shipping">
                                            Shipping Fee
                                        </div>
                                        <div className="shipping-value">
                                            {selectedOrder.shippingAmount ? formatNumber(selectedOrder.shippingAmount) : 'Free'}
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="d-flex flex-row justify-content-between my-2">
                                        <div className="shipping">
                                            Total
                                        </div>
                                        <div className="shipping-value font-bold">
                                            {formatNumber(calculateTotal())}
                                        </div>
                                    </div>
                                </div>

                                {orders && orders.length !== 0 && (
                                    <div className="d-flex flex-row justify-content-between my-5">
                                            <Button
                                                size="sm"
                                                type="secondary"
                                                full={true}
                                                className="mr-5"
                                                onClick={() => setOpen(false)}
                                                disabled={loadingDetails}
                                            >
                                                Close
                                            </Button>

                                            <Button
                                                size="sm"
                                                full={true}
                                                className="ml-5"
                                                disabled={loadingDetails}
                                                type="submit"
                                            >
                                                Complete Order
                                            </Button>

                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="footer-order px-4 py-2" >
                            <div className="table-title mb-4 mt-4">
                                Customer Details
                            </div>
                            <div className="d-flex flex-row justify-content-between mb-3">
                                <div className="title">Name</div>
                                <div
                                    className="value">{selectedOrder.customerName ? selectedOrder.customerName : selectedOrder.customerContactDetails ? selectedOrder.customerContactDetails : "Not Available"}</div>
                            </div>
                            <div className="d-flex flex-row justify-content-between  mb-3">
                                <div className="title">Email</div>
                                <div
                                    className="value">{selectedOrder.customerEmail ? selectedOrder.customerEmail : "Not Available"}</div>
                            </div>
                            <div className="d-flex flex-row justify-content-between  mb-3">
                                <div className="title">Phone Number</div>
                                <div
                                    className="value">{selectedOrder.customerPhone ? selectedOrder.customerPhone : "Not Available"}</div>
                            </div>
                            <div className="d-flex flex-row justify-content-between mb-3">
                                <div className="title">Address</div>
                                <div
                                    className="value">{selectedOrder.address ? selectedOrder.address : "Not Available"}</div>
                            </div>
                            <div className="d-flex flex-row justify-content-between  mb-3">
                                <div className="title">Date/Time</div>
                                <div
                                    className="value">{moment(selectedOrder.profiledAt).format("yyyy-MM-DD hh:mm")}</div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            }
        </AppModal>
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    get_order_details: state.data.get_order_details,
    update_order_status: state.data.update_order_status
});
export default connect(mapStateToProps, {
    updateOrderStatus,
    loadProductOrdersDetails,
    setErrorLog,
    clearState,
    appBusy
})(ViewOrder);
