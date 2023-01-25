/**
 * BankAccount
 *
 * @format
 */

import React, {  useState } from "react";
import validate from "utils/strings/validate";

import { Can } from "modules/Can";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { Button } from "react-bootstrap";

import styled from "styled-components";
import "./css/setup.scss";
import AppToggle from "../../components/toggle";
import {useTranslation} from "react-i18next";

const DataWrapper = styled.div`
  height: auto;
  width: 500px;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Wrap = styled.div`
  margin-bottom: 0.5em;
`;
const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

export function Webhook({
  business_details,
  updateBusiness,
  webhookProcess,
  setWebhookProcess,
}) {
  return (
    <>
      <Template
        type={"live"}
        webhook_url={
          business_details.webhook && business_details.webhook !== null
            ? business_details.webhook.url
            : ""
        }
        webhook_active={
          business_details.webhook && business_details.webhook !== null
            ? business_details.webhook.active
            : false
        }
        webhook={business_details.webhook}
        updateBusiness={updateBusiness}
        webhookProcess={webhookProcess}
        setWebhookProcess={setWebhookProcess}
      />{" "}
      <Template
        type={"test"}
        webhook_url={
          business_details.webhook && business_details.webhook !== null
            ? business_details.webhook.testUrl
            : ""
        }
        webhook_active={
          business_details.webhook && business_details.webhook !== null
            ? business_details.webhook.testUrlActive
            : false
        }
        webhook={business_details.webhook}
        updateBusiness={updateBusiness}
        webhookProcess={webhookProcess}
        setWebhookProcess={setWebhookProcess}
      />{" "}
    </>
  );
}

const Template = ({
  type,
  webhook_url,
  webhook_active,
  webhook,
  updateBusiness,
  webhookProcess,
  setWebhookProcess,
}) => {
  const [url, setUrl] = useState(webhook_url);
  const [active, setActive] = useState(webhook_active);
  const { t } = useTranslation();


  const [urlPass, setUrlPass] = useState(true);

  const handleURL = (e) => {
    setUrl(e.target.value);
    setUrlPass(RegExp(validate.web).test(e.target.value));
  };

  const initProcess = async (url, active) => {
    setWebhookProcess(true);
    if (!urlPass) {
      setUrlPass(false);
      setWebhookProcess(false);
    } else {
      setUrlPass(true);
      const params = {
        location: "business_information",
        data: {
          webhook:
            type === "live"
              ? {
                  url,
                  active,
                }
              : {
                  testUrl: url,
                  testUrlActive: active,
                },
        },
      };

      updateBusiness(params);
    }
  };

  return (
    <DataWrapper className="bg-white px-4 pb-3 pt-4 sbt-setup mb-3">
      <Wrap>
        <div className="row py-2">
          <div className="col-6 float-left  ">
            <div className="font-medium text-black">
              {type.toUpperCase()} {t("Webhook")}
            </div>
          </div>
          <div className="col-6 text-right">
            <span className="border p-2 br-normal ">
              <span className="font-12 mr-1">{t("Disable")}</span>{" "}
              <AppToggle
                  active={active}
                  onChange={() => setActive(!active)}
              />
              <span className="font-12 ml-1">{t("Enable")}</span>
            </span>
          </div>
        </div>
      </Wrap>
      <div className="row">
        <div className="form-group col-12 mb-2">
          <div className="black font-13">
            {t("Use Connect API webhooks to notify your application when certain payment , inventory, or timecard events occur. Notifications are typically sent within nano seconds of the associated even")}
          </div>
        </div>
        <div className="form-group col-12 mb-0">
          <label className="font-12">
            {type.toUpperCase()} {t("Notification URL")}
          </label>
          <div
            className="input-group mb-3 form-group h-40"
            style={{
              border: "1px solid #b9c0c7",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <div className="input-group-append">
              {/* <button
                className="btn h-25px pt-0 font-16 pr-1"
                style={{ background: "transparent" }}
              >
                https://
              </button> */}
            </div>{" "}
            <input
              className="form-control border-none h-25px pl-0"
              value={url}
              placeholder="https"
              onChange={(e) => {
                handleURL(e);
              }}
            />
            {!urlPass && url && <Error>{t("enter a valid web address")}</Error>}
          </div>
        </div>

        <Can access="MANAGE_API_KEYS">
          <div className="form-group col-12 mb-0 ">
            <Button
              block
              variant="xdh"
              height={"40px"}
              className="brand-btn float-right"
              onClick={() => initProcess(url, active)}
              disabled={webhookProcess}
            >
              {webhookProcess && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              {!webhookProcess && `Subscribe`}
            </Button>
          </div>
        </Can>
      </div>
    </DataWrapper>
  );
};
export { Template };

export default Webhook;
