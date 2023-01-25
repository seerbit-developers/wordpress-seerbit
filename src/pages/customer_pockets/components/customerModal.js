import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addPocketCustomer, clearState } from "actions/postActions";
import { isEmpty } from "lodash";
import AppModal from "components/app-modal";
import Button from "components/button";
// import styled from "styled-components";
// import Copy from "assets/images/svg/copy.svg";
import cogoToast from "cogo-toast";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { DebounceInput } from "react-debounce-input";
// import { useForm } from "react-hook-form";
import { Spinner } from "react-bootstrap";
// const SubHead = styled.span`
//   display: block;
//   font-size: 15px;
//   line-height: 17px;
//   color: #676767;
//   line-height: 2;
// `;
//
// const Error = styled.div`
//   color: #C10707;
//   font-size: 15px;
//   line-height: 1
//   font-weight: normal;
//   margin-top: .2em;
// `;
//
// const accounts = [
//   { id: 0, type: "Credit Pocket" },
//   { id: 1, type: "Debit Pocket" },
//   { id: 2, type: "Credit Bank Account" },
// ];

function AddPocketCustomer(props) {
  const {
    isOpen,
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
    <AppModal
      title={"Add Pocket Customer"}
      isOpen={isOpen}
      close={() => close(false)}
    >
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
              full
              height={"50px"}
              className="brand-btn"
              type="submit"
              disabled={processing}
              text={processing ?
                <Spinner animation="border" size="sm" variant="light" disabled={process} /> : 'Add Customer'}
            />
              {/* {processing && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}{" "}
              Add Customer
            </Button> */}
          </div>
        </form>
    </AppModal>
  );
};

const mapStateToProps = (state) => ({
  add_pocket_customer: state.data.add_pocket_customer,
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  addPocketCustomer,
  clearState,
})(AddPocketCustomer);
