/** @format */

import React, { useEffect, useState } from "react";
import Table from "../../utils/analytics/table";
import cogoToast from "cogo-toast";
import Copy from "../../assets/images/svg/copy.svg";
import { OverlayTrigger, Popover } from "react-bootstrap";
import AppTable from "components/app-table";
import moment from "moment";
import Badge from "components/badge";
import useWindowSize from "components/useWindowSize";

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export const Debit = ({
  props,
  categorizedTransactions,
  setDetails,
  setOverview,
  setPerPage,
  perPage,
  setRange,
  changePage,
  loading,
  currency,
}) => {
  const size = useWindowSize();
  const { width, height } = size;
  // const width = 2000

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

  const [fullColumns, setCol] = useState([]);

  useEffect(() => {
    setCol(
      [
        {
          name: "Date",
          cell: (data) => (
            <span style={{ fontSize: "13px" }}>
              {moment(data.payout.requestDate).format("Y-MM-DD hh:mm:ss A")}
            </span>
          ),
        },

        width > 450 && {
          name: "Reference",
          cell: (props) => (
            <span className="row p-0 m-0" style={{ fontSize: "13px" }}>
              <div
                className="cut-text seerbit-color"
                style={{ width: "80%" }}
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
                  handleCopy(e, props);
                }}
              />
            </span>
          ),
        },
        width > 450 && {
          name: "Amount",
          cell: (props) => (
            <div
              className="cut-text seerbit-color"
              style={{ fontSize: "13px" }}
            >
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.payout.amount)}
            </div>
          ),
        },
        width < 450 && {
          name: "Amount",
          cell: (props) => (
            <div
              className="cut-text seerbit-color"
              style={{ fontSize: "13px" }}
              onClick={() => {
                setDetails(props);
                setOverview(true);
              }}
            >
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.payout.amount)}
            </div>
          ),
        },
        width > 850 && {
          name: "Fee",
          cell: (props) => (
            <div className="cut-text">
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.payout.charge)}
            </div>
          ),
        },
        width > 630 && {
          name: "Balance  After",
          cell: (props) => (
            <div className="cut-text">
              {props.payout.currency || business_details.default_currency}{" "}
              {formatNumber(props.currentBalance)}
            </div>
          ),
        },
        width > 1400 && {
          name: "Transaction Type",
          pointer: "type",
          cell: (props) => <div className="cut-text">{props.type}</div>,
        },

        {
          name: "Status",
          style: width < 1000 ? { width: "15%" } : {width: "10%"},
          cell: (props) =>
            props.status === "SUCCESSFUL" ? (
              <Badge status={"success"}>{props.status}</Badge>
            ) : (
              <Badge status={"fail"}>{props.status}</Badge>
            ),
        },
        width > 1000 && {
          name: "Remarks",
          cell: (props) => (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="top"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Title as="h3">Remarks!</Popover.Title>
                  <Popover.Content>
                    {(props.remarks && props.remarks) || "Not Applicable"}
                  </Popover.Content>
                </Popover>
              }
            >
              <div className="cut-text-2g cursor-pointer text-wrap">
                {(props.remarks && props.remarks.substr(0, 16) + "...") ||
                  "Not Applicable"}
              </div>
             </OverlayTrigger>
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
        data={(categorizedTransactions && categorizedTransactions) || []}
        totalPages={(props && props.rowCount) || 0}
        paginate={true}
        currentpage={(props && props.currentPage) || "0"}
        columns={fullColumns}

        // scroll
      />
    </>
  );
};
