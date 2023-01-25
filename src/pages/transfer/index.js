/** @format */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getWalletTransaction,
  walletTopUp,
  setErrorLog,
  clearState,
} from "actions/postActions";
import cogoToast from "cogo-toast";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import { Button } from "react-bootstrap";
// import PocketTransfer from "../../modules/transfer_fund";
import { isEmpty } from "lodash";
import TransferDetails from "../../modules/transfer_details";
import PocketTransferModal from "./components/transferModal";
import styled from "styled-components";
import "./css/wallet.scss";
import { Debit } from "./debit";
import {alertError, alertSuccess} from "../../modules/alert";

const Wrapper = styled.div`
  background: #fff;
  // width: 100vw;
  padding-left: 3em;
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


function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function TransferPage(props) {
  const [perPage, setPerPage] = useState(25);
  const [expt, setExport] = useState(); //exports[0].value
  const [show_transfer, setTransfer] = useState(false);
  const [topUpProcessing, setTopUpProcessing] = useState(false);
  const [process, setProcessing] = useState(false);
  const [categorizedTransactions, setCategorizedTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show_overview, setOverview] = useState(false);
  const [details, setDetails] = useState([]);

  const exports = [
    {
      text: "Export to Excel",
      value: 1,
      label: 1,
    },
  ];

  const onRowClick = (e) => {
    console.log(e);
  };

  const changePage = (from = 1) => {
    props.getWalletTransaction({
      type: "DEBIT",
      start: from,
      size: perPage,
    });
    setProcessing(true);
  };

  useEffect(() => {
    if (props.error_details && props.location === "wallets") {
      cogoToast.error(props.error_details.message, {
        position: "top-right",
      });
    }
  }, [props.error_details]);

  const headers = [
    { label: "Date", key: "payout.requestDate" },
    { label: "Reference", key: "payout.transactionReference" },
    { label: "Currency", key: "payout.currency" },
    { label: "Amount", key: "payout.amount" },
    { label: "Remarks", key: "remarks" },
    { label: "Last Balance", key: "lastBalance" },
    { label: "Transaction Type", key: "type" },
    { label: "Status", key: "status" },
  ];



  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={(categorizedTransactions && categorizedTransactions) || []}
            headers={headers}
            filename={`${new Date().getTime()}-product_category.csv`}
          >
            <span style={{ color: "#333333" }}>{option.text}</span>
          </CSVLink>
        </div>
      );
  };

  useEffect(() => {
    props.getWalletTransaction({
      type: "DEBIT",
      start: 1,
      size: perPage,
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(props.wallets)) {
      props.wallets.payload.accountHistory &&
        createCategorizedData(props.wallets.payload.accountHistory);
    }
  }, [props.wallets]);

  useEffect(() => {
    if (props.wallets && props.location === "wallet-top-up") {
      setTopUpProcessing(false);
      alertSuccess(props.wallet.message);
    }
    if (
      props.error_details &&
      props.error_details.error_source === "wallet-top-up"
    ) {
      setTopUpProcessing(false);
      alertError(props.error_details.message || "Can't complete action at the moment");
    }
    setProcessing(false);
  }, [
    props.wallet,
    props.email_report,
    props.location,
    props.error_details,
    props.wallets,
  ]);

  const createCategorizedData = (data = []) => {
    if (!isEmpty(data)) {
      let categorizedTransactions = data.map((transaction, id) => {
        const pocketCustomerDetail = !isEmpty(transaction.fundingSource)
          ? transaction.fundingSource.split("(")
          : "";

        const isBankTransaction = !isEmpty(
          transaction.payout.receiverAccountNumber
        );

        const referenceId =
          !isEmpty(pocketCustomerDetail[1]) &&
          pocketCustomerDetail[1].replace(")", "");

        const bankAccount = transaction.payout.receiverAccountNumber;

        const bankAccountName = transaction.payout.receiverAccountName;

        return {
          ...transaction,
          id: id,
          type: !isBankTransaction
            ? transaction.payout.fundingSource === "Pocket charge"
              ? "Transaction Charge"
              : "Pocket Transaction"
            : "Bank Transaction",
          remarks: !isBankTransaction
            ? transaction.payout.fundingSource === "Pocket charge"
              ? `Charge on transaction`
              : `Pocket to Pocket Transfer made to ${pocketCustomerDetail[0]} with referenceId ${referenceId}`
            : `Pocket to Bank Transfer made to ${bankAccountName} with account number ${bankAccount}`,
          recipientAccount: !isBankTransaction ? referenceId : bankAccount,
          recipientName: !isBankTransaction
            ? !isEmpty(pocketCustomerDetail) && pocketCustomerDetail[0]
            : bankAccountName,
        };
      });
      setCategorizedTransactions(categorizedTransactions);
    }
  };

  const setRange = (page = perPage) => {
    props.getWalletTransaction({ size: page, start: 1, type: "DEBIT" });
    setProcessing(true);
  };

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.wallets)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.wallets, props.error_details]);

  return (
      <div className="page-container py-5">
      <PocketTransferModal
        isOpen={show_transfer}
        close={(v) => setTransfer(v)}
        walletTopUp={props.walletTopUp}
        wallet={props.wallets}
        business_details={props.business_details}
        inProcess={topUpProcessing}
        setInProcess={setTopUpProcessing}
        getWalletTransaction={() =>
          props.getWalletTransaction({
            type: "DEBIT",
            start: 1,
            size: perPage,
          })
        }
        location={props.location}
      />
      <NavMenuItem>
        <div className="font-medium pb-3 font-20 text-black">
          Pocket Outflow
          <Counter>
            Transfer History {(props.wallets && props.wallets.rowCount) || 0}
          </Counter>
        </div>
        <Gap>
          <div className="container-fluid">
            <div className="row">
              <div className="">
                <div
                  className="paymentstate-box row px-2 py-3 ml-0 border br-normal hisx-boxx"
                  // style={{ width: "374px", height: "100px" }}
                >
                  <div className="col-6 xhxx">
                    <div className="tiltx">
                      <small className="text-muted font-12">
                        {props.business_details.default_currency} Pocket Balance
                      </small>
                      <div className="font-weight-bold sbt-deep-color font-18">
                        {formatNumber(
                          (props.wallets &&
                            props.wallets.payload &&
                            props.wallets.payload.account &&
                            props.wallets.payload.account.balance) ||
                            0
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 cbxx">
                    <div className="text-center py-4">
                      <Button
                        variant="xdh"
                        height={"30px"}
                        className="brand-btn font-11"
                        style={{ width: "130px", minHeight: "30px" }}
                        onClick={(e) => {
                          setTransfer(true);
                        }}
                      >
                        Transfer fund
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <RightComponent className="py-3 mb-2">
              <div className="row">
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
                    className="font-12 text-left w-200px sbt-border-success py-1"
                    showClear={true}
                  />
                </span>
              </div>
            </RightComponent>
          </div>
        </Gap>

        <div className="col p-0" style={{ marginTop: "50px"}}>
          <Debit
            loading={loading}
            setRange={setRange}
            props={props.wallets}
            categorizedTransactions={categorizedTransactions}
            headers={headers}
            setTransfer={setTransfer}
            show_transfer={show_transfer}
            perPage={perPage}
            setPerPage={setPerPage}
            changePage={changePage}
            onRowClick={onRowClick}
            setDetails={setDetails}
            setOverview={setOverview}
            currency={props.business_details.default_currency}
            currentPage={
              !isEmpty(props.wallets)
                  ? props.wallets.currentPage + 1
                  : 1
            }
          />
        </div>
      </NavMenuItem>

      {show_overview && (
        <TransferDetails
          isOpen={show_overview}
          close={() => {
            setOverview(false);
            setTransfer(false);
            props.clearState({ error_details: null });
            props.clearState({ transfer_name_inquiry: null });
            window.stop();
          }}
          details={details}
          business_details={props.business_details}
          location={props.location}
          getWalletTransaction={() =>
            props.getWalletTransaction({
              type: "DEBIT",
              start: 1,
              size: perPage,
            })
          }
        />
      )}
    </div>
  );
}

TransferPage.propTypes = {
  getWalletTransaction: PropTypes.func.isRequired,
  walletTopUp: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  location: state.data.location,
  wallet: state.data.wallet,
  wallets: state.data.wallets,
  wallet_payouts: state.data.wallet_payouts,
});

export default connect(mapStateToProps, {
  getWalletTransaction,
  walletTopUp,
  setErrorLog,
  clearState,
})(TransferPage);
