/**
 * BankAccount
 *
 * @format
 */

import React, { memo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";
import ConfirmAction from "../../modules/confirmAction";
import cogoToast from "cogo-toast";

import { Can } from "modules/Can";

import Copy from "assets/images/svg/copy.svg";

import styled from "styled-components";
import "./css/setup.scss";
import {useTranslation} from "react-i18next";

const DataWrapper = styled.div`
  height: auto;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
  width: 669px;
`;

const Wrap = styled.div`
  margin-bottom: 1.5em;
`;

const onRowClick = () => { };
export function APIKeys({
  business_details,
  resetKeys,
  apiKeyProcess,
  setApiKeyProcess,
}) {
  return (
    <>
      {business_details.setting.mode === "LIVE" && (
        <Template
          type={"live"}
          keys={{
            public_key: business_details.live_public_key,
            private_key: business_details.live_private_key,
          }}
          resetKeys={resetKeys}
          apiKeyProcess={apiKeyProcess}
          setApiKeyProcess={setApiKeyProcess}
        />
      )}
      <Template
        type={"test"}
        keys={{
          public_key: business_details.test_public_key,
          private_key: business_details.test_private_key,
        }}
        resetKeys={resetKeys}
        apiKeyProcess={apiKeyProcess}
        setApiKeyProcess={setApiKeyProcess}
      />{" "}
    </>
  );
}

const Template = ({
  type,
  keys,
  resetKeys,
  apiKeyProcess,
  setApiKeyProcess,
}) => {
  const [show_confirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();

  const handleFocus = (val, e) => {
    if (e.length > 10 && e.indexOf("SB") === 0) handleCopy(val, e);
  };
  const handleCopy = (val, e) => {
    cogoToast.success(`${val} Copied`, { position: "top-right" });

    // this.NotificationPrompt("info", "Successful", `${val} copied`);
    const textField = document.createElement("textarea");
    textField.innerText = e;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    // cogoToast.success(`${val.target.name} Copied`, { position: "top-right" });
  };
  const refs = null;
  return (
    <DataWrapper className="bg-white px-4 pb-3 pt-4 sbt-setup mb-3">
      <Wrap>
        <div className="font-medium text-black">
          {type.toUpperCase()} {t("API Keys")}
        </div>
      </Wrap>
      <div className="row">
        <div className="form-group col-12 mb-0">
          <label className="font-12">{type.toUpperCase()} {t("secret key")}</label>
          <div
            className="input-group mb-3 form-group h-40"
            style={{
              border: "1px solid #b9c0c7",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <input
              className="form-control border-none h-25px"
              value={keys.private_key}
              // onFocus={() => {
              // 	handleFocus(`${type} Secret Key`, keys.private_key);
              // }}
              onMouseDown={(e) => {
                handleFocus(`${type} Secret Key`, keys.private_key);
              }}
            />
            <div className="input-group-append">
              <button
                className="btn py-1 font-12"
                style={{ background: "#F5F7FA" }}
                onClick={(e) => {
                  handleFocus(`${type} Secret Key`, keys.private_key);
                }}
              >
                <span className="py-2 text-muted">
                  <img src={Copy} width="15" height="15" /> {t("copy")}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="form-group col-12 mb-0">
          <label className="font-12">{type.toUpperCase()} {t("public key")}</label>
          <div
            className="input-group mb-3 form-group h-40"
            style={{
              border: "1px solid #b9c0c7",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <input
              className="form-control border-none h-25px"
              value={keys.public_key}
              // onFocus={() => {
              // 	handleFocus(`${type} Public Key`, keys.public_key);
              // }}
              onMouseDown={(e) => {
                handleFocus(`${type} Public Key`, keys.public_key);
              }}
            />
            <div className="input-group-append">
              <button
                className="btn py-1 font-12"
                style={{ background: "#F5F7FA" }}
                onClick={(e) => {
                  handleFocus(`${type} Public Key`, keys.public_key);
                }}
              >
                <span className="py-2 text-muted">
                  <img src={Copy} width="15" height="15" /> {t("copy")}
                </span>
              </button>
            </div>
          </div>
        </div>
        <Can access="MANAGE_API_KEYS">
          <div className="form-group col-12 mb-0">
            <Button
              variant="xdh"
              height={"40px"}
              style={{ width: "174px" }}
              className="brand-btn float-right"
              onClick={() => setShowConfirm(true)}
              disabled={apiKeyProcess}
            >
              {apiKeyProcess && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              {!apiKeyProcess && `Reset Keys`}
            </Button>
          </div>
        </Can>

        {show_confirm && (
          <ConfirmAction
            show={show_confirm}
            title="Reset API Key"
            message={t(`Use this service if only you think your API key has been compromise\n NOTE:You will have to change your payment service credential to the new keys`)}
            handler={() => {
              setApiKeyProcess(true);
              resetKeys({ location: "business_information" });
            }}
            close={() => setShowConfirm(false)}
          />
        )}
      </div>
    </DataWrapper>
  );
};
export { Template };

export default APIKeys;
