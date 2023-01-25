/** @format */

import React, { useEffect, useState } from "react";
import {handleCopy} from "utils";
import AppTable from "components/app-table";
import moment from "moment";
import Badge from "components/badge";
import Copy from "assets/images/svg/copy.svg";
import { OverlayTrigger, Popover } from "react-bootstrap";
import useWindowSize from "components/useWindowSize";

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export const Credit = ({
  props,
  perPage,
  changePage,
  setRange,
  setPerPage,
  loading,
  currency,
  setDetails,
  setOverview,
}) => {
  const size = useWindowSize();
  const { width, height } = size;
  const creditInfo = (data) => {
    if (data === "Transfer") {
      return "Credit via bank transfer from";
    } else if (data !== null) {
      return "Credit via pocket transfer from";
    } else {
      return "";
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

  const [fullColumns, setCol] = useState([]);

  useEffect(() => {
    setCol(
      [
        {
          name: "Date",
          cell: (data) => (
            <span>
              {moment(data.payout.requestDate).format("Y-MM-DD hh:mm:ss A")}
            </span>
          ),
        },
        width > 630 && {
          name: "Reference",
          // style: { width: "10%" },
          cell: (props) => (
            <span className="row p-0 m-0">
              <div
                className="cut-text seerbit-color cursor-pointer"
                style={{ width: "70%" }}
                onClick={() => {
                  setDetails(props);
                  setOverview(true);
                }}
              >
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
        width > 930 && {
          name: "Activity",
          style: { width: "7%" },
          cell: (props) =>
            props.type === "CR" ? (
              <Badge status={"success"}>CREDIT</Badge>
            ) : (
              <Badge status={"fail"}>DEBIT</Badge>
            ),
        },
        width > 930 && {
          name: "Narration",
          // cellStyle: { textAlign: 'left' },
          // style: { width: "24%" },
          cell: (props) => (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="top"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Title as="h3">Narration!</Popover.Title>
                  <Popover.Content>
                    {props.type === "CR" ? (
                      <div>{createCreditNarration(props)}</div>
                    ) : (
                      <div>{createDebitNarration(props)}</div>
                    )}
                  </Popover.Content>
                </Popover>
              }
            >
              <span className="row p-0 m-0">
                <div className="cut-text-2 cursor-pointer naraxx">
                  {props.type === "CR" ? (
                    <span className="row p-0 m-0">
                      {createCreditNarration(props)}
                    </span>
                  ) : (
                    <span className="row p-0 m-0">
                      {createDebitNarration(props)}
                    </span>
                  )}
                </div>
                ...
              </span>
            </OverlayTrigger>
          ),
        },
        {
          name: "Amount",
          style: width < 630 ? { width: "initial" } : { width: "15%" },
          cell: (props) => (
            <div
              className="cut-text seerbit-color"
              onClick={() => {
                if (width < 630) {
                  setDetails(props);
                  setOverview(true);
                }
              }}
            >
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.payout.amount)}
            </div>
          ),
        },
        width > 1100 && {
          name: "Fee",
          style: { width: "10%" },
          cell: (props) => (
            <div className="cut-text">
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.payout.charge)}
            </div>
          ),
        },
        width > 1100 && {
          name: "Balance  After",
          style: { width: "12%" },
          cell: (props) => (
            <div className="cut-text">
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.currentBalance)}
            </div>
          ),
        },
        {
          name: "Status",
          style: width < 630 ? { width: "15%" } : { width: "8%" },
          cell: (props) =>
            props.status === "SUCCESSFUL" ? (
              <Badge status={"success"}>{props.status}</Badge>
            ) : (
              <Badge status={"fail"}>{props.status}</Badge>
            ),
        },
      ].filter(Boolean)
    );
  }, [width]);

  return (
    <>
      <AppTable
        loading={loading}
        perPage={perPage}
        data={(props && props.payload && props.payload.accountHistory) || []}
        totalPages={(props && props.rowCount) || 0}
        currentpage={(props && props.currentPage) || "0"}
        columns={fullColumns}
      />
    </>
  );
};
