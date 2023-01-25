/** @format */
import React, { useState, useEffect } from "react";
import moment from "moment";
import cogoToast from "cogo-toast";
import { connect } from "react-redux";
import { refundTransfer, clearState } from "../actions/postActions";
import Copy from "../assets/images/svg/copy.svg";
import { Button } from "react-bootstrap";
import AppModal from "components/app-modal";
import Badge from "components/badge";
import "./css/module.scss";
import {Loader} from "semantic-ui-react";

function TransferDetails({
  isOpen,
  close,
  details,
  refundTransfer,
  clearState,
  refund_transfer,
  error_details,
  business_details,
  getWalletTransaction,
  location,
}) {
  const [processing, setProcessing] = useState(false);

  function formatNumber(num) {
    return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

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

  useEffect(() => {
    if (error_details && error_details.error_source === "refund_transfer") {
      setProcessing(false);
      cogoToast.error(error_details.responseMessage, { position: "top-right" });
      clearState({ refund_transfer: null });
    }
  }, [error_details]);

  useEffect(() => {
    if (refund_transfer && location === "refund_transfer") {
      setProcessing(false);
      cogoToast.success(
        refund_transfer.message || refund_transfer.responseMessage,
        {
          position: "top-right",
        }
      );
      getWalletTransaction();
      close();
    }
  }, [location]);

  return (
    // <Modal centered show={show_overview} onHide={close} size="md">
    //     <Modal.Body className="py-3 px-4">
    //         <Modal.Title className="font-20 text-dark pb-3 mb-3">
    //             <div className="py-2 text-bold mb-2">
    //                 <strong>Transaction Details</strong>
    //             </div>
    //             <div className="d-flex flex-row justify-content-between">
    //                 <div
    //                     className="alert alert-danger text-center py-4 badge"
    //                     style={{ width: "80px" }}
    //                     role="alert"
    //                 >
    //                     <div className="py-2 font-16">Debit</div>
    //                 </div>
    <AppModal
      title={"Transaction Details"}
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
      {details.status !== "SUCCESSFUL" &&
        details.payout.responseCode !== "RF_S23" && (
          <Button
            variant="xdh"
            height={"30px"}
            className="brand-btn font-11"
            style={{ width: "130px", minHeight: "30px" }}
            onClick={(e) => {
              e.preventDefault();
              setProcessing(true);
              refundTransfer({
                transRef: details.payout.transactionReference,
                location: "refund_transfer",
              });
            }}
            disabled={processing}
          >
            {processing ? (
                <Loader active inline='centered' />
            ) : (
              <span>Refund</span>
            )}
          </Button>
        )}
      {/* </div> */}
      {/* // </Modal.Title> */}
      <div className="d-flex justify-content-between" style={{ marginTop: "15px" }}>
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
              handleCopy(e, details.payout.transactionReference);
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
        <div
          className={`
                ${
                  details.payout.responseCode === "00"
                    ? "font-bold text-success"
                    : details.payout.responseCode === "RF_S23"
                    ? "font-bold text-warning"
                    : "font-bold text-danger"
                }`}
        >
          {details.payout.responseCode === "00" ? (
            <strong>Successful</strong>
          ) : details.payout.responseCode === "RF_S23" ? (
            <strong>Refunded</strong>
          ) : (
            <strong>Failed</strong>
          )}
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
      {/* //     </Modal.Body> */}
      {/* // </Modal> */}
    </AppModal>
  );
}

const mapStateToProps = (state) => ({
  refund_transfer: state.data.refund_transfer,
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  refundTransfer,
  clearState,
})(TransferDetails);
