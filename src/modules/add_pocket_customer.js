/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addPocketCustomer, clearState } from "../actions/postActions";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import "./css/module.scss";
import cogoToast from "cogo-toast";

function AddPocketCustomer(props) {
  const {
    addCustomer,
    close,
    add_pocket_customer,
    addPocketCustomer,
    getAddedCustomer,
    error_details,
  } = props;
  const [newCustomer, setCustomer] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isEmpty(add_pocket_customer)) {
      setProcessing(false);
    }
  }, [add_pocket_customer]);

  useEffect(() => {
    if (
      props.error_details &&
      props.error_details.error_source === "add_pocket_customer"
    ) {
      setProcessing(false);
      cogoToast.error(props.error_details.message, { position: "top-right" });
      props.clearState({ error_details: null })
    }
  }, [props.error_details]);

  useEffect(() => {
    if (props.add_pocket_customer && props.location === "add_pocket_customer") {
      setProcessing(false);
      cogoToast.success("Customer was added successfully", {
        position: "top-right",
      });
      props.clearState({ add_pocket_customer: null })
      getAddedCustomer();
      close();
    }
  }, [props.location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    addPocketCustomer({ data: newCustomer, location: "add_pocket_customer" });
  };

  const handleValue = (e) => {
    setCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  return (
    <Modal centered show={addCustomer} onHide={close} size="md">
      <Modal.Body className="py-3 px-4">
        <Modal.Title className="font-20 text-dark pb-3">
          <div className="py-2 text-bold">
            <strong>Add Pocket Customer</strong>
          </div>
        </Modal.Title>
        <form className="w-100" onSubmit={handleSubmit}>
          <div className="form-group mh-40 ">
            <label className="font-12">First Name</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="firstName"
              onChange={(e) => handleValue(e)}
              value={newCustomer.firstName}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Last Name</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="lastName"
              onChange={(e) => handleValue(e)}
              value={newCustomer.lastName}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Phone Number</label>
            <input
              className="form-control mh-40 "
              type="tel"
              name="phoneNumber"
              pattern="(\+\d{2})?((\(0\)\d{2,3})|\d{2,3})?\d+"
              onChange={(e) => handleValue(e)}
              value={newCustomer.phoneNumber}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Email Address</label>
            <input
              className="form-control mh-40 "
              type="email"
              name="emailAddress"
              onChange={(e) => handleValue(e)}
              value={newCustomer.emailAddress}
              required
            />
          </div>

          <div className="form-group mh-40 ">
            <label className="font-12">Customer ExternalRef</label>
            <input
              className="form-control mh-40 "
              placeholder="Optional"
              type="text"
              name="customerExternalRef"
              onChange={(e) => handleValue(e)}
              value={newCustomer.customerExternalRef}
            />
          </div>

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
              )}{" "}
              Add Customer
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}


const mapStateToProps = (state) => ({
  add_pocket_customer: state.data.add_pocket_customer,
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  addPocketCustomer,
  clearState,
})(AddPocketCustomer);
