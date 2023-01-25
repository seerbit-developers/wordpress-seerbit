/** @format */

import React, { useState } from "react";
import cogoToast from "cogo-toast";
import { Modal, Button } from "react-bootstrap";
import verify from "utils/strings/verify";
import validate from "utils/strings/validate";
import Success from "utils/success";
import styled from "styled-components";
import "./css/module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function Refund({
  showRefund,
  close,
  transactionRef,
  addRefund,
  full_amount,
  refund_success,
}) {
  const [amount, setAmount] = useState(full_amount);
  const [description, setDescription] = useState("");
  const [full, setFull] = useState(true);
  const [amountPass, setAmountPass] = useState(true);
  const [inProcess, setInProcess] = useState(false);

  const handleAmount = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      if (thenum[0] >= full_amount) {
        cogoToast.error("Please enter a value below the full amount.");
      } else {
        setAmount(thenum[0]);
        setAmountPass(RegExp(validate.money).test(thenum[0]));
      }
    }
  };

  const initProcess = async (transactionRef, amount, description, type) => {
    amount = full ? full_amount : amount;
    setInProcess(true);
    if (!amountPass) {
      setAmount("");
      setInProcess(false);
      setAmountPass(false);
    } else {
      const params = {
        location: "refund",
        data: {
          transactionRef,
          description,
          amount,
          type,
        },
      };
      addRefund(params);
    }
  };

  return (
    showRefund && (
      <Modal centered show={showRefund} onHide={close}>
        <Modal.Header className="border-none pb-0">
          <Modal.Title className="font-20 text-dark pb-3">
            <div className="text-bold">
              <strong>Refund Customer</strong>
            </div>
          </Modal.Title>
          <button type="button" className="close font-24" onClick={close}>
            <span>×</span>
            <span className="sr-only">Close</span>
          </button>
        </Modal.Header>
        {!refund_success && (
          <Modal.Body
            className="pt-0"
            onSubmit={(e) => {
              e.preventDefault();
              initProcess(
                transactionRef,
                amount,
                description,
                full ? "FULL_REFUND" : "PARTIAL_REFUND"
              );
            }}
          >
            <form className="w-100">
              <div className="form-inline">
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-control"
                    onChange={(e) => setFull(!full)}
                    checked={full}
                  />
                  <label className="form-label mx-1 input-font font-12">
                    Full Refund
                  </label>
                </div>
              </div>
              {!full && <div className="form-group mh-40 ">
                <label className="font-12"> Enter Refund amount</label>
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
              </div>}

              {full && <div className="form-group mh-40 ">
                <label className="font-12"> Enter Refund amount</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="amount"
                  onChange={(e) => handleAmount(e)}
                  value={amount}
                  disabled
                />{" "}
                {!amountPass && amount !== undefined && (
                  <Error>enter a valid amount</Error>
                )}
              </div>}

              <div className="form-group mh-40">
                <Button
                  variant="xdh"
                  size="lg"
                  block
                  height={"50px"}
                  className="brand-btn"
                  type="submit"
                  disabled={inProcess}
                >
                  {inProcess && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="font-20"
                    />
                  )}
                  {!inProcess && "Refund Customer"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        )}{" "}
        <Success showSuccess={refund_success} close={close} />
      </Modal>
    )
  );
}

export default Refund;
