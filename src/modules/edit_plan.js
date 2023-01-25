/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  createFrontStore,
  getAllowedCurrencies,
  clearState,
  validateStoreName,
} from "actions/postActions";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppModal from "components/app-modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { editPlan } from "services/recurrentService";
import { dispatchUpdatePlan } from "actions/recurrentActions";
import { alertExceptionError, alertSuccess, alertError } from "modules/alert";
import "../modules/css/module.scss";
import "./css/filter.scss";

function EditPlan(props) {
  const { isOpen, selectedPlan, dispatchUpdatePlan, business_details, close } =
    props;

  const { default_currency, country } = business_details;

  const [processing, setProcessing] = useState(false);
  const [enableTrial, setEnableTrial] = useState(false);
  const [values, setValues] = useState();

  console.log(selectedPlan)

  useEffect(() => {
    setValues({
      productId: selectedPlan?.details?.productId,
      productDescription: selectedPlan?.details?.productDescription,
      amount: selectedPlan?.details?.amount,
      billingCycle: selectedPlan?.details?.billingCycle,
      publicKey: selectedPlan?.details?.publicKey,
      limit: selectedPlan?.details?.limit,
      allowPartialDebit: selectedPlan?.details.allowPartialDebit,
    });
  }, [selectedPlan]);

  const handleValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    const data = {
      ...values,
      planId: selectedPlan?.details?.planId,
      country: country?.countryCode,
      currency: default_currency,
      limit: (values && parseInt(values.limit)) || 0,
    };
    editPlan(data)
      .then((res) => {
        if (res.responseCode == "00") {
          setProcessing(false);
          dispatchUpdatePlan({
            planId: res?.payload?.details?.planId,
            plan: res?.payload,
          });
          close();
          alertSuccess("Plan was successfully edited.");
        } else {
          setProcessing(false);
          alertError(res.message
              ? res.message || res.responseMessage
              : "An error occurred while editing the plan. Kindly try again");
        }
      })
      .catch((e) => {
        setProcessing(false);
        alertExceptionError(e);
      });
  };

  return (
    <AppModal title={"Edit a Plan"} isOpen={isOpen} close={() => close()}>
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="form-group mh-40 mb-3">
          <label className="font-12 font-medium">Plan Name</label>
          <input
            className="form-control mh-40 "
            type="text"
            name="productId"
            value={values && values.productId}
            onChange={(e) => handleValue(e)}
            required
          />
        </div>

        <div className="form-group mh-40 mb-3">
          <label className="font-12 font-medium">Plan Description</label>
          <textarea
            type="text"
            name="productDescription"
            className="form-control"
            minLength={2}
            maxLength={100}
            rows="3"
            style={{ resize: "none" }}
            onChange={(e) => handleValue(e)}
            value={values && values.productDescription}
          />
        </div>

        <div className="form-group mh-40 mb-3">
          <label className="font-12 font-medium">Plan Amount</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">
                {business_details && business_details.default_currency}
              </span>
            </div>
            <input
              className="form-control mh-40 "
              pattern="[+-]?([0-9]*[.])?[0-9]+"
              type="text"
              name="amount"
              onChange={(e) => handleValue(e)}
              value={values && values.amount}
              required
            />
          </div>
        </div>

        <div className="form-group mh-40 mb-3">
          <label className="font-12">Interval</label>
          <select
            className="form-control mh-40"
            name="billingCycle"
            onChange={(e) => handleValue(e)}
            value={values && values.billingCycle}
            required
          >
            <option selected>{"Select Interval"}</option>
            {[
              { label: "Hourly", value: "HOURLY" },
              { label: "Daily", value: "DAILY" },
              { label: "Weekly", value: "WEEKLY" },
              { label: "Monthly", value: "MONTHLY" },
              { label: "Quaterly", value: "QUATERLY" },
              { label: "Yaerly", value: "YEARLY" },
            ].map((list, key) => {
              return (
                <option key={key} value={list.value}>
                  {list.label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group mh-40 mb-3">
          <label className="font-12">Max No of Payments</label>
          <input
            className="form-control mh-40 "
            type="number"
            name="limit"
            value={values && values.limit}
            onChange={(e) => handleValue(e)}
            required
          />
        </div>

        {/* <div className=" form-inline">
                    <div className="form-group">
                        <input
                            type="checkbox"
                            className="form-control mr-2"
                            checked={enableTrial}
                            onChange={(e) => setEnableTrial(!enableTrial)}
                        />
                    </div>
                    <label className="form-label font-12">Enable Trial Period.</label>
                </div>
                <span className="form-label font-12">Enabling trial period will set a delay in the start date of the billing cycle.</span> */}

        <div className="form-inline">
          <div className="form-group">
            <input
              type="checkbox"
              className="form-control mr-2"
              checked={values?.allowPartialDebit}
              onChange={(e) =>
                setValues({
                  ...values,
                  allowPartialDebit: !values?.allowPartialDebit,
                })
              }
            />
          </div>
          <label className="form-label font-12">
            {"Enable Partial debit"}
          </label>
        </div>
        <div className="form-group mh-40 mt-4 mb-3">
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
            {"Edit Plan"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

const mapStateToProps = (state) => ({
  currencies: state.data.get_allowed_currencies,
  business_details: state.data.business_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  getAllowedCurrencies,
  validateStoreName,
  createFrontStore,
  clearState,
  dispatchUpdatePlan,
})(EditPlan);
