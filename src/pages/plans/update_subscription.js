/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getAllowedCurrencies,
  clearState,
  validateCustomUrl,
} from "actions/postActions";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AppModal from "components/app-modal";
import { alertError, alertExceptionError, alertSuccess } from "modules/alert";
import { useTranslation } from "react-i18next";
import { updateSubscription } from "services/recurrentService";
import { getPlanSubscribers } from "actions/recurrentActions";

function UpdateSubscription(props) {
  const { isOpen, close, reload, data, getPlanSubscribers } = props;

  const { planId } = useParams();
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();
  const [amount, setAmount] = useState(0);

  const handleValue = (e) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    if (data.amount) setAmount(data.amount);
  }, [data]);

  const update = (props) => {
    props.preventDefault();
    setProcessing(true);
    const payload = {
      amount,
      currency: data?.currency,
      country: data?.country,
      mobileNumber: data?.mobileNumber,
      billingId: data?.billingId,
      publicKey: data?.publicKey,
      status: data?.status,
    };

    updateSubscription(payload)
      .then((res) => {
        if (res.responseCode == "00") {
          setProcessing(false);
          alertSuccess("Subscription was successfully updated.");
          getPlanSubscribers(planId);
          close();
        } else {
          alertError(res.message
              ? res.message || res.responseMessage
              : "An error occurred while updating the subscription. Kindly try again");
        }
      })
      .catch((e) => {
        console.error(e);
        alertExceptionError(e);
      });
  };

  return (
    <AppModal
      title={"Update Subscription"}
      isOpen={isOpen}
      close={() => close()}
    >
      <form className="w-100 pb-4" onSubmit={update} id="seerbit-form">
        <div className="form-group mh-40 ">
          <label className="font-12 font-medium">{t("Customer Name")}</label>
          <input
            className="form-control mh-40"
            type="text"
            name="paymentLinkName"
            disabled
            value={data.cardName}
            // onChange={(e) => handleValue(e)}
            required
          />
        </div>

        <div className="form-group mh-40 pb-20">
          <label className="font-12 font-medium">{t("Plan Amount")}</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span
                className="input-group-text currency-placeholder"
                id="basic-addon1"
                style={{ backgroundColor: "#DFE0EB !important" }}
              >
                {data.currency}
              </span>
            </div>
            <input
              className="form-control mh-40 "
              pattern="[+-]?([0-9]*[.])?[0-9]+"
              type="text"
              name="amount"
              onChange={(e) => handleValue(e)}
              required
              value={amount}
            />
          </div>
        </div>

        <div className="form-group mh-60">
          <Button
            variant="xdh"
            size="lg"
            block
            height={"50px"}
            className="brand-btn mt-10"
            type="submit"
            disabled={processing}
          >
            {processing && (
              <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
            )}{" "}
            {"Update Plan"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

const mapStateToProps = (state) => ({
  currencies: state.data.get_allowed_currencies,
  update_payment_link: state.data.update_payment_link,
  create_payment_link: state.data.create_payment_link,
  business_details: state.data.business_details,
  error_details: state.data.error_details,
  location: state.data.location,
  validatecustomurl: state.data.validatecustomurl,
});
export default connect(mapStateToProps, {
  getPlanSubscribers,
  updateSubscription,
})(UpdateSubscription);
