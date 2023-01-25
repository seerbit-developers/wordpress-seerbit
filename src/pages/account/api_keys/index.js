/**
 * BankAccount
 *
 * @format
 */

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ConfirmAction from "modules/confirmAction";
import Button from "components/button";
import { Can } from "modules/Can";
import CardSetting from "../components/cardSetting";
import { connect } from "react-redux";
import KeyCard from "./components/keyCard";
import { getBusiness, resetKeys} from "../../../actions/postActions";
import {resetBusinessKeys} from "../../../services/businessService";
import {alertError, alertExceptionError, alertSuccess, globalAlert, globalAlertTypes} from "../../../modules/alert";
import {useTranslation} from "react-i18next";

export function ApiKeys({
  business_details,
  resetKeys,
  getBusiness
}) {
  return (
    <Template
      mode={business_details.setting.mode}
      keys={{
        public_key: business_details.live_public_key,
        private_key: business_details.live_private_key,
        public_key_test: business_details.test_public_key,
        private_key_test: business_details.test_private_key,
      }}
      resetKeys={resetKeys}
      getBusiness={getBusiness}
    />
  );
}

const Template = ({
  keys,
  mode,
  getBusiness
}) => {
  const [show_confirm, setShowConfirm] = useState(false);
  const [apiKeyProcess, setApiKeyProcess] = useState(false);
  const { t } = useTranslation();


  const data = {
    title: "API Keys",
    description: t(`Your SeerBit API keys are an essential part of your business with us at SeerBit. Keys will be required before you can make calls to any of our services or before you can receive payments linked this to account either Test or Live transactions.`),
    icon: "api",
    link: "#",
  };

  const save = ()=>{
    setApiKeyProcess(true)
    resetBusinessKeys().then(res=>{
      setApiKeyProcess(false)
      if (res.responseCode === '00'){
        setShowConfirm(false)
        alertSuccess('Your API Keys have been successfully reset')
        getBusiness();
      }else{
        alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
      }
    }).catch(e=>{
      setApiKeyProcess(false)
      alertExceptionError(e)
    })
  }

  return (
    <div className="config--section__container mt-5">
      {show_confirm && (
        <ConfirmAction
          show={show_confirm}
          process={apiKeyProcess}
          title="Reset API Key"
          message={`Use this service if only you think your API key has been compromise\n NOTE:You will have to change your payment service credential to the new keys`}
          handler={() => {
            setApiKeyProcess(true);
            save();
          }}
          close={() => setShowConfirm(false)}
        />
      )}
      <div className="config__section--left">
        <div className="mb-0">
          {mode === "LIVE" && (
            <div className="card__standard mb-5">
              <div className="card__standard--header">
                <p>{t("LIVE KEYS")}</p>
              </div>
              <div className="card__standard--body">
                <KeyCard title={t("Secret Key")} apiKey={keys.private_key} />
                <div className="divide__horizontal" />
                <KeyCard title="Public Key" apiKey={keys.public_key} />
              </div>
            </div>
          )}
          <div className="card__standard mb-5">
            <div className="card__standard--header">
              <p>{t("TEST KEYS")}</p>
            </div>
            <div className="card__standard--body">
              <KeyCard title={t("Secret Key")} apiKey={keys.private_key_test} />
              <div className="divide__horizontal" />
              <KeyCard title='Public Key' apiKey={keys.public_key_test} />
            </div>
          </div>
          <div className="card__standard ">
            <div className="card__standard--header">
              <p>{t("Encryption Key")}</p>
            </div>
            <div className="card__standard--body">
              <KeyCard
                title="Instructions"
                apiKey="https://doc.seerbit.com/development-resources/hash/key-encrpyt"
              />
            </div>
          </div>
          <Can access="MANAGE_API_KEYS">
            <div className="text-right mt-3">
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={apiKeyProcess}
                buttonType='button'
              >
                {apiKeyProcess && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}
                {!apiKeyProcess && t('Reset Keys')}
              </Button>
            </div>
          </Can>
        </div>
      </div>
      {/* <div className="config__section--right"> */}
        <CardSetting
          key="1"
          index="1"
          item={data}
          goto={() => {}}
          button={false}
          className="custom__setting--box boxx ml-4"
          link={data.link}
        />
      {/* </div> */}
    </div>
  );
};
const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  kyc: state.data.kyc,
  industry_list: state.data.industry_list,
  error_details: state.data.error_details,
  location: state.data.location,
  countries: state.data.countries,
});
export default connect(mapStateToProps, {resetKeys,getBusiness})(ApiKeys);
