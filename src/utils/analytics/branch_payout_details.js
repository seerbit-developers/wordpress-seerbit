/** @format */

import React, {useState, useEffect } from "react";
import { connect } from "react-redux";
import { clearState } from "../../actions/postActions";
// import Table from "./table";
import { CSVLink } from "react-csv";
// import PrintPDf from "../downloadPdf";
import { Can } from "../../modules/Can";
import { Dropdown } from "primereact/dropdown";
import { isEmpty } from "lodash";
import Details from "./settlement_details";
import transactions_json from "../strings/transaction.json";
import Copy from "assets/images/svg/copy.svg";
import Bank from "assets/images/svg/bank-icon.svg";
import cogoToast from "cogo-toast";
import "./css/sbt-table.scss";
import styled from "styled-components";
import LeftChevron from "../../assets/images/svg/leftChevron";
import AppTable from "components/app-table";
import moment from "moment";
import useWindowSize from "../../components/useWindowSize";

const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;


function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function BranchPayoutDetails({
  props,
  close,
  branch_settlements,
  getBranchSettlementTransactions,
  settlement_transactions,
  error_details,
  clear,
  clearState,
}) {
  const exports = transactions_json.exports_branch_settlements;
  const [expt, setExport] = useState();
  const [show_details, setShowDetails] = useState(false);
  const [payout_data, setPayoutData] = useState();
  const [loading, setLoading] = useState(false);
  const size = useWindowSize()
  const { width, height } = size;

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(branch_settlements)) setLoading(false);
    if (!isEmpty(error_details)) setLoading(false);
  }, [branch_settlements, error_details]);

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

  const onRowClick = (e) => {
    const { settlementCycleRef, branchSBTLocationRef } = e;
    getBranchSettlementTransactions({
      cycleRef: settlementCycleRef,
      branchRef: branchSBTLocationRef,
    });
    setShowDetails(true);
    setPayoutData(e);
  };
  const downloadTemplate = (option) => {
    if (!option.value) {
      return null
    } else {
      if (option.value === 1)
      {
        return (
            <div className="my-1 font-12 font-weight-bold">
              <CSVLink
                  data={branch_settlements}
                  headers={headers}
                  filename={`${new Date().getTime()}-transactions.csv`}
                  className=""
              >
                <span style={{ color: "#333333" }}>{option.text}</span>
              </CSVLink>
            </div>
        );
      }else{
        return null
      }
    }
  };

  const [fullColumnsTransactions] = React.useState([
    {
      name: 'Branch Reference',
      style: { width: '200px' },
      cell: props => <span className="row p-0 m-0 d-flex align-items-center">
      <div className="seerbit-color cursor-pointer pr-2" onClick={() => onRowClick(props)}>{props.branchSBTLocationRef}</div>
      <img
      src={Copy}
      width="15"
      height="15"
      className="cursor-pointer"
      onClick={(e) => {
      handleCopy(e, props.branchSBTLocationRef);
      }}
      />
      </span>
    },
    {
      name: 'Total Amount',
      style: { width: '200px' },
      cell: props => <span>
                      <div className="cut-text">
                        {props.settlementCurrency}{" "}
                        {formatNumber(props.originalAmount)}
                      </div>
                    </span>
    },
    {
      name: 'Settled Amount',
      cellStyle: { textAlign: 'left' },
      style: { width: '120px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <span
                className="seerbit-color cursor-pointer"
                onClick={() => onRowClick(props)}
            >
                      <div className="cut-text">
                        {props.settlementCurrency}{" "}
                        {formatNumber(props.settlementAmount)}
                      </div>
                    </span>
        )
      }
    },
    {
      name: 'Fee',
      cellStyle: { textAlign: 'left' },
      style: { width: '120px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <span className="number">
                        {" "}
              <div className="cut-text">
                          {props.settlementCurrency} {formatNumber(props.fee)}
                        </div>
                      </span>
        )
      }
    },
    {
      name: 'Status',
      style: { width: '250px', paddingRight: '15px', textAlign: 'left' },
      selector:'status'
    },
    {
      name: 'Date',
      cellStyle: { textAlign: 'right',paddingRight: '5px', },
      style: { width: '180px', textAlign: 'right' },
      cell: data => <span>{moment(data.transactionTimeString).format("DD-MM-yyyy, hh:mm A")}</span>
    },
  ]);
  const [columnsMobile] = React.useState([
    {
      name: 'Settled Amount',
      cellStyle: { textAlign: 'left' },
      style: { width: '120px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <span
                className="seerbit-color cursor-pointer"
                onClick={() => onRowClick(props)}
            >
                      <div className="cut-text">
                        {props.settlementCurrency}{" "}
                        {formatNumber(props.settlementAmount)}
                      </div>
                    </span>
        )
      }
    },
    {
      name: 'Fee',
      cellStyle: { textAlign: 'left' },
      style: { width: '120px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <span className="number">
                        {" "}
              <div className="cut-text">
                          {props.settlementCurrency} {formatNumber(props.fee)}
                        </div>
                      </span>
        )
      }
    },
    {
      name: 'Date',
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span>{moment(data.transactionTimeString).format("DD-MM-yyyy, hh:mm A")}</span>
    },
  ]);
  return (
    <>
      {!show_details && (
        <div className="page-container py-5">
          <div className="py-5">
            <div onClick={(e) => {
              clearState({ settlement_transactions: null });
              close();
            }} className="backk pb-5">
              <LeftChevron /> return to settlements
            </div>
            <div className="font-medium pb-3 font-20 text-black">
              Branch Settlement{" "}
            </div>
            <Gap>
              <div className="d-flex justify-content-end">
                    <Can access={"EXPORT_MERCHANT_REPORT"}>
                      <span className="d-none d-sm-block font-12 font-light px-3 export_data">
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
                    </Can>
              </div>
            </Gap>
            {
              width >= 991 ?
                  <AppTable
                      columns={fullColumnsTransactions}
                      headerStyle={{textTransform: 'uppercase'}}
                      loading={loading}
                      paginate={false}
                      data={branch_settlements}
                  />
                  :
                  <AppTable
                      columns={columnsMobile}
                      headerStyle={{textTransform: 'uppercase'}}
                      loading={loading}
                      paginate={false}
                      data={branch_settlements}
                  />
            }

          </div>
        </div>
      )}
      {show_details && (
        <div>
          <Details
            props={payout_data}
            close={() => setShowDetails(false)}
            settlement_transactions={settlement_transactions || []}
            error_details={error_details}
            clearTransaction={() =>
              clearState({ settlement_transactions: null })
            }
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {
  clearState,
})(BranchPayoutDetails);
