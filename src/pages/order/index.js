/** @format */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    updateOrderStatus,
    loadProductOrders,
    setErrorLog,
    clearState,
} from "actions/postActions";
import { isEmpty } from "lodash";
import { Dropdown } from "primereact/dropdown";
import Copy from "assets/images/svg/copy.svg";
import { CSVLink } from "react-csv";
import useOnClickOutside from "utils/onClickOutside";
import cogoToast from "cogo-toast";
import ViewOrder from "./ViewOrder";
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import {handleCopy} from "utils";
import "./css/order.scss";
import {useHistory, useParams} from "react-router";
import {completeOrder} from "../../services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {appBusy} from "../../actions/appActions";
import Button from "../../components/button";
import Badge from "../../components/badge";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {Link} from "react-router-dom";
import {getProductOrders} from "../../actions/frontStoreActions";
import {useTranslation} from "react-i18next";

function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export function Orders(props) {
    const {storeId} = useParams();
    const [perPage, setPerPage] = useState(25);
    const [isOpen, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [expt, setExport] = useState();
    const [selectedId, setId] = useState();
    const [manage, setManage] = useState();
    const [selectedOrderDetails, setOrderDetails] = useState();
    const size = useWindowSize()
    const { width, height } = size;
    const isMobile = width < 1200;
    const { t } = useTranslation();
    const {
        store_orders,
        loading,
        update_order_status,
        location
    } = props;

    const exports = [
        {
            text: t("Export to Excel"),
            value: 1,
            label: 1,
        }
    ];

    const ref = useRef();
    useOnClickOutside(ref, () => setId());

    useEffect(() => {
        props.getProductOrders(0, perPage, storeId)
    }, []);


    const handleCompleteOrder = (selected) => {
        props.appBusy(true, t('Updating Order status'))
        completeOrder(selected.storeId,selected.transactionRef,{
            orderStatus: "COMPLETED"
        })
            .then(res=>{
                props.appBusy(false)
                if (res.responseCode === '00'){
                    props.getProductOrders(0, perPage, storeId)
                    alertSuccess("Order was successfully completed")
                }else{
                    alertError(res.message ? res.message : 'Unable to make request at the moment')
                }
            }).catch(e=>{
            props.appBusy(false)
            alertExceptionError(e)
        })
    }

    const changePage = (from = 0) => {
        props.getProductOrders( from - 1, perPage, storeId );
        setProcessing(true);
    };

    useEffect(() => {
        if (update_order_status && location === "create_store_settings") {
            alertSuccess("Order was successfully completed.");
            clearState({ name: "update_order_status", value: null });
            setOpen(false)
        }
    }, [update_order_status, location]);

    const headers = [
        { label: t("Full Name"), key: "fullName" },
        { label: t("Email"), key: "emailAddress" },
        { label: t("Pocket Account Number"), key: "pocketAccountNumber" },
        { label: t("Phone Number"), key: "phoneNumber" },
        { label: t("Currency"), key: "currency" },
        { label: t("Pocket Balance"), key: "balance" },
        { label: t("Date Added"), key: "createdAt" },
    ];

    const [actions] = React.useState([
        { label: t('View Order'), value: 'view' },
        { label: t('Complete Order'), value: 'complete' },
    ]
    );

    const onTableActionChange = (action, data) => {
        if (action.value === 'complete') {
            handleCompleteOrder(data)
        }

        if (action.value === 'view') {
            setOrderDetails(data);
            setOpen(true)
            setId();
        }
    }

    const [fullColumns] = React.useState([
        {
            name: t('Order ID'),
            style: { width: '100px' },
            cell: row => (
                <span className="d-flex align-items-center cursor-pointer text-right">
                    <span>{row && row.transactionRef && row.transactionRef.substr(0, 15)}</span>
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer ml-2"
                        onClick={(e) => {
                            handleCopy(row.transactionRef);
                        }}
                    />
                </span>
            )
        },
        {
            name: t('Customer Email'),
            style: { width: '100px' },
            cell: props => <span className="row p-0 m-0" title={props && props.customerContactDetails && props.customerContactDetails}>
                {props && props.customerContactDetails && props.customerContactDetails.substr(0,20)}
            </span>
        },
        {
            name: t('Amount'),
            cellStyle: { textAlign: 'left' },
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: props => {
                return (
                    <span className="row p-0 m-0">
                        <div className="cut-text">
                            <span className="seerbit-color">{`${formatNumber(props.amount)}`}</span>
                        </div>
                    </span>
                )
            }
        },
        {
            name: t('Date'),
            style: { width: '60px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.profiledAt).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Status'),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: props =>
                props.orderStatus === "COMPLETED" ?
                    <Badge status={'success'} text={props.orderStatus.charAt(0).toUpperCase() + props.orderStatus.slice(1).toLowerCase()} />
                     :
                    <Badge text={props.orderStatus.charAt(0).toUpperCase() + props.orderStatus.slice(1).toLowerCase()} />
        },
        {
            name: t('Action'),
            cellStyle: { textAlign: 'right' },
            style: { width: '30px', paddingRight: '15px', textAlign: 'right' },
            cell: (props) => (
                props.orderStatus === "COMPLETED" ? <Button text="View" size="xs" onClick={()=>onTableActionChange({value:'view'}, props)}/> :
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        },
    ]);

    const [columns] = React.useState([
        {
            name: t('Order ID'),
            cell: row => (
                <span className="cut-text cursor-pointer text-right">
                    {row && row.transactionRef && row.transactionRef.substr(0, 6)}
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                            handleCopy(row.transactionRef);
                        }}
                    />
                </span>
            )
        },
        {
            name: t('Amount'),
            cellStyle: { textAlign: 'left' },
            cell: props => {
                return (
                    <span className="row p-0 m-0">
                        <div className="cut-text">
                            <span className="seerbit-color">{` ${props.amount}`}</span>
                        </div>
                    </span>
                )
            }
        },
        {
            name: t('Date'),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.profiledAt).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Status'),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: props =>
                props.orderStatus === "COMPLETED" ? <div
                    className="alert alert-success text-center "
                    style={{ width: "100px" }}
                    role="alert"
                >
                    <div className="py-1 font-14">{props.orderStatus.charAt(0).toUpperCase() + props.orderStatus.slice(1).toLowerCase()}</div>
                </div> : <div
                    className="alert alert-light text-center py-2"
                    style={{ width: "100px", backgroundColor: "#DAE2ED" }}
                    role="alert"
                >
                    <div className="py-1 font-14">{props.orderStatus.charAt(0).toUpperCase() + props.orderStatus.slice(1).toLowerCase()}</div>
                </div>
        },
        {
            name: t('Action'),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        },
    ]);

    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={store_orders && store_orders.payload || []}
                        headers={headers}
                        filename={`${new Date().getTime()}-pocket_customers.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
    };

    return (
        <>
                    <ViewOrder
                        setOpen={setOpen}
                        selectedOrder={selectedOrderDetails}
                        isOpen={isOpen}
                        storeId={storeId}
                        isMobile={isMobile}
                        reload={()=>props.getProductOrders(0, perPage, storeId)}
                    />

            {isEmpty(manage) && (
                <div className="py-5">
                        <Link to="/frontstore" className="backk pb-5">
                            <LeftChevron /> {t('return to stores')}
                        </Link>
                        <div className="d-flex flex-row justify-content-between">
                        <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
                            {t('Orders')}
                        </div>
                        <div>
                            <span className="font-12 font-light export_data">
                                <Dropdown
                                    optionLabel="text"
                                    value={expt}
                                    options={exports}
                                    onChange={(e) => {
                                        setExport(e.target.value);
                                    }}
                                    itemTemplate={downloadTemplate}
                                    placeholder={t('Export Data')}
                                    className="font-12 text-left w-200px sbt-border-success py-1"
                                    showClear={true}
                                />
                            </span>
                        </div>
                        </div>

                        {width >= 991 &&
                            <AppTable
                                columns={fullColumns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading}
                                paginate={store_orders && store_orders.rowCount ? store_orders.rowCount ? Math.ceil(store_orders.rowCount / perPage) > 1 : false : false}
                                perPage={perPage}
                                totalPages={
                                    store_orders && store_orders.rowCount ? store_orders && store_orders.rowCount ? Math.ceil(store_orders && store_orders.rowCount / perPage) : 0 : 0
                                }
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    store_orders &&
                                    parseInt(store_orders.currentPage) + 1
                                }
                                data={(store_orders && store_orders.payload) || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                        }
                        {width < 991 && (
                            <AppTable
                                hideHeader
                                columns={columns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading}
                                paginate={store_orders && store_orders.rowCount ? store_orders.rowCount ? Math.ceil(store_orders.rowCount / perPage) > 1 : false : false}
                                perPage={perPage}
                                totalPages={
                                    store_orders && store_orders.rowCount ? store_orders && store_orders.rowCount ? Math.ceil(store_orders && store_orders.rowCount / perPage) : 0 : 0
                                }
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    store_orders && store_orders.currentPage &&
                                        store_orders.currentPage ?
                                        parseInt(store_orders.currentPage) === 0 ? 1 :
                                            parseInt(store_orders.currentPage) === perPage ? 2 :
                                                Math.ceil(parseInt(store_orders.currentPage) / perPage) + 1 : 1
                                }
                                data={(store_orders && store_orders.payload) || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                        )}
                    </div>
            )}
        </>
    );
}

const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    store_orders: state.frontStore.store_orders,
    loading: state.frontStore.loading_store_orders,
});
export default connect(mapStateToProps, {
    updateOrderStatus,
    loadProductOrders,
    setErrorLog,
    clearState,
    appBusy,
    getProductOrders
})(Orders);
