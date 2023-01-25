/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    clearState,
    getVendorSettlements,
    getVendorTransactions,
    getVendorTransactionOverview
} from "../../actions/postActions";
import "./css/filter.scss";
import moment from "moment";
import { isEmpty } from "lodash";
import Bank from "assets/images/svg/bank-icon.svg";
import Visa from "assets/images/svg/visa-icon.svg";
import Verve from "assets/images/verve.png";
import Exchange from "assets/images/svg/transfer-icon.svg";
import Mastercard from "assets/images/svg/mastercard-icon.svg";
import { Dropdown } from "primereact/dropdown";
import Copy from "assets/images/svg/copy.svg";
import { CSVLink } from "react-csv";
import PrintPDf from "../downloadPdf";
import Loader from "assets/images/svg/loader.svg";
import { Nav } from "react-bootstrap";
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import "./css/sbt-table.scss";
import { Calendar } from "primereact/calendar";
import CalendarIcon from "assets/images/svg/calendar.svg";
import styled from "styled-components";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {useTranslation} from "react-i18next";
import {handleCopy} from 'utils';

const CloseTag = styled.div`
  font-size: 0.9em;
  color: #c2c2c2 !important;
  display: flex;
  cursor: pointer;
  .icon {
    font-size: 1.2em;
  }
`;

const RightComponent = styled.div`
  float: right;
`;



function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function VendorOverview({
    subAccount,
    close,
    business_details,
    getVendorTransactions,
    getVendorSettlements,
    vendor_transactions,
    vendor_settlements,
    vendor_transaction_overview,
    getVendorTransactionOverview,
    error_details
}) {

    const {t} = useTranslation()
    const [perPage, setPerPage] = useState(25);
    const [activeTab, setActiveTab] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [dates, setDates] = useState();
    const [loading_transactions, setLoadingT] = useState(false);
    const [loading_settlements, setLoadingS] = useState(false);
    const size = useWindowSize()
    const { width, height } = size;

    useEffect(() => {
        getVendorTransactionOverview({
            size: perPage,
            start: 1,
            subAccountId: subAccount.subAccountId
        })
        getVendorTransactions({
            size: perPage,
            start: 1,
            subAccountId: subAccount.subAccountId
        })
    }, [])

    useEffect(() => {
        setLoadingT(true);
        setLoadingS(true);
        if (!isEmpty(vendor_transactions)) setLoadingT(false);
        if (!isEmpty(vendor_settlements)) setLoadingS(false);
        if (!isEmpty(error_details)) {
            setLoadingT(false);
            setLoadingS(false);
        }
    }, [
        vendor_transactions,
        vendor_settlements,
        error_details
    ]);

    const onRowClick = () => { };

    useEffect(() => {
        if (!isEmpty(dates) && dates[1] && activeTab === 0) {
            getVendorTransactions({
                size: perPage,
                start: 1,
                subAccountId: subAccount.subAccountId,
                start_date: moment(dates[0]).format("DD-MM-yyyy"),
                stop_date: moment(dates[1]).format("DD-MM-yyyy"),
            })
        }

        if (!isEmpty(dates) && dates[1] && activeTab === 1) {
            getVendorSettlements({
                size: perPage,
                start: 1,
                subAccountId: subAccount.subAccountId,
                start_date: moment(dates[0]).format("DD-MM-yyyy"),
                stop_date: moment(dates[1]).format("DD-MM-yyyy"),
            })
        }

        if (!isEmpty(dates) && dates[1]) {
            getVendorTransactionOverview({
                size: perPage,
                start: 1,
                subAccountId: subAccount.subAccountId,
                start_date: moment(dates[0]).format("DD-MM-yyyy"),
                stop_date: moment(dates[1]).format("DD-MM-yyyy"),
            })
        }

    }, [dates])



    const changePage = (from = 1) => {
        if (activeTab === 0) {
            if (!isEmpty(dates) && dates[1] && activeTab === 1) {
                getVendorTransactions({
                    start: from,
                    size: perPage,
                    subAccountId: subAccount.subAccountId,
                    start_date: moment(dates[0]).format("DD-MM-yyyy"),
                    stop_date: moment(dates[1]).format("DD-MM-yyyy"),
                });
            } else {
                getVendorTransactions({
                    start: from,
                    size: perPage,
                    subAccountId: subAccount.subAccountId,
                });

            }
        }

        if (activeTab === 1) {
            if (!isEmpty(dates) && dates[1] && activeTab === 1) {
                getVendorSettlements({
                    start: from,
                    size: perPage,
                    subAccountId: subAccount.subAccountId,
                    start_date: moment(dates[0]).format("DD-MM-yyyy"),
                    stop_date: moment(dates[1]).format("DD-MM-yyyy"),
                });
                setProcessing(true);
            } else {
                getVendorSettlements({
                    start: from,
                    size: perPage,
                    subAccountId: subAccount.subAccountId,
                });

            }
        }
    };

    const setRange = (page = perPage) => {
        if (activeTab === 0) {
            if (!isEmpty(dates) && dates[1] && activeTab === 1) {
                getVendorTransactions({
                    start: 1,
                    size: page,
                    subAccountId: subAccount.subAccountId,
                    start_date: moment(dates[0]).format("DD-MM-yyyy"),
                    stop_date: moment(dates[1]).format("DD-MM-yyyy"),
                });
            } else {
                getVendorTransactions({
                    start: 1,
                    size: page,
                    subAccountId: subAccount.subAccountId,
                });

            }
        }

        if (activeTab === 1) {
            if (!isEmpty(dates) && dates[1] && activeTab === 1) {
                getVendorSettlements({
                    start: 1,
                    size: page,
                    subAccountId: subAccount.subAccountId,
                    start_date: moment(dates[0]).format("DD-MM-yyyy"),
                    stop_date: moment(dates[1]).format("DD-MM-yyyy"),
                });
                setProcessing(true);
            } else {
                getVendorSettlements({
                    start: 1,
                    size: page,
                    subAccountId: subAccount.subAccountId,
                });

            }
        }
    };

    const [expt, setExport] = useState();

    const exports = [
        {
            text: t("Export to Excel"),
            value: 1,
            label: 1,
        },
        {
            text: t("Export to PDF"),
            value: 2,
            label: 2,
        },
    ];

    const headers_transactions = [
        { label: t("Date"), key: "transactionDate" },
        { label: t("Customer Name"), key: "customerName" },
        { label: t("Reference"), key: "reference" },
        { label: t("Amount"), key: "amount" },
        { label: t("Sub Account's Share"), key: "subAccountShare" },
        { label: t("Status"), key: "statusMessage" },
    ];

    let transactions_array = [
        [
            { text: t("Date"), style: "tableHeader" },
            { text: t("Customer Name"), style: "tableHeader" },
            { text: t("Reference"), style: "tableHeader" },
            { text: t("Amount"), style: "tableHeader" },
            { text: t("Sub Account's Share"), style: "tableHeader" },
            { text: t("Status"), style: "tableHeader" },
        ],
        [
            { pointer: "transactionDate" },
            { pointer: "customerName" },
            { pointer: "reference" },
            { pointer: "amount" },
            { pointer: "subAccountShare" },
            { pointer: "statusMessage" }
        ],
    ];

    const headers_settlements = [
        { label: t("Date"), key: "date" },
        { label: t("Recipient"), key: "recipient" },
        { label: t("Reference"), key: "reference" },
        { label: t("Amount"), key: "settlementAmount" },
        { label: t("Status"), key: "statusMessage" },
    ];

    let settlements_array = [
        [
            { text: t("Date"), style: "tableHeader" },
            { text: t("Recipient"), style: "tableHeader" },
            { text: t("Reference"), style: "tableHeader" },
            { text: t("Amount"), style: "tableHeader" },
            { text: t("Status"), style: "tableHeader" },
        ],
        [
            { pointer: "date" },
            { pointer: "recipient" },
            { pointer: "reference" },
            { pointer: "settlementAmount" },
            { pointer: "statusMessage" },
        ],
    ];

    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={activeTab === 0
                            ? vendor_transactions && vendor_transactions.payload || []
                            : vendor_settlements && vendor_settlements.payload || []
                        }
                        headers={activeTab === 0 ? headers_transactions : headers_settlements}
                        filename={activeTab === 0 ? `${new Date().getTime()}-transactions.csv` : `${new Date().getTime()}-settlements.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
        else if (option.value === 2)
            return (
                <div
                    className="my-1 font-12 font-weight-bold"
                    onClick={() =>
                        PrintPDf(
                            activeTab === 0
                                ? vendor_transactions && vendor_transactions.payload || []
                                : vendor_settlements && vendor_settlements.payload || [],
                            activeTab === 0
                                ? transactions_array
                                : settlements_array
                        )
                    }
                >
                    {option.text}
                </div>
            );
    };


    const transactionChannel = (props) => {
        try {
            return (
                <span className="number">
                    <img
                        width="25px"
                        height="auto"
                        src={
                            props.channelType === "account" || props.channelType === "ACCOUNT"
                                ? Bank
                                : props.channelType && props.channelType.toLowerCase().indexOf("master") !== -1
                                    ? Mastercard
                                    : props.channelType && props.channelType.toLowerCase().indexOf("visa") !== -1
                                        ? Visa
                                        : props.channelType && props.channelType.toLowerCase().indexOf("verve") !== -1
                                            ? Verve
                                            : props.channelType && props.channelType.toLowerCase().indexOf("card") !== -1
                                                ? cardQuickDection(props.maskNumber)
                                                : Exchange
                        }
                        className="mr-2 mb-1"
                    />
                    {props.channelType && props.channelType.toLowerCase().indexOf("card") !== -1
                        ? props.maskNumber &&
                        `xxxx ${props.maskNumber.substring(props.maskNumber.length - 4)}`
                        : props.channelType
                    }
                </span>
            );
        } catch (e) {
            return Exchange;
        }
    };

    const cardQuickDection = text => {
        return /^5[1-5][0-9]+/.test(text) || text === '2223000000000007'
            ? Mastercard
            : /^4[0-9]+(?:[0-9]{3})?/.test(text)
                ? Visa
                : /^5[0][0-9]+/.test(text)
                    ? Verve
                    : '';
    };

    const [transactionFullColumns] = React.useState([
        {
            name: t(t("Status")),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.transactionDate).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Customer Name'),
            style: { width: '150px' },
            cell: row => <span
                className="cursor-pointer"
                onClick={() => { }}
            >
                {row && row.customerName ? row.customerName : "Not Available"}
            </span>
        },
        {
            name: t('Reference'),
            style: { width: '150px' },
            cell: (props) => (
                <span className="row p-0 m-0">
                    <div
                        className="cut-text-1 seerbit-color cursor-pointer">
                        {props.reference}
                    </div>
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                            handleCopy(e, props.reference);
                        }}
                    />
                </span>
            )
        },
        {
            name: t('Amount'),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <div className="cut-text">
                    {business_details.default_currency} {formatNumber(props.amount)}
                </div>
            )
        },
        {
            name: t('Split Type'),
            cellStyle: { textAlign: 'left' },
            style: { width: '90px', paddingRight: '15px', textAlign: 'left' },
            cell: props => {
                return <span>{props && props.sharingType}</span>
            }
        },
        {
            name: ('Sub Account Share'),
            cellStyle: { textAlign: 'left' },
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: props => {
                return <div className="cut-text seerbit-color">
                    {props && props.type === "PERCENTAGE" ? `${formatNumber(props && props.subAccountValue)}%` : "Not Applicable"}
                </div>
            }
        },
        {
            name: t("Channel Type"),
            cellStyle: { textAlign: 'left' },
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => transactionChannel(props),
        },
        {
            name: t("Status"),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <div className={props.statusCode === "00" ? "success-transaction" : "failed-transaction"}>
                    {props.statusCode === "00" ? "Successful" : "failed"}
                </div>
            )
        }
    ]);

    const [transactionColumns] = React.useState([
        {
            name: t(t("Status")),
            cell: data => <span>{moment(data.transactionDate).format("DD-MM-yyyy")}</span>
        },
        {
            name: t('Customer Name'),
            cell: row => <span
                className="cursor-pointer"
                onClick={() => { }}
            >
                {row && row.customerName ? row.customerName : "Not Available"}
            </span>
        },
        {
            name: t('Reference'),
            cell: (props) => (
                <span
                    className="cut-text-1 seerbit-color cursor-pointer mr-1">
                    {props.reference.substr(0, 4)}
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                            handleCopy(e, props.reference);
                        }}
                    />
                </span>
            )
        },
        {
            name: t('Amount'),
            cell: (props) => (
                <span className="cut-text">
                    {business_details.default_currency} {formatNumber(props.amount)}
                </span>
            )
        },
        {
            name: t('Sub Account Share'),
            cell: props => {
                return <span className="cut-text seerbit-color">
                    {props && props.type === "PERCENTAGE" ? `${formatNumber(props && props.subAccountValue)}%` : "Not Applicable"}
                </span>
            }
        },
        {
            name: t("Status"),
            cell: (props) => (
                <div className={props.statusCode === "00" ? "success-transaction" : "failed-transaction"}>
                    {props.statusCode === "00" ? "Successful" : "failed"}
                </div>
            )
        }
    ]);

    const [settlementFullColumns] = React.useState([
        {
            name: t(t("Status")),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.transactionDate).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Recipient'),
            style: { width: '150px' },
            cell: (props) => (
                <span>{props && props.recipient ? props.recipient : "Not Available"}</span>
            )
        },
        {
            name: t('Reference'),
            style: { width: '150px' },
            cell: (props) => (
                <span className="row p-0 m-0">
                    <div
                        className="cut-text-1 seerbit-color cursor-pointer">
                        {props.reference}
                    </div>
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                            handleCopy(e, props.reference);
                        }}
                    />
                </span>
            )
        },
        {
            name: t('Amount'),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <div className="cut-text">
                    {business_details.default_currency} {formatNumber(props.settlementAmount)}
                </div>
            )
        },
        {
            name: t("Status"),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <div className={props.statusCode === "00" ? "success-transaction" : "failed-transaction"}>
                    {props.statusCode === "00" ? "Successful" : "failed"}
                </div>
            )
        }
    ]);

    const [settlementColumns] = React.useState([
        {
            name: t("Status"),
            cell: data => <span>{moment(data.transactionDate).format("DD-MM-yyyy")}</span>
        },
        {
            name: t("Recipient"),
            cell: (props) => (
                <span>{props && props.recipient ? props.recipient : "Not Available"}</span>
            )
        },
        {
            name: t('Reference'),
            cell: (props) => (
                <span
                    className="cut-text-1 seerbit-color cursor-pointer mr-1">
                    {props.reference.substr(0, 4)}
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                            handleCopy(e, props.reference);
                        }}
                    />
                </span>
            )
        },
        {
            name: t('Amount'),
            cell: (props) => (
                <span className="cut-text">
                    {business_details.default_currency} {formatNumber(props.settlementAmount)}
                </span>
            )
        },
        {
            name: t("Status"),
            cell: (props) => (
                <div className={props.statusCode === "00" ? "success-transaction" : "failed-transaction"}>
                    {props.statusCode === "00" ? "Successful" : "failed"}
                </div>
            )
        }
    ]);

    return (
        <div className="page-container">
            <div className="py-5">
                    <CloseTag onClick={() => close()} className="mb-3">
                        <LeftChevron/>
                        <span className="ml-1 mb-2">{t('return to split settlement')}</span>
                    </CloseTag>
                    <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
                        {subAccount.businessName}
                    </div>

                    <div className="mt-4 d-none d-lg-block">
                        <div className="d-flex justify-content-end ">
                            <RightComponent className="row p-0 m-0 sbt-filter">
                                <div className="input-wrap sbt-border-success br-normal px-2 mr-1" style={{ height: "42px" }}>
                                    <img src={CalendarIcon} />
                                    <Calendar
                                        placeholder={t('Select Date Range')}
                                        selectionMode="range"
                                        value={dates}
                                        onChange={(e) => {
                                            setDates(e.value);
                                        }}
                                        className="font-12 cursor-pointer"
                                        maxDate={new Date()}
                                        showIcon={true}
                                        hideOnDateTimeSelect={true}
                                    ></Calendar>
                                </div>
                                <span className="font-12 font-light px-3 export_data">
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
                            </RightComponent>
                        </div>
                    </div>
                    <div className="d-md-none d-flex flex-row p-0 m-0 mt-5 mb-4">
                        <div className="input-wrap sbt-border-success br-normal px-2 mr-1" style={{ height: "42px" }}>
                            <img src={CalendarIcon} />
                            <Calendar
                                placeholder={t('Select Date Range')}
                                selectionMode="range"
                                value={dates}
                                onChange={(e) => {
                                    setDates(e.value);
                                }}
                                className="font-12 cursor-pointer"
                                maxDate={new Date()}
                                showIcon={true}
                                hideOnDateTimeSelect={true}
                            ></Calendar>
                        </div>
                        <span className="font-12 font-light px-3 export_data">
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
                    <div>
                        <Nav variant="tabs" defaultActiveKey="link-0" className="mb-3" >
                            <Nav.Item onClick={() => {
                                setPerPage(25);
                                getVendorTransactionOverview({
                                    size: perPage,
                                    start: 1,
                                    subAccountId: subAccount.subAccountId
                                })
                                getVendorTransactions({
                                    size: perPage,
                                    start: 1,
                                    subAccountId: subAccount.subAccountId
                                })
                                setActiveTab(0)
                            }}>
                                <Nav.Link eventKey="link-0">{t('Transactions')}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item onClick={() => {
                                setPerPage(25);
                                getVendorSettlements({
                                    size: perPage,
                                    start: 1,
                                    subAccountId: subAccount.subAccountId
                                })
                                setActiveTab(1)
                            }}>
                                <Nav.Link eventKey="link-1">{t('Settlements')}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        {activeTab === 0 && vendor_transactions && width >= 991 && (
                            <AppTable
                                columns={transactionFullColumns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading_transactions}
                                paginate={
                                    vendor_transactions && vendor_transactions.rowCount && Math.ceil(vendor_transactions.rowCount / perPage) > 1 || false}
                                perPage={perPage}
                                totalPages={vendor_transactions && vendor_transactions.rowCount && Math.ceil(vendor_transactions.rowCount / perPage) || 0}
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    vendor_transactions && vendor_transactions.currentPage ?
                                        parseInt(vendor_transactions.currentPage) === 0 ? 1 :
                                            parseInt(vendor_transactions.currentPage) === perPage ? 2 :
                                                Math.ceil(parseInt(vendor_transactions.currentPage) / perPage) + 1 : 1

                                }
                                data={vendor_transactions && vendor_transactions.payload || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                        )}

                        {activeTab === 0 && vendor_transactions && width < 991 && (
                            <AppTable
                                hideHeader
                                columns={transactionColumns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading_transactions}
                                paginate={
                                    vendor_transactions && vendor_transactions.rowCount && Math.ceil(vendor_transactions.rowCount / perPage) > 1 || false}
                                perPage={perPage}
                                totalPages={vendor_transactions && vendor_transactions.rowCount && Math.ceil(vendor_transactions.rowCount / perPage) || 0}
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    vendor_transactions && vendor_transactions.currentPage ?
                                        parseInt(vendor_transactions.currentPage) === 0 ? 1 :
                                            parseInt(vendor_transactions.currentPage) === perPage ? 2 :
                                                Math.ceil(parseInt(vendor_transactions.currentPage) / perPage) + 1 : 1

                                }
                                data={vendor_transactions && vendor_transactions.payload || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                        )}

                        {activeTab === 1 && vendor_settlements && width >= 991 && (
                            <AppTable
                                columns={settlementFullColumns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading_settlements}
                                paginate={
                                    vendor_settlements && vendor_settlements.rowCount && Math.ceil(vendor_settlements.rowCount / perPage) > 1 || false}
                                perPage={perPage}
                                totalPages={vendor_settlements && vendor_settlements.rowCount && Math.ceil(vendor_settlements.rowCount / perPage) || 0}
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    vendor_settlements && vendor_settlements.currentPage ?
                                        parseInt(vendor_settlements.currentPage) === 0 ? 1 :
                                            parseInt(vendor_settlements.currentPage) === perPage ? 2 :
                                                Math.ceil(parseInt(vendor_settlements.currentPage) / perPage) + 1 : 1

                                }
                                data={vendor_settlements && vendor_settlements.payload || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                        )}
                        {activeTab === 1 && vendor_settlements && width < 991 && (
                            <AppTable
                                hideHeader
                                columns={settlementColumns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading_settlements}
                                paginate={
                                    vendor_settlements && vendor_settlements.rowCount && Math.ceil(vendor_settlements.rowCount / perPage) > 1 || false}
                                perPage={perPage}
                                totalPages={vendor_settlements && vendor_settlements.rowCount && Math.ceil(vendor_settlements.rowCount / perPage) || 0}
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    vendor_settlements && vendor_settlements.currentPage ?
                                        parseInt(vendor_settlements.currentPage) === 0 ? 1 :
                                            parseInt(vendor_settlements.currentPage) === perPage ? 2 :
                                                Math.ceil(parseInt(vendor_settlements.currentPage) / perPage) + 1 : 1

                                }
                                data={vendor_settlements && vendor_settlements.payload || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                        )}
                        {activeTab === 0 && !vendor_transactions && (
                            <div className="d-flex justify-content-center mt-3">
                                <img src={Loader} width="100" />
                            </div>
                        )}

                        {activeTab === 1 && !vendor_settlements && (
                            <div className="d-flex justify-content-center mt-3">
                                <img src={Loader} width="100" />
                            </div>
                        )}
                    </div>

                {width >= 991 && (<div style={{ background: "#F0F2F7", width: "300px" }}>
                    {vendor_transaction_overview && vendor_transaction_overview.payload &&
                        <div className="mt-5 px-4">
                            <div className="font-15 my-1">{t('Transaction Overview')}</div>
                            <div className="text-dark font-20 mb-3">
                                {business_details.default_currency}{" "}
                                {
                                    vendor_transaction_overview &&
                                    vendor_transaction_overview.payload &&
                                    vendor_transaction_overview.payload[0].transactionVolume || 0}
                            </div>
                            <div className="font-15 my-1">{t('Sub Account Commission')}</div>
                            <div className="text-dark font-20 mb-3">
                                {business_details.default_currency}{" "}
                                {
                                    vendor_transaction_overview &&
                                    vendor_transaction_overview.payload &&
                                    vendor_transaction_overview.payload[0].subAccountCommission || 0}
                            </div>
                            <div className="font-15 my-1">{t('Bank Account')}</div>
                            <div className="text-dark font-20 mb-3">
                                <span>
                                    {
                                        vendor_transaction_overview &&
                                        vendor_transaction_overview.payload &&
                                        vendor_transaction_overview.payload[0].accountNumber}

                                </span>
                                <div className="font-13">
                                    {subAccount.bankName}
                                </div>
                            </div>
                            {vendor_transaction_overview &&
                                vendor_transaction_overview.payload &&
                                vendor_transaction_overview.payload[0].sharingType === "PERCENTAGE" && <div className="row pl-3">
                                    <div className="mr-4">
                                        <div className="font-15 my-1">{t('My Share')}</div>
                                        <div className="text-dark font-20 mb-3">
                                            <span>
                                                {
                                                    vendor_transaction_overview &&
                                                    vendor_transaction_overview.payload &&
                                                    vendor_transaction_overview.payload[0].principalSharingValue}%
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-15 my-1">{t("Sub Account's Share")}</div>
                                        <div className="text-dark font-20 mb-3">
                                            <span>
                                                {(
                                                    vendor_transaction_overview &&
                                                    vendor_transaction_overview.payload &&
                                                    vendor_transaction_overview.payload[0].subAccountSharingValue)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {vendor_transaction_overview &&
                                vendor_transaction_overview.payload &&
                                vendor_transaction_overview.payload[0].sharingType === "FLAT" && <div className="row pl-3">
                                    <div>
                                        <div className="font-15 my-1">{t("My Share")}</div>
                                        <div className="text-dark font-20 mb-3">
                                            <span>
                                                {business_details.default_currency}{' '}
                                                {
                                                    vendor_transaction_overview &&
                                                    vendor_transaction_overview.payload &&
                                                    vendor_transaction_overview.payload[0].principalSharingValue}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }</div>
                )}
            </div>
            </div>

    );
}

const mapStateToProps = (state) => ({
    business_details: state.data.business_details,
    vendor_transactions: state.data.vendor_transactions,
    vendor_settlements: state.data.vendor_settlements,
    vendor_transaction_overview: state.data.vendor_transaction_overview,
    error_details: state.data.error_details,
});
export default connect(mapStateToProps, {
    getVendorTransactions,
    getVendorSettlements,
    getVendorTransactionOverview,
    clearState,
})(VendorOverview);
