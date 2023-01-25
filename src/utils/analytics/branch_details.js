/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import {
  getBranchTransactions,
  paymentLink,
  setErrorLog,
} from "../../actions/postActions";

import Copy from "../../assets/images/svg/copy.svg";
import LeftChevron from "../../assets/images/svg/leftChevron";
import { Button } from "react-bootstrap";
import Overview from "./transaction_overview";
import { isEmpty } from "lodash";
import Table from "./table";
import Filter from "./filter";
import styled from "styled-components";
import PrintPDf from "../downloadPdf";
import { Can } from "../../modules/Can";
import CheckoutLink from "../../modules/paymentLink";
import cogoToast from "cogo-toast";

import "./css/sbt-table.scss";

import Mastercard from "../../assets/images/svg/mastercard-icon.svg";
import Bank from "../../assets/images/svg/bank-icon.svg";
import Visa from "../../assets/images/svg/visa-icon.svg";
import Verve from "../../assets/images/verve.png";
import Exchange from "../../assets/images/svg/transfer-icon.svg";
import { CSVLink } from "react-csv";

const Wrapper = styled.div`
  background: #fff;
`;

const NavMenuItem = styled.div`
  width: 95vw;
  margin: auto;
  font-size: 1.1em;
  color: #676767 !important;
  min-height: calc(100vh - 80px);
`;
const Counter = styled.span`
  color: #bababa;
  font-size: 12px;
  font-weight: 400;
  margin-left: 1em;
`;
const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;
const RightComponent = styled.div`
  float: right;
`;
const CloseTag = styled.div`
  font-size: 0.9em;
  color: #c2c2c2 !important;
  display: flex;
  cursor: pointer;
  .icon {
    font-size: 1.2em;
  }
  padding-bottom: 3em;
`;

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const onRowClick = () => { };

export function BranchDetails(params) {
  const { props, close, clear } = params;
  const [summary, setSummary] = useState({});
  const [active_option, setActiveOption] = useState("default");
  const [payment_link, showPaymentLink] = useState(false);
  const [perPage, setPerPage] = useState(25);
  const [linkProcess, setLinkProcess] = useState();
  const [dates, setDates] = useState([]);
  const [showFilter, toggleFilter] = useState(false);
  const [show_overview, setShowOverview] = useState();
  const [transaction_data, setTransactionData] = useState();
  const [refund_success, setRefundSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expt, setExport] = useState();
  const exports = [
    {
      text: "Export to Excel",
      value: 1,
      label: 1,
    },
    {
      text: "Export to PDF",
      value: 2,
      label: 2,
    },
  ];

  const setRange = (range) => {
    setPerPage(range);
    changePage("1", range);
  };
  const changePage = (from, range = perPage) => {
    params.getBranchTransactions(props.branchNumber, from, range);
    setLinkProcess(false);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  });

  const filterById = (data, id) => {
    return data.find((x, index) => id + "" === x.branchNumber);
  };

  let headers = [
    { label: "Gateway ResponseCode", key: "gatewayResponseCode" },
    { label: "Status", key: "gatewayResponseMessage" },
    { label: "Time", key: "transactionTimeString" },
    { label: "Currency", key: "currency" },
    { label: "Original Amount", key: "amount" },
    { label: "Settlement Amount", key: "settlementAmount" },
    { label: "Fee", key: "transactionFee" },
    { label: "Reference", key: "linkingRef" },
    { label: "Merchant Reference", key: "transactionRef" },
    { label: "Product ID", key: "productId" },
    { label: "Customer Name", key: "customer.customerName" },
    { label: "Customer Phone No", key: "customer.customerPhone" },
    { label: "Customer Email", key: "customer.customerEmail" },
    { label: "Description", key: "transactionDescription" },
    { label: "Country", key: "analytics.country" },
    { label: "Bank", key: "analytics.bank" },
    { label: "Channel", key: "analytics.channel" },
    { label: "Channel Type", key: "analytics.channelType" },
  ];
  if (
    params.business_details.invoice &&
    params.business_details.invoice.active
  ) {
    const data = [
      { label: "Branch Reference", key: "branchReference" },
      { label: "Invoice Number", key: "invoiceNumber" },
      { label: "Branch Phone Number", key: "branchLocationPhoneNo" },
    ];

    headers.push(...data);
  }
  useEffect(() => {
    params.getBranchTransactions(props.branchNumber);
    if (params.branch_summary)
      setSummary(
        filterById(params.branch_summary.payload, params.branch_summary.paylod)
      );
  }, []);

  useEffect(() => {
    if (params.location === "payment_link") {
      cogoToast.success("created successful", {
        position: "top-right",
      });
      setLinkProcess(false);
    }
    if (
      props.error_details &&
      props.error_details.error_source === "payment_link"
    ) {
      cogoToast.error(props.error_details.message || "action not completed", {
        position: "top-right",
      });
      setLinkProcess(false);
    }
  }, [params.location, props.error_details]);

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(params.branch_transactions)) setLoading(false);
    if (!isEmpty(params.error_details)) setLoading(false);
  }, [params.branch_transactions, params.error_details]);

  let transactions_array = [
    [
      { text: "Status", style: "tableHeader" },
      { text: "Time Stamp", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
      { text: "Reference", style: "tableHeader" },
      { text: "Customer", style: "tableHeader" },
    ],
    [
      { pointer: "gatewayResponseMessage" },
      { pointer: "transactionTimeString" },
      { pointers: ["currency,amount", " "] },
      { pointer: "transactionRef" },
      {
        pointers: [
          "customer.customerName,customer.customerEmail,customer.customerPhone",
          "\n",
        ],
      },
    ],
  ];

  const downloadTemplate = (option) => {
    if (!option.value) {
      return option.text;
    } else {
      if (option.value === 1)
        return (
          <div className="my-1 font-12 font-weight-bold">
            <CSVLink
              data={
                (params.branch_transactions &&
                  params.branch_transactions.payload) ||
                []
              }
              headers={headers}
              filename={`${new Date().getTime()}-branch-transaction.csv`}
              className=""
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
                (params.branch_transactions &&
                  params.branch_transactions.payload) ||
                [],
                transactions_array
              )
            }
          >
            {option.text}
          </div>
        );
    }
  };

  const handleCopy = (e, props) => {
    e.preventDefault();
    cogoToast.success(`Copied Successfully`, { position: "top-right" });
    const textField = document.createElement("textarea");
    textField.innerText = props;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  return (
    <>
      {!show_overview && (
        <Wrapper className="sbt-table">
          <NavMenuItem className="py-5">
            <CloseTag
              onClick={() => {
                close();
                clear();
              }}
            >
              <LeftChevron/>
              <span className="ml-1 mb-2">return to branches</span>
            </CloseTag>
            <div className="font-medium pb-3 font-20 text-black">
              {props.branchName}'s Transactions{" "}
              <Counter>
                TOTAL{" "}
                {params.branch_transactions &&
                  params.branch_transactions.rowCount
                  ? params.branch_transactions.rowCount
                  : 0}
              </Counter>
            </div>
            <Gap>
              <div classNam="container-fluid">
                <div className="row">
                  <div
                    className="col-md-4 col-lg-3"
                  // style={{ backgroundColor: '#fcfcff' }}
                  >
                    {/* <div className='paymentstate-box row py-2 border br-normal'>
											<div className='col-12'>
												<div className='text-center'>
													<br />
													<div className='font-weight-bold sbt-deep-color font-18'>
														{'NOT_AVAILABLE '}
														{"NGN"} {formatter.format("1333000")}
													</div>
													<small className='text-muted'>
														Total Transaction amount
													</small>
												</div>
											</div>
										</div> */}
                  </div>
                  <div className="offset-md-4 offset-lg-5 col-md-4">
                    <RightComponent>
                      <div className="row">
                        <Button
                          variant="xdh"
                          height={"40px"}
                          className="brand-btn"
                          style={{ width: "200px" }}
                          onClick={(e) => showPaymentLink(true)}
                        >
                          Generate payment link
                        </Button>
                        <Can access="EXPORT_MERCHANT_REPORT">
                          <span className="font-12 font-light px-3 export_data">
                            <Dropdown
                              optionLabel="text"
                              value={expt}
                              options={exports}
                              onChange={(e) => {
                                setExport(e.target.value);
                              }}
                              itemTemplate={downloadTemplate}
                              placeholder="Export Data"
                              className="font-12 text-left w-200px sbt-border-success py-2"
                            />
                          </span>
                        </Can>
                      </div>
                    </RightComponent>
                  </div>
                </div>
              </div>
              {showFilter && <Filter />}
            </Gap>
            <Table
              loading={loading}
              data={
                (params.branch_transactions &&
                  params.branch_transactions.payload) ||
                []
              }
              totalRecords={
                (params.branch_transactions &&
                  params.branch_transactions.rowCount) ||
                0
              }
              setRange={(len) => setRange(len)}
              perPage={perPage}
              currentpage={
                (params.branch_transactions &&
                  params.branch_transactions.currentPage) ||
                "0"
              }
              changePage={(page) => {
                changePage(page);
              }}
              header={[
                {
                  name: "Customer Name",
                  pointer: "customer.customerName",
                  copy: true,
                  func: (props) => (
                    <span>{props !== null ? props : "Not Available"}</span>
                  ),
                },
                {
                  name: "Reference",
                  pointer: "",
                  copy: true,
                  func: (props) => (
                    <span className="row p-0 m-0">
                      <div
                        onClick={() => {
                          setShowOverview(props);
                          setTransactionData(props);
                        }}
                        className="cut-text seerbit-color cursor-pointer"
                      >
                        {props.transactionRef}
                      </div>
                      <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                          handleCopy(e, props.transactionRef);
                        }}
                      />
                    </span>
                  ),
                },
                {
                  name: "Amount",
                  pointer: "",
                  func: (prop) => (
                    <span
                      className={` mb-1 ${prop.refundList && prop.refundList.length > 0
                        ? "refund"
                        : (props.gatewayResponseMessage === "APPROVED" ||
                          props.gatewayResponseMessage === "Successful") &&
                          (props.gatewayResponseCode === "00") &&
                          (props.status === "COMPLETED" || props.status === "SETTLED")
                          ? "success"
                          : ["SM_X23", "SM_A"].indexOf(
                            prop.gatewayResponseCode
                          ) > -1
                            ? "default"
                            : "failed"
                        }-transaction`}
                    >
                      <div className="cut-text">
                        {prop.currency} {formatNumber(prop.amount)}
                      </div>
                    </span>
                  ),
                },
                {
                  name: "Channel",
                  pointer: "",
                  func: (prop) => (
                    <span className="number">
                      <img
                        width="25px"
                        height="auto"
                        src={
                          prop.analytics.channel === "account" ||
                            prop.analytics.channel === "ACCOUNT"
                            ? Bank
                            : prop.analytics.channelType == "master"
                              ? Mastercard
                              : prop.analytics.channelType == "visa"
                                ? Visa
                                : prop.analytics.channelType == "verve"
                                  ? Verve
                                  : prop.analytics.channel === "card"
                                    ? Mastercard
                                    : Exchange
                        }
                        className="mr-2 mb-1"
                      />
                      {prop.analytics.channel === "card"
                        ? prop.maskNumber &&
                        prop.maskNumber.substring(prop.maskNumber.length - 9)
                        : prop.analytics.channel === "account" ||
                          prop.analytics.channel === "ACCOUNT"
                          ? prop.analytics.channelType
                          : prop.analytics.channel}
                    </span>
                  ),
                },
                {
                  name: "Date",
                  pointer: "transactionTimeString",
                  format: "Y-MM-DD hh:mm:ss A",
                },
                {
                  name: "Status",
                  pointer: "",
                  func: (prop) => {
                    return (
                      <span
                        className={` mb-1 ${prop.refundList && prop.refundList.length > 0
                          ? "refund"
                          : prop.gatewayResponseMessage === "APPROVED"
                            ? "success"
                            : ["SM_X23", "SM_A"].indexOf(
                              prop.gatewayResponseCode
                            ) > -1
                              ? "default"
                              : "failed"
                          }-transaction`}
                      >
                        {prop.refundList && prop.refundList.length > 0
                          ? "Refunded"
                          : (prop.gatewayResponseMessage === "APPROVED" ||
                            prop.gatewayResponseMessage === "Successful") &&
                            (prop.gatewayResponseCode === "00") &&
                            (prop.status === "COMPLETED" || prop.status === "SETTLED")
                            ? "Successful"
                            : props.gatewayResponseCode === "SM_X23"
                              ? "Expired"
                              : props.gatewayResponseCode === "SM_A"
                                ? "Aborted"
                                : "Failed"
                        }
                      </span>
                    );
                  },
                },
              ]}
              onRowClick={onRowClick}
            />
          </NavMenuItem>
          {payment_link && (
            <CheckoutLink
              payment_link={
                params.location === "payment_link" && params.payment_link
              }
              paymentLink={params.paymentLink}
              linkProcess={linkProcess}
              setLinkProcess={setLinkProcess}
              business_details={params.business_details}
              branchNumber={props.branchNumber}
              branchReferenceNumber={props.branchReferenceNumber}
              close={() => {
                showPaymentLink(false);
                params.setErrorLog();
              }}
            />
          )}
        </Wrapper>
      )}
      {show_overview && (
        <div className="">
          <Overview
            props={transaction_data}
            setShowOverview={() => setShowOverview(false)}
          // addRefund={(params) => props.addRefund(params)}
          // refund_success={refund_success}
          // closeSuccess={() => setRefundSuccess(false)}
          // replyDispute={props.replyDispute}
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  branch_transactions: state.data.branch_transactions,
  branch_summary: state.data.branch_summary,
  business_details: state.data.business_details,
  payment_link: state.data.payment_link,
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  getBranchTransactions,
  paymentLink,
  setErrorLog,
})(BranchDetails);
