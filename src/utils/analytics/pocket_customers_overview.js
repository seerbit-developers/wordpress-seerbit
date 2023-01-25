/** @format */

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import PrintPDf from "../downloadPdf";
import PocketTransactions from "../../modules/pocket_transactions";
import Loader from "../../assets/images/svg/loader.svg";
import "./css/sbt-table.scss";
import styled from "styled-components";
import AppTable from "components/app-table";

const Wrapper = styled.div`
  background: #fff;
`;

const NavMenuItem = styled.div`
  // width: 95vw;
  margin: auto;
  font-size: 1.1em;
  color: #676767 !important;
  // min-height: calc(100vh - 80px);
`;

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

const Counter = styled.span`
  color: #bababa;
  font-size: 12px;
  font-weight: 400;
`;

export function Overview({
  creditData,
  close,
  business_details,
  loading,
  activeTab,
  pocketReferenceId,
  type,
}) {
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

  const headers_credit = [
    { label: "Date", key: "payout.requestDate" },
    { label: "Reference", key: "payout.transactionReference" },
    { label: "Amount", key: "payout.amount" },
    { label: "Currency", key: "currency" },
    { label: "Charge Fees", key: "payout.charge" },
    { label: "Balanace", key: "currentBalance" },
    { label: "Transfer Source", key: "payout.fundingSource" },
    { label: "Status", key: "status" },
  ];

  let transactions_array_credit = [
    [
      { text: "Date", style: "tableHeader" },
      { text: "Reference", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
      { text: "Currency", style: "tableHeader" },
      { text: "Charge Fees", style: "tableHeader" },
      { text: "Balanace", style: "tableHeader" },
      { text: "Transfer Source", style: "tableHeader" },
      { text: "Status", style: "tableHeader" },
    ],
    [
      { pointer: "payout.requestDate" },
      { pointer: "payout.transactionReference" },
      { pointer: "currency" },
      { pointer: "payout.amount" },
      { pointer: "payout.charge" },
      { pointer: "currentBalance" },
      { pointer: "payout.fundingSource" },
      { pointer: "status" },
    ],
  ];

  const [fullColumns] = React.useState([
    {
      name: "Date",
      style: { width: "200px" },
      // cell: (props) => (
      //   <span
      //     className="seerbit-color cursor-pointer"
      //     onClick={() => {
      //       setType("ALL");
      //       setOverview(true);
      //       setPocketReferenceId(props.pocketReferenceId);
      //       getCustomerTransactions(props.pocketReferenceId, "ALL");
      //     }}
      //   >{`${props.firstName} ${props.lastName}`}</span>
      // ),
    },
    {
      name: "Reference",
      // cell: (row) => (
      //   <div className="d-flex flex-column">
      //     <span className="">{row.emailAddress.substr(0, 16)}</span>
      //     <span>{row.phoneNumber}</span>
      //   </div>
      // ),
    },

    // {
    //   name: "Email",
    //   style: { width: '200px' },
    //   cell: (props) => <span>{props.emailAddress}</span>,
    // },
    {
      name: "Activity",
      pointer: "",
      // cell: (props) => (
      //   <span className="row p-0 m-0">
      //     <div className="cut-text-1">{props.pocketReferenceId}</div>
      //     <img
      //       src={Copy}
      //       width="15"
      //       height="15"
      //       className="cursor-pointer"
      //       onClick={(e) => {
      //         handleCopy(e, props.pocketReferenceId);
      //       }}
      //     />
      //   </span>
      // ),
      // copy: true,
    },
    {
      name: "Narration",
      // pointer: "",
      // cell: (props) => (
      //   <span className="row p-0 m-0">
      //     <div className="cut-text-1 ">{props.pocketAccountNumber}</div>
      //     <img
      //       src={Copy}
      //       width="15"
      //       height="15"
      //       className="cursor-pointer"
      //       onClick={(e) => {
      //         handleCopy(e, props.pocketAccountNumber);
      //       }}
      //     />
      //   </span>
      // ),
      // copy: true,
    },
    // {
    //   name: "Bank Name",
    //   // pointer: "",
    //   // cell: (props) => (
    //   //   <span className="row p-0 m-0">
    //   //     {createBankName(props && props.pocketAccountNumber)}
    //   //   </span>
    //   // ),
    //   // copy: true,
    // },
    // {
    //   name: "Phone Number",
    //   pointer: "phoneNumber",
    // },
    {
      name: "Amount",
      pointer: "",
      // cell: (props) => (
      //   <div className="cut-text">
      //     {props.currency} {formatNumber(props.balance)}
      //   </div>
      // ),
    },
    {
      name: "Balance After",
      // pointer: "",
      // cell: (props) => (
      //   <span className="row p-0 m-0">
      //     {createBankName(props && props.pocketAccountNumber)}
      //   </span>
      // ),
      // copy: true,
    },
    {
      name: "Status",
      style: { width: "180px", paddingRight: "15px", textAlign: "left" },
      // cell: data => <span>{moment(data.createdAt).format("Y-MM-DD hh:mm:ss A")}</span>
    },
  ]);



  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={
              (creditData &&
                creditData.payload &&
                creditData.payload.accountHistory) ||
              []
            }
            headers={headers_credit}
            filename={`${new Date().getTime()}-pocket_transactionss.csv`}
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
              (creditData &&
                creditData.payload &&
                creditData.payload.accountHistory) ||
                [],
              transactions_array_credit
            )
          }
        >
          {option.text}
        </div>
      );
  };


  return (
    <Wrapper className="sbt-transaction">
      <NavMenuItem className="py-5">
        <CloseTag onClick={() => close()} className="mb-3">
          <FontAwesomeIcon icon={faChevronLeft} className="my-1" />{" "}
          <span className="ml-1 mb-2">return to customers</span>
        </CloseTag>
        <div className="font-medium pb-1 font-20 text-black">
          {creditData && creditData.payload && creditData.payload.account
            ? `${creditData.payload.account.firstName}'s`
            : ""}{" "}
          Pocket Transactions &nbsp;&nbsp;{" "}
          <Counter>
            TOTAL TRANSACTION &nbsp;&nbsp;{" "}
            {(creditData && creditData.rowCount) || 0}
          </Counter>
        </div>

        <div className="col-6 m-0 p-0">
          <div
            className="paymentstate-box row p-3 ml-0 my-4 border br-normal"
            style={{ width: "350px" }}
          >
            <div className="font-medium pb-3 font-20 text-black">
              <span className="row">
                <div>
                  <div className="px-3">
                    <div>
                      <Counter>Current Balance</Counter>
                    </div>
                    {`${business_details.default_currency || ""} 
                    ${
                      (creditData &&
                        creditData.payload &&
                        creditData.payload.account &&
                        Number(creditData.payload.account.balance)) ||
                      0
                    }`}
                  </div>
                </div>
                <div class="vertical-divider mx-3 mt-3"></div>
                <div>
                  <div className="pl-3">
                    <div>
                      <Counter>Last Transfer</Counter>
                    </div>
                    {`${business_details.default_currency || ""} 
                    ${
                      (creditData &&
                        creditData.payload &&
                        creditData.payload.account &&
                        Number(creditData.payload.account.lastBalance)) ||
                      0
                    }`}
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="my-4">
          <div className="d-flex justify-content-end">
            <RightComponent className="row p-0 m-0 sbt-filter">
              <span className="font-12 font-light export_data">
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
                  showClear={true}
                />
              </span>
            </RightComponent>
          </div>
        </div>
        <div>
          {/* <AppTable columns={fullColumns} /> */}
          <PocketTransactions
            activeTab={activeTab}
            data={(creditData && creditData) || []}
            business_details={business_details}
            type={type}
            pocketReferenceId={pocketReferenceId}
            loading={loading}
          />
          {!creditData && (
            <div className="d-flex justify-content-center mt-3">
              <img src={Loader} width="100" />
            </div>
          )}
        </div>
      </NavMenuItem>
    </Wrapper>
  );
}

export default Overview;
