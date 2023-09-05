/** @format */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getTransactions,
  searchTransactions,
  emailReport,
  addRefund,
  replyDispute,
  requestReport,
  clearState,
  getSingleTransaction
} from "actions/postActions";
import moment from "moment";
import { Can } from "modules/Can";
import { Dropdown } from "primereact/dropdown";
import { DebounceInput } from "react-debounce-input";
import { CSVLink } from "react-csv";
import ReportEmail from "../../modules/ReportEmail";
import { isEmpty } from "lodash";
import Filter from "../../utils/analytics/filter";
import styled from "styled-components";
import transactions_export from "../../utils/strings/transaction_export.json";
import transactions_json from "../../utils/strings/transaction.json";
import AppTable from "components/app-table";
import Mastercard from "../../assets/images/svg/mastercard-icon.svg";
import Visa from "../../assets/images/svg/visa-icon.svg";
import Verve from "../../assets/images/verve.png";
import Search from "../../assets/images/svg/search.svg";
import FilterIcon from "../../assets/images/svg/filterIcon.svg";
import TransactionOverviewModal from "./components/TransactionOverviewModal";
import Badge from "components/badge";
import useWindowSize from "components/useWindowSize";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import {alertError, alertSuccess} from "modules/alert";
import DropdownFilter from "./components/dropdownFilter";
import { useTranslation } from "react-i18next";
import {getCustomReportFieldNames} from "actions/transactionActions";
import './style.css'
const NavMenuItem = styled.div`
  // width: 95vw;
  margin: auto;
  font-size: 1.1em;
  color: #676767 !important;
  // min-height: calc(100vh - 80px);
`;

function formatNumber(num) {
  return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function TransactionPage(props) {
  const [isSideMenuModalOpen, setIsSideMenuModalOpen] = useState(false);
  const [currency, setCurrency] = useState("");
  const [transaction_status, setTransactionStatus] = useState("ALL");
  const [selectedpaymentOption, setOption] = useState("")
  const [active_option, setActiveOption] = useState("default");
  const [perPage, setPerPage] = useState(25);
  const [search_term, setSearchTerms] = useState("");
  const [processing, setProcessing] = useState();
  const [show_fliter, setShowFilter] = useState(false);
  const [dates, setDates] = useState([]);
  const [expt, setExport] = useState(); //exports[0].value
  const [show_mail_report, setShowMailReport] = useState(false);
  const [transaction_data, setTransactionData] = useState(null);
  const [show_overview, setShowOverview] = useState();
  const [refund_success, setRefundSuccess] = useState(false);
  const [openRefund, setRefund] = useState(false);
  const [loading, setLoading] = useState(false);
  const [request, sendRequest] = useState(false);
  const [searchBy, setSearchBy] = useState('transaction_reference');
  const [transactionReference, setTransactionReference] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [productId, setProductId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSearch, setFilterSearch] = useState(false);
  const [exportOptions, setExportOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [defaultDates, setDefaultDates] = useState([null, null]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const size = useWindowSize()
  const { t } = useTranslation()
  const { width, height } = size;

  const getFromDate = () => {
    if (typeof defaultDates === 'object') {
      return defaultDates && defaultDates[0] ? moment(defaultDates[0]).format("DD-MM-yyyy") : null;
    } else {
      return defaultDates && defaultDates[0] ? defaultDates[0] : null;
    }
  }

  const getToDate = () => {
    if (typeof defaultDates === 'object') {
      return defaultDates && defaultDates[1] ? moment(defaultDates[1]).format("DD-MM-yyyy") : null;
    } else {
      return defaultDates && defaultDates[1] ? defaultDates[1] : null;
    }
  }

  useEffect(() => {
    if (props.transactions_params) {
      setPageNumber(parseInt(props.transactions_params.currentPage) + 1);
    }
  }, [props.transactions_params]);

  const changePage = (
      page,
      cur = currency,
      status = transaction_status
  ) => {
    const from = getFromDate();
    const to = getToDate();
    setProcessing(true);
    setActiveOption("filter");
    props.searchTransactions(page, perPage, from, to, search_term, cur, status, true, selectedpaymentOption, transactionReference,productId)
    // props.getTransactions(from, perPage, cur, status);
    setProcessing(true);
  }
  const handleChangePage = (type) => {
    const page = type === 'increment' ? (pageNumber + 1) : type === 'decrement' ? (pageNumber - 1) : 1;
    const from = getFromDate();
    const to = getToDate();
    setProcessing(true);
    setActiveOption("filter");
    props.searchTransactions(page, perPage, from, to, search_term, currency, status, true, selectedpaymentOption, transactionReference, productId)
  }

  const filter = (
      search = search_term,
      page = 1,
      range = perPage,
      cur = currency,
      status = transaction_status,
      option = selectedpaymentOption,
      clear=false
  ) => {
    const from = getFromDate();
    const to = getToDate();
    setProcessing(true);
    setActiveOption("filter");
    props.searchTransactions(page, range, from, to, search, cur, status, true,
        clear ? '' : option,
        clear ? '' : transactionReference,
        clear ? '' : productId)
  };

  const closeEmailReport = () => {
    setShowMailReport(false);
  };

  const sendEmailReport = (param) => {
    const data = {
      reportFields: param,
      emailAddresses: [props.user_details.email],
    };
    setProcessing(true);
    if (data.reportFields.length < 3) {
      alertError("Please select a minimum of 3 fields");
      setProcessing(false);
      return false;
    } else {
      let from = defaultDates[0]
          ? moment(defaultDates[0]).format("DD-MM-yyyy")
          : moment().subtract(1, "month").format("DD-MM-yyyy");
      let to = defaultDates[1]
          ? moment(defaultDates[1]).format("DD-MM-yyyy")
          : moment().subtract(1, "days").format("DD-MM-yyyy");

      if (moment() === moment(defaultDates[1]))
        to = moment().subtract(1, "days").format("DD-MM-yyyy");

      const params = {
        start_date: from,
        stop_date: to,
        data,
        location: "email_report",
        type: transaction_status
      };
      props.emailReport(params);
    }
  };

  const mapTrans =
      props.transactions_params &&
      props.transactions_params.payload &&
      props.transactions_params.payload.map(tran => tran);
  let headers = transactions_export.defaultV3;

  if (props.business_details.invoice && props.business_details.invoice.active) {
    headers.push(...transactions_export.branch);
  }

  const downloadTemplate = (option) => {
    if (!option.value) {
      return option.text;
    } else {
      if (option.value === 1)
        return (
            <div className="my-1 font-12 font-weight-bold">
              <CSVLink
                  data={mapTrans || []}
                  headers={headers}
                  filename={`${new Date().getTime()}-transactions.csv`}
                  className=""
              >
                <span style={{ color: "#333333" }}>{option.text}</span>
              </CSVLink>
            </div>
        );
          // else if (option.value === 2)
          //   return (
          //     <div
          //       className="my-1 font-12 font-weight-bold"
          //       onClick={() =>
          //         PrintPDf(props.transactions || [], transactions_array)
          //       }
          //     >
          //       {option.text}
          //     </div>
      //   );
      else if (option.value === 3)
        return (
            <div
                className="my-1 font-12 font-weight-bold"
                onClick={() => {
                  sendRequest(false)
                  setShowMailReport(true);
                }}
            >
              {option.text}
            </div>
        );
      else if (option.value === 4)
        return (
            <div
                className="my-1 font-12 font-weight-bold"
                onClick={() => {
                  sendRequest(true)
                  setShowMailReport(true);
                }}
            >
              {option.text}
            </div>
        );
    }
  };

  useEffect(() => {
    setLoading(true);
    props.searchTransactions(1, perPage,
        dates ? dates[0] : null,
        dates ? dates[1] : null,
        search_term, currency, transaction_status, true, selectedpaymentOption)
    if (props.business_details.default_currency) {
      setCurrency(props.business_details.default_currency);
    }

    const rr = transactions_json.filter.map(item=>{
      return {text:t(item.text), value: item.value}
    });
    const eo = transactions_json.exports_type.map(item=>{
      return {text:t(item.text), value: item.value}
    });
    setStatusOptions(rr)
    setExportOptions(eo)
  }, []);

  useEffect( ()=>{
    if (searchBy){
      if (search_term){
        if (search_term.length){
          filter()
        }
      }
    }
  }, [searchBy])

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.transactions_params)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.transactions_params, props.error_details]);

  useEffect(() => {
    if (props.refund && props.location === "refund") {
      props.getTransactions();
      setRefund(false);
      setRefundSuccess(true);
      alertSuccess("Customer was successfully refunded", "transactions_alert");
    }
    if (props.error_details && props.error_details.error_source === "refund") {
      alertError(props.error_details.message);
      props.clearState({ error_details: null });
    }

    if (props.dispute && props.location === "dispute") {
      alertSuccess("Sent", "transactions_alert");
    }
    if (props.error_details && props.error_details.error_source === "dispute") {
      alertError("Request can't be process, try again later");
      props.clearState({ error_details: null });
    }

    if (props.email_report && props.location === "email_report") {
      alertSuccess(props.email_report.message, "report_a");
    }

    if (
        props.error_details &&
        props.error_details.error_source === "email_report"
    ) {
      alertError(props.error_details.message);
      props.clearState({ error_details: null });
    }

    if (props.request_report && props.location === "request_report") {
      const requestData = JSON.parse(props.request_report);
      closeEmailReport()
      setProcessing(false);
      alertSuccess(requestData.message,"transactions_alert");
      props.clearState({ request_report: null });
    }

    if (
        props.error_details &&
        props.error_details.error_source === "request_report"
    ) {
      setProcessing(false);
      alertError(props.error_details.message || props.error_details.responseMessage);
      props.clearState({ error_details: null });
    }
    if (props.email_report && props.location === "email_report") {
      alertSuccess(props.email_report.message, "transactions_alert");
    }

    setProcessing(false);
  }, [
    props.transactions,
    props.business_details.default_currency,
    props.refund,
    props.email_report,
    props.location,
    props.error_details,
    props.transactions_params,
  ]);


  const cardQuickDection = text => {
    return /^5[1-5][0-9]+/.test(text) || text === '2223000000000007'
        ? Mastercard
        : /^4[0-9]+(?:[0-9]{3})?/.test(text)
            ? Visa
            : /^5[0][0-9]+/.test(text)
                ? Verve
                : '';
  };

  const viewTransactionData = async (data) => {
    props.clearState({ search_vendor: null });
    setLoadingDetails(true);
    setIsSideMenuModalOpen(true);
    try {
      const res = await getSingleTransaction(data.id, props?.business_details?.number);
      setLoadingDetails(false);
      if (res.status === "success") {
        setRefundSuccess(false)
        setTransactionData(res.data);
      } else {
        alertError(res.message);
      }
    } catch (err) {
      setLoadingDetails(false);
      alertError(err.message);
    }
  }

  useEffect(() => {
    if (transaction_data) {
      setIsSideMenuModalOpen(true)
    }
  }, [transaction_data]);

  const renderTooltipReference = (props) => (
      <Tooltip id="button-tooltip">
        {props.transactionRef}
      </Tooltip>
  );

  const [fullColumns] = React.useState([
    {
      name: t('Customer'),
      style: { width: '200px' },
      cell: row => <span className="text-right" title={row && row.customer && row.customer.customerName}>
        {row && row.customerName ? row.customerName.substr(0, 15) : 'NA'}
      </span>
    },
    {
      name: t('Reference'),
      style: { width: '200px' },
      cell: data => <span className="row p-0 m-0">

        <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipReference(data)}
        ><div
            onClick={(e) => {
              viewTransactionData(data)
            }}
            className="cut-text cursor-pointer text-uppercase"
        >
            <span>{data && data.transactionRef ? data.transactionRef.substr(0, 15) : ""}</span>

          </div>
        </OverlayTrigger>
        {/*<img*/}
        {/*    src={Copy}*/}
        {/*    width="15"*/}
        {/*    height="15"*/}
        {/*    className="cursor-pointer"*/}
        {/*    onClick={(e) => {*/}
        {/*      handleCopy(e, data.transactionRef);*/}
        {/*    }}*/}
        {/*    alt="copy"*/}
        {/*/>*/}
      </span>
    },
    {
      name: t('Amount'),
      cellStyle: { textAlign: 'left' },
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <div>
              <span className="" style={{ fontWeight: "500" }} onClick={() => viewTransactionData(props)}>
                {props.currency} {formatNumber(props.amount)}
              </span>
              </div>

            </div>
        )
      }
    },
    {
      name: '',
      style: { width: '100px', paddingRight: '15px' },
      cell: props => {
        const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
        const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <Badge
                  status={props.refundList && props.refundList.length > 0
                      ? "refund"
                      :
                      (props.gatewayResponseCode === "00" &&
                          props.status === "COMPLETED" || props.status === "SETTLED")
                          ? "success"
                          : ["SM_X23", "SM_A"].indexOf(
                              props.gatewayResponseCode
                          ) > -1
                              ? "default"
                              : "fail"}
                  styles={` p-1 ${preAuthCapitalized && preAuthCapitalized === "Refund"
                      ? "refund"
                      : props.refundList && props.refundList.length > 0
                          ? "refund"
                          :
                          (props.gatewayResponseCode === "00" &&
                              props.status === "COMPLETED" || props.status === "SETTLED")
                              ? "success"
                              : ["SM_X23", "SM_A"].indexOf(
                                  props.gatewayResponseCode
                              ) > -1
                                  ? "default"
                                  : "failed"
                  }-transaction`}
              >
                {props.transType !== "PREAUTH"
                    ? props.refundList && props.refundList.length > 0
                        ? "Refunded"
                        :
                        (props.gatewayResponseCode === "00" &&
                            props.status === "COMPLETED" ||
                            props.status === "SETTLED")
                            ? "Successful"
                            : props.gatewayResponseCode === "SM_X23"
                                ? "Expired"
                                : props.gatewayResponseCode === "SM_A"
                                    ? "Aborted"
                                    : "Failed"
                    : preAuthCapitalized &&
                    preAuthCapitalized !== "Noauth" &&
                    preAuthCapitalized !== "Refund" &&
                    preAuthCapitalized !== "Cancel"
                        ? `${preAuthCapitalized}d`
                        : preAuthCapitalized === "Refund"
                            ? `${preAuthCapitalized}ed`
                            : preAuthCapitalized === "Cancel"
                                ? `${preAuthCapitalized}led`
                                : preAuthCapitalized === "Noauth"
                                    ? props.gatewayResponseCode === "00"
                                        ? "Captured"
                                        : "Failed"
                                    : null}
              </Badge>
            </div>
        )
      }
    },
    {
      name: t('Payment Channel'),
      style: { width: '250px', paddingRight: '15px', textAlign: 'left' },
      cell: row => <span className="text-lowercase text-center" onClick={() => viewTransactionData(props)}>{row.channel ? t(row.channel) : ""}</span>
    },
    {
      name: t('Date'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span>{moment(data.transactionComplete ? data.transactionComplete : data.transactionTime).format("DD-MM-yyyy, hh:mm A")}</span>
    },
  ]);

  const [columns] = React.useState([
    {
      name: t('Amount'), cell: props => {
        // const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
        return (
            <div className="d-flex justify-content-start">
            <span className="cut-text font-bold" style={{ flex: 1 }}>
              {props.currency} {formatNumber(props.amount)}
            </span>
            </div>
        )
      }
    },
    {
      name: '',
      cell: props => {
        const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
        const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
        return (
            <div className="text-center" onClick={() => viewTransactionData(props)}>
              <Badge
                  status={props.refundList && props.refundList.length > 0
                      ? "refund"
                      :
                      (props.gatewayResponseCode === "00" &&
                          props.status === "COMPLETED" || props.status === "SETTLED")
                          ? "success"
                          : ["SM_X23", "SM_A"].indexOf(
                              props.gatewayResponseCode
                          ) > -1
                              ? "default"
                              : "fail"}
                  styles={` p-1 ${preAuthCapitalized && preAuthCapitalized === "Refund"
                      ? "refund"
                      : props.refundList && props.refundList.length > 0
                          ? "refund"
                          :
                          (props.gatewayResponseCode === "00" &&
                              props.status === "COMPLETED" || props.status === "SETTLED")
                              ? "success"
                              : ["SM_X23", "SM_A"].indexOf(
                                  props.gatewayResponseCode
                              ) > -1
                                  ? "default"
                                  : "failed"
                  }-transaction`}
              >
                {props.transType !== "PREAUTH"
                    ? props.refundList && props.refundList.length > 0
                        ? "Refunded"
                        :
                        (props.gatewayResponseCode === "00" &&
                            props.status === "COMPLETED" || props.status === "SETTLED")
                            ? "Successful"
                            : props.gatewayResponseCode === "SM_X23"
                                ? "Expired"
                                : props.gatewayResponseCode === "SM_A"
                                    ? "Aborted"
                                    : "Failed"
                    : preAuthCapitalized &&
                    preAuthCapitalized !== "Noauth" &&
                    preAuthCapitalized !== "Refund" &&
                    preAuthCapitalized !== "Cancel"
                        ? `${preAuthCapitalized}d`
                        : preAuthCapitalized === "Refund"
                            ? `${preAuthCapitalized}ed`
                            : preAuthCapitalized === "Cancel"
                                ? `${preAuthCapitalized}led`
                                : preAuthCapitalized === "Noauth"
                                    ? props.gatewayResponseCode === "00"
                                        ? "Captured"
                                        : "Failed"
                                    : null}
              </Badge>
            </div>
        )
      }
    },
    {
      name: t('Time Stamp'), cell: data => <span>{moment(data.transactionTimeString).format("D-M-yy, HH:mm")}</span>
    },
  ]);

  const isMobile = width < 991;
  return (
      <>
        {isSideMenuModalOpen &&
            <TransactionOverviewModal
                isOpen={isSideMenuModalOpen}
                close={() => setIsSideMenuModalOpen(false)}
                props={transaction_data}
                setShowOverview={() => setShowOverview(false)}
                addRefund={(params) => props.addRefund(params)}
                refund_success={refund_success}
                closeSuccess={() => setRefundSuccess(false)}
                replyDispute={props.replyDispute}
                canRaiseRefund={props.business_details.canRaiseRefund}
                openRefund={openRefund}
                setRefund={setRefund}
                isMobile={isMobile}
                loading={loadingDetails}
            />}
        <div className="sbt-transaction">
          <NavMenuItem className="py-5">
            <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
              { t("Payments")}
            </div>
            <div className="d-none d-lg-flex flex-row align-items-center justify-content-between">

              <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="input-wrap sbt-border-success br-normal mr-3 position-relative"  id="filterToggleDiv" style={{padding:'6px 0', lineHeight: 'normal'}}>
                <span className="transaction-search-filter-container" id="filterToggleSpan">
                  <img src={FilterIcon} id="filterToggleImg" />
                  {t("Filter")}

                </span>
                  <DropdownFilter
                      loading={props.loading}
                      isOpen={filterSearch}
                      close={()=>setFilterSearch(false)}
                      open={()=>setFilterSearch(true)}
                      allowedCurrency={props.business_details.allowedCurrency}
                      channelOption={props.business_details.channelOptionStatus}
                      paymentOption={selectedpaymentOption}
                      currency={currency}
                      setPaymentChannel={setOption}
                      filter={filter}
                      setCurrency={(cur) => setCurrency(cur)}
                      changePage={(cur, status) => changePage(1, cur, status)}
                      setTransactionStatus={(status) =>
                          setTransactionStatus(status)
                      }
                      setTransactionReference={setTransactionReference}
                      transactionReference={transactionReference}
                      setProductId={setProductId}
                      productId={productId}
                  />
                </div>
                <div className="input-wrap mr-3">
                  <Can access={"EXPORT_MERCHANT_REPORT"}>
                    <Dropdown
                        style={{ width: 130 }}
                        optionLabel="text"
                        value={transaction_status}
                        options={statusOptions}
                        onChange={(e) => {
                          setTransactionStatus(e.value);
                          changePage(1, currency, e.value);
                          setShowFilter(true);
                        }}
                        className="font-12 sbt-border-success"
                    />
                  </Can>
                </div>
                <div>
                  <Filter
                      payment_option_filter={false}
                      showFilter={true}
                      setDates={(val) => setDates(val)}
                      dates={dates}
                      allowedCurrency={props.business_details.allowedCurrency}
                      channelOption={props.business_details.channelOptionStatus}
                      selectedpaymentOption={selectedpaymentOption}
                      currency={false}
                      setOption={setOption}
                      filter={filter}
                      setCurrency={(cur) => setCurrency(cur)}
                      changePage={(cur, status) => changePage(1, cur, status)}
                      setTransactionStatus={(status) =>
                          setTransactionStatus(status)
                      }
                      useNewDatePicker
                      // defaultDates={defaultDates}
                      setDefaultDates={setDefaultDates}
                  />
                </div>
              </div>

              <div>
              <span className="font-12 font-light export_data">
                <Can access={"EXPORT_MERCHANT_REPORT"}>
                <Dropdown
                    optionLabel="text"
                    style={{ width: 180 }}
                    value={expt}
                    options={exportOptions}
                    onChange={(e) => {
                      setExport(e.target.value);
                    }}
                    itemTemplate={downloadTemplate}
                    placeholder={t("Export Data")}
                    className="font-12 text-left sbt-border-success"
                    showClear={true}
                />
                </Can>
              </span>
              </div>


            </div>

            {/*mobile filter*/}
            <div className="d-md-none d-flex flex-column align-items-center p-0 m-0 ">

              <div className="input-wrap sbt-border-success br-normal px-2 py-0">
                <DebounceInput
                    minLength={2}
                    debounceTimeout={1000}
                    className="font-12 text-left"
                    placeholder={t("Search by Reference")}
                    aria-label="Search"
                    onChange={(e) => {
                      setTransactionReference(e.target.value);
                      filter(e.target.value);
                    }}
                />
                <div className="text-right w-100">
                  <img src={Search} />
                </div>
              </div>

              <div className="input-wrap mr-3 w-100 mt-4">
                <Can access={"EXPORT_MERCHANT_REPORT"}>
                  <Dropdown
                      style={{ width: 170 }}
                      optionLabel="text"
                      value={transaction_status}
                      options={transactions_json.filter}
                      onChange={(e) => {
                        setTransactionStatus(e.value);
                        changePage(1, currency, e.value);
                        setShowFilter(true);
                      }}
                      className="font-12 sbt-border-success w-100"
                  />
                </Can>
              </div>
            </div>
          </NavMenuItem>

          {show_mail_report && (
              <ReportEmail
                  request={request}
                  type="TRANSACTION"
                  show={show_mail_report}
                  process={processing}
                  setProcessing={setProcessing}
                  close={closeEmailReport}
                  sendReport={sendEmailReport}
                  email={
                    props.user_details.email ? props.user_details.email : ""
                  }
                  transaction_status={transaction_status}
              />
          )}
          {width >= 991 &&
              <AppTable
                  columns={fullColumns}
                  headerStyle={{ textTransform: 'uppercase' }}
                  loading={props.loading}
                  paginate={props.transactions_params ? props.transactions_params.rowCount ? Math.ceil(props.transactions_params.rowCount / perPage) > 1 : false : false}
                  perPage={perPage}
                  totalPages={props.transactions_params ? props.transactions_params.rowCount ? Math.ceil(props.transactions_params.rowCount / perPage) : 0 : 0}
                  changePage={(page) => {
                    setCurrentPage(page.activePage)
                    changePage(page.activePage, currency, transaction_status);
                  }}
                  currentPage={
                    props.transactions_params &&
                    props.transactions_params.currentPage ?
                        parseInt(props.transactions_params.currentPage) + 1 : 1
                  }
                  data={
                    props.transactions_params &&
                    props.transactions_params.payload ?
                        props.transactions_params.payload : []
                  }
                  onClickRow={viewTransactionData}
                  rowStyle={{ cursor: 'pointer' }}
                  transPaginate={true}
                  page={pageNumber}
                  loadPrevPage={() => handleChangePage('decrement')}
                  loadNextPage={() => handleChangePage('increment')}
                  goToPageOne={() => handleChangePage('page-one')}
              />
          }
          {width < 991 &&
              <AppTable
                  columns={columns}
                  loading={props.loading}
                  hideHeader
                  paginate={props.transactions_params ? props.transactions_params.rowCount ? Math.ceil(props.transactions_params.rowCount / perPage) > 1 : false : false}
                  perPage={perPage}
                  totalPages={props.transactions_params ? props.transactions_params.rowCount ? Math.ceil(props.transactions_params.rowCount / perPage) : 0 : 0}
                  changePage={(page) => {
                    changePage(page.activePage, currency, transaction_status);
                    setCurrentPage(page.activePage)
                  }}
                  currentPage={
                    props.transactions_params &&
                    props.transactions_params.currentPage ?
                        parseInt(props.transactions_params.currentPage) === 0 ? 1 :
                            parseInt(props.transactions_params.currentPage) === perPage ? 2 :
                                Math.ceil(parseInt(props.transactions_params.currentPage) / perPage) + 1 : 1
                  }
                  data={
                    props.transactions_params &&
                    props.transactions_params.payload ?
                        props.transactions_params.payload : []
                  }
                  onClickRow={viewTransactionData}
                  rowStyle={{ cursor: 'pointer' }}
                  transPaginate={true}
                  page={pageNumber}
                  loadPrevPage={() => handleChangePage('decrement')}
                  loadNextPage={() => handleChangePage('increment')}
                  goToPageOne={() => handleChangePage('page-one')}
              />
          }
        </div>

      </>
  );
}

TransactionPage.propTypes = {
  getTransactions: PropTypes.func.isRequired,
  addRefund: PropTypes.func.isRequired,
  replyDispute: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  transactions_params: state.data.transactions.data,
  error_details: state.data.error_details,
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  location: state.data.location,
  email_report: state.data.email_report,
  request_report: state.data.request_report,
  refund: state.data.refund,
  dispute: state.data.dispute,
  loading: state.transactions.loading_transactions
});

export default connect(mapStateToProps, {
  getTransactions,
  // filterTransactions,
  searchTransactions,
  emailReport,
  addRefund,
  replyDispute,
  requestReport,
  clearState,
  getCustomReportFieldNames
})(TransactionPage);