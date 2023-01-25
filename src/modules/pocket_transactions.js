/** @format */

import React, { useState, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";
import { getPocketCustomerTransactions } from "../actions/postActions";
import Copy from "../assets/images/svg/copy.svg";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import AppTable from "components/app-table";
import Badge from "components/badge";
import {handleCopy} from "utils"
import "../pages/customer_pockets/css/customer_pockets.scss";

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

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function PocketTransactions(props) {
  const {
    data,
    getPocketCustomerTransactions,
    pocketReferenceId,
    business_details,
    type,
  } = props;
  const [perPage, setPerPage] = useState(25);
  const [categorizedTransactions, setCategorizedTransactions] = useState([]);

  useEffect(() => {
    data.payload && createCategorizedData(data.payload.accountHistory);
  }, [data.payload]);

  const createCategorizedData = () => {
    if (!isEmpty(data)) {
      let categorizedTransactions = [];
      categorizedTransactions = data.payload.accountHistory.map((list, id) => {
        return {
          ...list,
          currency: props.business_details.default_currency,
        };
      });
      setCategorizedTransactions(categorizedTransactions);
    }
  };


  const createDebitNarration = (data) => {
    if (!data.payout.receiverAccountNumber) {
      if (data.payout.fundingSource === "Pocket charge") {
        return "Pocket Transaction Charge";
      } else {
        return `Pocket to pocket transfer to ${data.payout.fundingSource}`;
      }
    } else {
      return `Pocket to bank transfer to (${data.payout.receiverAccountName} - ${data.payout.receiverAccountNumber})`;
    }
  };

  const createCreditNarration = (props) =>
    props && props.payout.senderDetails !== null
      ? props.payout.receiverAccountNumber === ""
        ? `${creditInfo(props.payout.fundingSource)} ${
            props.payout.senderDetails
          }`
        : `${creditInfo(props.payout.fundingSource)} ${
            props.payout.senderDetails
          } 
        (${
          props.payout.senderBankName !== null
            ? `${props.payout.senderBankName} - `
            : ""
        }${props.payout.receiverAccountNumber})`
      : `${creditInfo(props.payout.fundingSource)} ${
          props.payout.fundingSource
        }`;

  const creditInfo = (data) => {
    if (data === "Transfer") {
      return "Credit via bank transfer from";
    } else if (data !== null) {
      return "Credit via pocket transfer from";
    } else {
      return "";
    }
  };

  const [fullColumns] = React.useState([
    {
      name: "Date",
      cell: (data) => (
        <span>{moment(data.createdAt).format("Y-MM-DD hh:mm:ss A")}</span>
      ),
    },

    {
      name: "Reference",
      cell: (props) => (
        <span className="row p-0 m-0">
          <div className="cut-text seerbit-color">
            {props.payout.transactionReference}
          </div>
          <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
              handleCopy(props.payout.transactionReference);
            }}
          />
        </span>
      ),
    },
    {
      name: "Activity",
      cell: (props) =>
        props.type === "CR" ? (
          <Badge status={"success"}>CREDIT</Badge>
        ) : (
          <Badge status={"fail"}>DEBIT</Badge>
        ),
    },
    {
      name: "Narration",
      // cellStyle: { textAlign: 'left' },
      style: { width: "30%" },
      cell: (props) =>
        props.type === "CR" ? (
          <span>{createCreditNarration(props)}</span>
        ) : (
          <span>{createDebitNarration(props)}</span>
        ),
    },
    {
      name: "Amount",
      cell: (props) => (
        <div className="cut-text seerbit-color">
          {props.payout.currency || business_details.default_currency}{" "}
          {formatNumber(props.payout.amount)}
        </div>
      ),
    },
    {
      name: "Balance  After",
      cell: (props) => (
        <div className="cut-text">
          {props.payout.currency || business_details.default_currency}{" "}
          {formatNumber(props.currentBalance)}
        </div>
      ),
    },
    {
      name: "Status",
      cellStyle: { textAlign: 'right',width:'50px'  },
      style: { textAlign: 'right' },
      cell: (props) =>
        props.status === "SUCCESSFUL" ? (
          <Badge status={"success"}>{props.status}</Badge>
        ) : (
          <Badge status={"fail"}>{props.status}</Badge>
        ),
    },
  ]);


  return (
    <Wrapper>
      <NavMenuItem className=" w-100">
        <div className="row mx-auto">
          <div className="col-md-12"></div>
        </div>
        <AppTable
          columns={fullColumns}
          data={(categorizedTransactions && categorizedTransactions) || []}
          totalPages={(data.rowCount && data.rowCount) || 0}
          currentpage={(data && data.currentPage) || "0"}
          perPage={perPage}
          paginate={false}
        />
      </NavMenuItem>
    </Wrapper>
  );
}

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  customers_transactions: state.data.pocket_customers_transactions,
});

export default connect(mapStateToProps, {
  getPocketCustomerTransactions,
})(PocketTransactions);
