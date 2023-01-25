/** @format */

import React, { useState } from "react";

import { Modal, Button } from "react-bootstrap";
import verify from "utils/strings/verify";
import validate from "utils/strings/validate";

import "./css/module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import success from "assets/images/check.png";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function PaymentLink({
  close,
  paymentLink,
  business_details,
  branchNumber,
  branchReferenceNumber,
  linkProcess,
  setLinkProcess,
  payment_link,
}) {
  const [phone_no, setPhoneNo] = useState();
  const [email, setEmail] = useState();
  const [amount, setAmount] = useState();
  const [billID, setBillID] = useState();

  const [phoneNoPass, setPhoneNoPass] = useState();
  const [emailPass, setEmailPass] = useState();
  const [amountPass, setAmountPass] = useState();
  const [billIDPass, setBillIDPass] = useState();

  const handleEmail = (e) => {
    var thenum = e.target.value.match(RegExp(verify.email), "");
    if (thenum !== null) {
      setEmail(thenum[0]);
      setEmailPass(RegExp(validate.email).test(thenum[0]));
    }
  };

  const handleAmount = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setAmount(thenum[0]);
      setAmountPass(RegExp(validate.money).test(thenum[0]));
    }
  };

  const handlePhoneNumber = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setPhoneNo(thenum[0]);
      setPhoneNoPass(RegExp(validate.number).test(thenum[0]));
    }
  };

  const handleBillID = (e) => {
    setBillID(e.target.value);
    setBillIDPass(
      business_details.invoice.billLength === e.target.value.length
    );
  };
  const initProcess = async (amount, billID, phoneNumber, emailAddress) => {
    setLinkProcess(true);
    if (!amountPass) {
      setAmount("");
      setLinkProcess(false);
      setAmountPass(false);
    } else if (!billIDPass) {
      setBillID("");
      setLinkProcess(false);
      setBillIDPass(false);
    } else if (!emailPass) {
      setEmail("");
      setLinkProcess(false);
      setEmailPass(false);
    } else if (!phoneNoPass) {
      setPhoneNo("");
      setLinkProcess(false);
      setPhoneNoPass(false);
    } else {
      const params = {
        location: "payment_link",
        id: branchNumber,
        data: {
          amount,
          invoiceNumber: billID,
          phoneNumber,
          emailAddress,
        },
      };
      paymentLink(params);
    }
  };

  return (
    <Modal centered show={true} onHide={close}>
      <Modal.Header className="border-none pb-0">
        <Modal.Title className="font-20 px-2">Payment Link</Modal.Title>
        <button type="button" className="close font-24" onClick={close}>
          <span>×</span>
          <span className="sr-only">Close</span>
        </button>
      </Modal.Header>
      {!payment_link && (
        <Modal.Body className="pt-0 pb-4 px-4">
          <form
            className="w-100"
            onSubmit={(e) => {
              e.preventDefault();
              initProcess(amount, billID, phone_no, email);
            }}
          >
            <div className="row">
              <div className="form-group col-12">
                <label className="font-12">Amount</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="amount"
                  onChange={(e) => handleAmount(e)}
                  value={amount}
                />{" "}
                {!amountPass && amount !== undefined && (
                  <Error>enter a valid amount</Error>
                )}
              </div>
              <div className="form-group col-12">
                <label className="font-12">Invoice Number</label>
                <div
                  className="input-group mb-3 form-group "
                  style={{
                    border: "1px solid #b9c0c7",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  {" "}
                  <input
                    className="form-control border-none h-25 px-0 pb-0"
                    placeholder="bill id"
                    onChange={(e) => handleBillID(e)}
                    value={billID}
                    maxLength={business_details.invoice.billLength}
                  />
                  <div className="input-group-append bg-light px-3">
                    <div className="mh-25 font-14 pt-1 seerbit-color">
                      {branchReferenceNumber}
                    </div>
                  </div>
                </div>
                {!billIDPass && billID !== undefined && (
                  <Error>enter a valid bill id</Error>
                )}
              </div>

              <div className="form-group col-12 pb-2">
                <label className="font-12">Email Address</label>
                <input
                  className="form-control mh-40 "
                  type="email"
                  name="email"
                  onChange={(e) => handleEmail(e)}
                  value={email}
                />
                {!emailPass && email !== undefined && (
                  <Error>enter a valid email address</Error>
                )}
              </div>
              <div className="form-group col-12 pb-2">
                <label className="font-12">Phone Number</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="phone_number"
                  onChange={(e) => handlePhoneNumber(e)}
                  value={phone_no}
                />
                {!phoneNoPass && phone_no !== undefined && (
                  <Error>enter a valid phone number</Error>
                )}
              </div>
              <div className="col-12">
                <Button
                  variant="xdh"
                  size="lg"
                  block
                  height={"40px"}
                  className="brand-btn"
                  type="submit"
                  disabled={linkProcess}
                >
                  {linkProcess && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="font-20"
                    />
                  )}
                  {!linkProcess && `Create Link`}
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      )}
      {payment_link && (
        <>
          <div className="wrap p-3">
            <div style={{ textAlign: "center", marginBottom: "2em" }}>
              <img
                src={success}
                alt=""
                style={{ width: "75px", height: "auto" }}
              />
            </div>
            <h4 className="signin-title-secondary">
              <b className="font-weight-bold">{payment_link.email}</b> will
              recieve meassage shortly
            </h4>
            <h4 className="signin-title-secondary font-weight-bold">
              See payment details below
            </h4>

            <div className="content-head row">
              <div className="font-weight-bold text-left text-muted font-11 col-6">
                Account Number
              </div>
              <div className="content-body text-right font-13 col-6">
                {payment_link.accountNumber}
              </div>
            </div>
            <hr />
            <div className="content-head row">
              <div className="font-weight-bold text-left text-muted font-11 col-4">
                Bank Name
              </div>
              <div className="content-body text-right font-11 col-8">
                {payment_link.recipientBank}
              </div>
            </div>
            <hr />
            <div className="content-head row">
              <div className="font-weight-bold text-left text-muted font-11 col-5">
                Payment Reference
              </div>
              <div className="content-body text-right font-11 col-7">
                {payment_link.paymentReference}
              </div>
            </div>
            <div className="content-head row pt-5">
              <div className="font-weight-bold text-center text-muted font-11 col-12 ">
                Payment Link
              </div>
              <a
                className="content-body text-center font-13 col-12 word-wrap"
                href={payment_link.paymentLink}
                target="_blank"
              >
                {payment_link.paymentLink}
              </a>
            </div>
          </div>
        </>
      )}
      {/* <Success showSuccess={openRefund} close={() => setRefund(false)} /> */}
    </Modal>
  );
}

export default PaymentLink;
