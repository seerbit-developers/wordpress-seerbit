/** @format */

import React, { useState } from "react";
// import moment from "moment";
import cogoToast from "cogo-toast";
import Copy from "../assets/images/svg/copy.svg";
import { Dropdown } from "primereact/dropdown";
// import { DebounceInput } from "react-debounce-input";
import { CSVLink } from "react-csv";
import PrintPDf from "../utils/downloadPdf";
import Overview from "../utils/analytics/transaction_overview";
import { Can } from "./Can";

import Table from "../utils/analytics/table";
import styled from "styled-components";

import transactions_export from "../utils/strings/transaction_export.json";
import transactions_json from "../utils/strings/transaction.json";
import Mastercard from "../assets/images/svg/mastercard-icon.svg";
import Bank from "../assets/images/svg/bank-icon.svg";
import Visa from "../assets/images/svg/visa-icon.svg";
import Verve from "../assets/images/verve.png";
import Exchange from "../assets/images/svg/transfer-icon.svg";

import "./css/module.scss";

const Wrapper = styled.div`
  background: #fff;
`;

const NavMenuItem = styled.div`
  padding: 3.5em 4.5em 3.5em 0em;
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

const Label = styled.div`
  font-size: 12px;
  line-height: 2;
  margin-right: 6em;
  width: 150px;
`;

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function TransactionPage({ props }) {
  const exports = transactions_json.exports_type;
  const [transaction_status, setTransactionStatus] = useState("ALL");
  const [active_option, setActiveOption] = useState("default");
  const [perPage, setPerPage] = useState(25);
  const [date_value, setDateValue] = useState(0);
  const [search_term, setSearchTerms] = useState();
  const [processing, setProcessing] = useState();
  const [show_fliter, setShowFilter] = useState(false);
  const [dates, setDates] = useState([]);
  const [expt, setExport] = useState(); //exports[0].value
  const [transaction_data, setTransactionData] = useState();
  const [show_overview, setShowOverview] = useState();
  const [refund_success, setRefundSuccess] = useState(false);

  const onRowClick = () => { };

  const changePage = (from = 1, status = transaction_status) => {
    props.getTransactions(from, perPage, status);
    setProcessing(true);
  };

  const mapTrans = props.transactionList.map((x) => {
    return {
      ...x,
      refundValue:
        x.refundList && x.refundList.length > 0
          ? x.settlementAmount >= x.refundList[0].amount
            ? x.refundList[0].amount
            : x.settlementAmount
          : 0,
      refundDate:
        x.refundList && x.refundList.length > 0
          ? x.refundList.created_at
          : null,
    };
  });
  let headers = transactions_export.default;

  if (props.invoice && props.invoice.active) {
    headers.push(...transactions_export.branch);
  }

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
              data={mapTrans}
              headers={headers}
              filename={`${new Date().getTime()}-customer-transactions.csv`}
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
              PrintPDf(props.transactionList || [], transactions_array)
            }
          >
            {option.text}
          </div>
        );
    }
  };

  const transactionChannel = (props) => {
    try {
      return (
        <span className="number">
          <img
            width="25px"
            height="auto"
            src={
              props.analytics.channel === "account" ||
                props.analytics.channel === "ACCOUNT"
                ? Bank
                : props.analytics.channelType &&
                  props.analytics.channelType
                    .toLowerCase()
                    .indexOf("master") !== -1
                  ? Mastercard
                  : props.analytics.channelType &&
                    props.analytics.channelType.toLowerCase().indexOf("visa") !==
                    -1
                    ? Visa
                    : props.analytics.channelType &&
                      props.analytics.channelType.toLowerCase().indexOf("verve") !==
                      -1
                      ? Verve
                      : props.analytics.channel &&
                        props.analytics.channel.toLowerCase().indexOf("card") !== -1
                        ? cardQuickDection(props.maskNumber)
                        : Exchange
            }
            className="mr-2 mb-1"
          />
          {props.analytics.channel &&
            props.analytics.channel.toLowerCase().indexOf("card") !== -1
            ? props.maskNumber &&
            `xxxx ${props.maskNumber.substring(props.maskNumber.length - 4)}`
            : props.analytics.channel &&
              props.analytics.channel.toLowerCase().indexOf("account") !== -1
              ? props.analytics.channelType
              : props.analytics.channel}
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
        <Wrapper className="sbt-transaction">
          <Gap>
            <div classNam="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    {/* <Label className='px-3 fltr'>
											<Dropdown
												optionLabel='text'
												value={transaction_status}
												options={transactions_json.filter}
												onChange={(e) => {
													setTransactionStatus(e.value);
												}}
												className='font-12 w-150px sbt-border-success'
											/>
										</Label> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <RightComponent>
                    <div className="row">
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
                            className="sbt-border-success"
                            showClear={true}
                          />
                        </span>
                      </Can>
                    </div>
                  </RightComponent>
                </div>
              </div>
            </div>
          </Gap>
          <Table
            data={props.transactionList}
            perPage={perPage}
            changePage={(page) => {
              changePage(page);
            }}
            header={[
              {
                name: "Date",
                pointer: "transactionTimeString",
                format: "Y-MM-DD hh:mm:ss A",
              },
              {
                name: "Transaction Reference",
                pointer: "",
                copy: true,
                func: (data) => (
                  <span className="row p-0 m-0">
                    <div
                      onClick={(e) => {
                        setShowOverview(data);
                        setTransactionData(data);
                      }}
                      className="cut-text seerbit-color cursor-pointer"
                    >
                      {data.transactionRef}
                    </div>
                    <img
                      src={Copy}
                      width="15"
                      height="15"
                      className="cursor-pointer"
                      onClick={(e) => {
                        handleCopy(e, data.transactionRef);
                      }}
                    />
                  </span>
                ),
              },

              {
                name: "Amount",
                pointer: "",
                func: (props) => {
                  const preAuthType =
                    (props.preAuthType &&
                      props.preAuthType.replace("_", " ").toLowerCase()) ||
                    "";
                  const preAuthCapitalized =
                    preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
                  return (
                    <span
                      className={` mb-1 ${preAuthCapitalized && preAuthCapitalized === "Refund"
                        ? "refund"
                        : props.refundList && props.refundList.length > 0
                          ? "refund"
                          : (props.gatewayResponseMessage === "APPROVED" ||
                            props.gatewayResponseMessage === "Successful") &&
                            (props.gatewayResponseCode === "00") &&
                            (props.status === "COMPLETED" || props.status === "SETTLED")
                            ? "success"
                            : ["SM_X23", "SM_A"].indexOf(
                              props.gatewayResponseCode
                            ) > -1
                              ? "default"
                              : "failed"
                        }-transaction`}
                    >
                      <div className="cut-text">
                        {props.currency} {formatNumber(props.amount)}
                      </div>
                    </span>
                  );
                },
              },
              {
                name: "Channel",
                pointer: "",
                func: (props) => transactionChannel(props),
              },

              {
                name: "Status",
                pointer: "",
                func: (props) => {
                  const preAuthType =
                    (props.preAuthType &&
                      props.preAuthType.replace("_", " ").toLowerCase()) ||
                    "";
                  const preAuthCapitalized =
                    preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
                  return (
                    <span
                      className={` mb-1 e ${preAuthCapitalized && preAuthCapitalized === "Refund"
                        ? "refund"
                        : props.refundList && props.refundList.length > 0
                          ? "refund"
                          : (props.gatewayResponseMessage === "APPROVED" ||
                            props.gatewayResponseMessage === "Successful") &&
                            (props.gatewayResponseCode === "00") &&
                            (props.status === "COMPLETED" || props.status === "SETTLED")
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
                          : (props.gatewayResponseMessage === "APPROVED" ||
                            props.gatewayResponseMessage === "Successful") &&
                            (props.gatewayResponseCode === "00") &&
                            (props.status === "COMPLETED" || props.status === "SETTLED")
                            ? "Successful"
                            : props.gatewayResponseCode === "SM_X23"
                              ? "Expired"
                              : props.gatewayResponseCode === "SM_A"
                                ? "Aborted"
                                : "Failed"
                        : preAuthCapitalized &&
                          preAuthCapitalized !== "Noauth" &&
                          preAuthCapitalized !== "Refund" &&
                          preAuthCapitalized === "Cancel"
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
                    </span>
                  );
                },
              },
            ]}
            onRowClick={onRowClick}
          />
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

export default TransactionPage;
