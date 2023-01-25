/** @format */
import React from "react";
import moment from "moment";
import Copy from "../assets/images/svg/copy.svg";
import AppModal from "components/app-modal";
import Badge from "components/badge";
import "./css/module.scss";
import {handleCopy} from "utils";

function Details({
  isOpen,
  close,
  details,
  setDetails,
  business_details,
  location,
}) {
  function formatNumber(num) {
    return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }


  return (

    <AppModal
      title={"Transaction details"}
      isOpen={isOpen}
      close={() => close(false)}
    >
      {details.type === "CR" ? (
        <Badge status={"success"} className="font-14">
          Credit
        </Badge>
      ) : (
        <Badge status={"fail"} className="font-14">
          Debit
        </Badge>
      )}

      <div
        className="d-flex justify-content-between "
        style={{ marginTop: "15px" }}
      >
        <div className="">Amount</div>
        <div className="font-bold">
          {business_details.default_currency} {formatNumber(details.amount)}
        </div>
      </div>
      <hr />
      <span className="d-flex justify-content-between">
        <div className="">Transaction Ref</div>
        <div className="row px-3 seerbit-color">
          <div className="font-bold cut-text cursor-pointer">
            <strong>{details.payout.transactionReference}</strong>
          </div>
          <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
              handleCopy(details.payout.transactionReference);
            }}
          />
        </div>
      </span>
      <hr />
      <div className="d-flex justify-content-between">
        <div className="">Date/Time</div>
        <div className="font-bold">
          <strong>
            {moment(details.payout.requestDate).format("DD-MM-yyyy, hh:mm A")}
          </strong>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <div className="">Transaction Status</div>
        <div className="font-bold">
          <strong>{details.status}</strong>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <div className="">Narration</div>
        <div
          className="font-bold"
          style={{ width: "270px", textAlign: "right" }}
        >
          <strong>{details.narration}</strong>
        </div>
      </div>
      <hr />

    </AppModal>
  );
}

export default Details;
