/** @format */
import React, { useState } from "react";
import { isEmpty } from "lodash";
import { Modal, Button } from "react-bootstrap";
import Copy from "../assets/images/svg/copy.svg";
import cogoToast from "cogo-toast";
import styled from "styled-components";
import "./css/module.scss";
import {OverlayTrigger, Tooltip,Popover} from "react-bootstrap";

const SubHead = styled.span`
  display: block;
  font-size: 15px;
  line-height: 17px;
  color: #676767;
  line-height: 2;
`;

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function PocketTopUp({
  show_top_up_pocket,
  close,
  wallet_payouts,
  amount,
  setAmount,
  setShowCheckout,
  config
}) {
  const [errorMsg, setErrorMsg] = React.useState(null);
  const handleCopy = (e, val) => {
    cogoToast.success(`${val} link copied`, { position: "top-right" });
    const textField = document.createElement("textarea");
    textField.innerText = e;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const handleTopUp = () => {
    if (!amount) {
      setErrorMsg('An amount is required to credit your pocket');
    } else {
      setShowCheckout(true);
      close()
    }
  }

  const updateAmount = (val)=>{
    setErrorMsg(null);
    setAmount(val);
  }

  const createBankName = (data) => {
    if (isEmpty(data)) return;

    if (data && data.startsWith("8")) {
      return "Sterling Bank"
    } else {
      return "Providus Bank"
    }
  }

  return (
    <Modal centered show={show_top_up_pocket} onHide={close} size="md">
      <Modal.Body className="py-3 px-4">
        <Modal.Title className="font-16 text-dark">
          <div className="py-2 text-bold">
            <strong>Pocket Top Up</strong>
            {config && config.fundingCharge > 0 &&
            <div className="font-12 mt-2 text-danger font-italic">
              {config.fundingCharge ? 'Please note that you will be charged a fee of '+config.fundingCharge : ''} {config.fundingChargeType ? config.fundingChargeType !== 'FIXED' ? '%' : 'Naira' : '' }
            </div>
            }
          </div>
        </Modal.Title>
        <form className="w-100">
          <div className="">
            <div className="py-1 font-weight-bold d-inline-block">Fund via Bank Transfer</div>
            <p className="m-0 font-12 mb-2">Transfer the amount you wish to fund your Pocket Account with, using
              the account details provided below</p>
            <SubHead
              className="p-3 text-muted font-15 mb-5"
              style={{ backgroundColor: "#F0F2F7" }}
            >
              <div className="brand">{
                createBankName(
                  wallet_payouts &&
                  wallet_payouts.payload &&
                  wallet_payouts.payload.account &&
                  wallet_payouts.payload.account.businessPocketAccountNumber
                )}
              </div>
              <div className="text-muted">
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    handleCopy(
                      wallet_payouts &&
                      wallet_payouts.payload &&
                      wallet_payouts.payload.account &&
                      wallet_payouts.payload.account.businessPocketAccountNumber,
                      "Static Account Number"
                    )
                  }
                >
                  {wallet_payouts &&
                    wallet_payouts.payload &&
                    wallet_payouts.payload.account &&
                    wallet_payouts.payload.account.businessPocketAccountNumber}{" "}
                  <img src={Copy} width="15" height="15" />
                </span>
              </div>
              <div className="">Centric Gateway Ltd.</div>
            </SubHead>
            <hr />
            <strong>Fund via Checkout</strong>
            <SubHead className="my-3">
              <label className="font-12 mb-0">Amount</label>
              <input
                className={`form-control mh-40 py-2 ${errorMsg ? 'border-error' : ''}`}
                type="text"
                name="amount"
                pattern="[+-]?([0-9]*[.])?[0-9]+"
                onChange={(e) => { updateAmount(e.target.value) }}
                value={amount}
                required
              />
              {errorMsg ? <p className="text-danger font-12 m-0"> {errorMsg}</p> : ''}
            </SubHead>
            <div className="form-group mh-40">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"20px"}
                className="brand-btn"
                disabled={!amount}
                aria-disabled={!amount}
                onClick={() => handleTopUp()}
              >
                Top Up Pocket
                </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default PocketTopUp;
