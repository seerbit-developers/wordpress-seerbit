/**
 * BankAccount
 *
 * @format
 */

import React, { useState } from "react";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


import styled from "styled-components";
import "./css/setup.scss";
import {useTranslation} from "react-i18next";
// import InputTag from "../utils/sub_modules/inputTag";

const DataWrapper = styled.div`
  height: auto;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
  color: #000000;
  width: 590px;
`;

const Wrap = styled.div`
  margin-bottom: 0.5em;
`;

export function PreAuth({
  business_details,
  updateBusiness,
  preAuthProcess,
  setPreAuthProcess,
}) {
  return (
    <>
      <Template
        updateBusiness={(params) => updateBusiness(params)}
        business_details={business_details}
        preAuthProcess={preAuthProcess}
        setPreAuthProcess={setPreAuthProcess}
      />
    </>
  );
}

const Template = ({
  business_details,
  updateBusiness,
  preAuthProcess,
  setPreAuthProcess,
}) => {
  const [process_type, setProcessType] = useState();
  const [subscription, setSubscription] = useState(false);
  const [branch, setBranch] = useState(false);
  const [pre_auth, setPre_Auth] = useState(false);
  const { t } = useTranslation();


  const options = [
    {
      label: t("Immediate"),
      value: "immediate",
    },
    {
      label: t("24 hours"),
      value: "24 hours",
    },
    {
      label: t("Manual"),
      value: "Manual",
    },
  ];

  const initProcess = async (
    card_option,
    bank_option,
    transfer_option,
    display_fee,
    email_receipt_customer,
    email_receipt_merchant,
    charge_option
  ) => {
    const params = {
      data: {
        setting: {
          card_option,
          bank_option,
          transfer_option,
          display_fee,
          email_receipt_customer,
          email_receipt_merchant,
          charge_option,
        },
      },
      location: "business_information",
      type: "setting",
    };
    updateBusiness(params);
  };

  return (
    <DataWrapper className="bg-white px-4 pb-2 pt-3 sbt-setup mb-3">
      <Wrap>
        <div className="font-medium text-black">{t("Features")}</div>
      </Wrap>
      <form
        className="w-100"
        onSubmit={(e) => {
          e.preventDefault();
          setPreAuthProcess(true);
          initProcess();
          // card_option,
          // bank_option,
          // transfer_option,
          // display_fee,
          // email_receipt_customer,
          // email_receipt_merchant,
          // charge_option
        }}
      >
        <div className="w-100 row font-12">
          <div className="col-md-12 my-2">
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="checkbox"
                  className="form-control mr-3"
                  checked={branch}
                  onChange={(e) => {
                    setBranch(branch);
                  }}
                />
              </div>
              <label className="form-label  mx-1">{t("Activate Branch")}</label>
              <div className="text pl-3 ml-3 font-13">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, dolore eu fugiat nulla pariatur.
              </div>
            </div>
          </div>
          <div className="col-md-12 my-2">
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="checkbox"
                  className="form-control mr-3"
                  checked={subscription}
                  onChange={(e) => {
                    setSubscription(!subscription);
                  }}
                />
              </div>
              <label className="form-label  mx-1">{t("Activate Subscriptions")}</label>
              <div className="text pl-3 ml-3 font-13">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, dolore eu fugiat nulla pariatur.
              </div>
            </div>
          </div>
          <div className="col-md-12 my-2">
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="checkbox"
                  className="form-control mr-3  brand-color"
                  checked={pre_auth}
                  onChange={(e) => {
                    setPre_Auth(!pre_auth);
                  }}
                />
              </div>
              <label className="form-label  mx-1">
                {t("Enable Pre- Authorize / Capture")}
              </label>
              <div className="text pl-3 ml-3 font-13">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, dolore eu fugiat nulla pariatur.
              </div>
            </div>
          </div>
          <div className="col-md-4 my-2 pl-4 ml-4">
            <select
              className="form-control mh-40 font-15"
              onChange={(e) => setProcessType(e.target.value)}
              value={process_type}
              name="type"
            >
              {options &&
                options.map((list, key) => {
                  return (
                    <option key={key} value={list.value}>
                      {list.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="form-group mt-2 col-12">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"40px"}
              className="brand-btn"
              type="submit"
              disabled={preAuthProcess}
            >
              {preAuthProcess && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              {!preAuthProcess && `Save Changes`}
            </Button>
          </div>
        </div>
      </form>
    </DataWrapper>
  );
};
export { Template };

export default PreAuth;
