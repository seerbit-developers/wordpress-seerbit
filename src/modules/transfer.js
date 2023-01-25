/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import { addPocketCustomer } from "../actions/postActions";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
// import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import styled from "styled-components";
import "./css/module.scss";

function TransferFund(props) {
  const { transferFund, close } = props;
  const [newTransfer, setTransfer] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // if (!isEmpty(add_pocket_customer)) {
    //  setProcessing(false);
    //   close();
    //}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    //addPocketCustomer({ data: newTransfer, location: "add_pocket_customer" });
  };

  const handleValue = (e) => {
    setTransfer({ ...newTransfer, [e.target.name]: e.target.value });
  };

  return (
    <Modal centered show={transferFund} onHide={close} size="md">
      <Modal.Body className="py-3 px-4">
        <Modal.Title className="font-20 text-dark pb-3">
          Transfer Fund
        </Modal.Title>
        <form className="w-100" onSubmit={handleSubmit}>
          <div className="form-group mh-40 ">
            <label className="font-12">Select Wallet</label>
            <select
              className="form-control mh-40"
              name="bank"
              onChange={(e) => {}}
              value="hello"
            >
              <option selected>--SELECT COUNTRY--</option>
              hello
            </select>
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">How much do you want to send?</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="lastName"
              onChange={(e) => handleValue(e)}
              value={newTransfer.lastName}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Beneficiary Bank</label>
            <input
              className="form-control mh-40 "
              type="tel"
              name="phoneNumber"
              pattern="(\+\d{2})?((\(0\)\d{2,3})|\d{2,3})?\d+"
              onChange={(e) => {}}
              value={newTransfer.phoneNumber}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Amount</label>
            <input
              className="form-control mh-40 "
              type="email"
              name="emailAddress"
              onChange={(e) => handleValue(e)}
              value={newTransfer.emailAddress}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Account Number</label>
            <input
              className="form-control mh-40 "
              placeholder="Optional"
              type="text"
              name="customerExternalRef"
              onChange={(e) => handleValue(e)}
              value={newTransfer.customerExternalRef}
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Account Name</label>
            <input
              className="form-control mh-40 "
              placeholder="Optional"
              type="text"
              name="customerExternalRef"
              onChange={(e) => handleValue(e)}
              value={newTransfer.customerExternalRef}
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Description</label>
            <input
              className="form-control mh-40 "
              placeholder="Optional"
              type="text"
              name="customerExternalRef"
              onChange={(e) => handleValue(e)}
              value={newTransfer.customerExternalRef}
            />
          </div>

          <div className="py-3">You will be charged</div>

          <div className="form-group mh-40">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"50px"}
              className="brand-btn"
              type="submit"
              disabled={processing}
            >
              {processing && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              Initiate Transfer
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {})(TransferFund);
