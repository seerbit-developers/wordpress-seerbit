/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createPlan } from "services/recurrentService";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPlans } from "actions/recurrentActions";
import AppModal from "components/app-modal";
import { alertExceptionError, alertSuccess, alertError } from "modules/alert";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "../modules/css/module.scss";
import "./css/filter.scss";
import { t } from "i18next";

function CreatePlans(props) {
  const { isOpen, business_details, getPlans, close } = props;

  const {
    setting,
    test_public_key,
    live_public_key,
    default_currency,
    country,
  } = business_details;

  const [enableTrial, setEnableTrial] = useState(false);
  const [enablePartialDebit, setEnablePartialDebit] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [publicKey, setKey] = useState();
  const [values, setValues] = useState();

  useEffect(() => {
    setting?.mode === "TEST"
      ? setKey(test_public_key)
      : setKey(live_public_key);
  }, [setting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    const data = {
      ...values,
      publicKey,
      country: country?.countryCode,
      currency: default_currency,
      limit: (values && parseInt(values.limit)) || 0,
      allowPartialDebit: enablePartialDebit,
    };
    createPlan(data)
      .then((res) => {
        if (res.responseCode == "00") {
          setProcessing(false);
          getPlans();
          close();
          alertSuccess("Plan was successfully created.");
        } else {
          setProcessing(false);
          alertError(res.message
              ? res.message || res.responseMessage
              : "An error occurred while creating the plan. Kindly try again");
        }
      })
      .catch((e) => {
        setProcessing(false);
        alertExceptionError(e);
      });
  };

  const handleValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <AppModal title={"Create a Plan"} isOpen={isOpen} close={() => close()}>
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

        {/* <div className="form-inline">
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
              checked={enablePartialDebit}
              onChange={(e) => setEnablePartialDebit(!enablePartialDebit)}
            />
          </div>
          <label className="form-label font-12">
            {t("Enable Partial debit")}
          </label>
        </div>
        {/* <span className="form-label font-12">{t('Enabling trial period will set a delay in the start date of the billing cycle')}.</span> */}
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
            {"Create Plan"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

const mapStateToProps = (state) => ({
  currencies: state.data.get_allowed_currencies,
  business_details: state.data.business_details,
  error_details: state.data.error_details,
  location: state.data.location,
  loading_plans: state.data.loading_plans,
});
export default connect(mapStateToProps, {
  getPlans,
})(CreatePlans);
