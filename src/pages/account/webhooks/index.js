/**
 * BusinessInformation
 *
 * @format
 */

import React from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Can,CanAccess } from "modules/Can";
import { Spinner } from "react-bootstrap";
import Button from "components/button";
import CardSetting from "../components/cardSetting";
import AppToggle from "../../../components/toggle";
import { alertSuccess, alertInfo, alertError, alertExceptionError } from "../../../modules/alert";
import { updateBusinessSettings } from "../../../services/businessService";
import { getBusiness } from "../../../actions/postActions";
import {useTranslation} from "react-i18next";
const _ = require("lodash");
export const Webhooks = ({ business_details, getBusiness }) => {
  const [webhookLive, setWebhookLive] = React.useState("");
  const [webhookTest, setWebhookTest] = React.useState("");
  const [webhookLiveStatus, setWebhookLiveStatus] = React.useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = React.useState(false);
  const [process, setProcess] = React.useState(false);
  const { t } = useTranslation();
  const data = {
    title: t('Webhooks'),
    description: t('Anytime an event happens on your account, your \n    ' +
        'application can be notified by SeerBit. This is where \n   ' +
        ' webhooks come in. This is useful for events that are \n    ' +
        'not triggered by direct API request, but when the \n    ' +
        'response from that request needs to be known \n    ' +
        '(for instance, in cases when there is an update to a \n    ' +
        'transaction status). It is necessary only for \n    ' +
        'behind-the-scenes transactions. '),
    icon: "webhooks",
    link: "https://doc.seerbit.com/webhook-1",
  };

  const save = (type) => {
    const p = {
      webhook:
        type !== "live"
          ? {
              testUrl: webhookTest,
              testUrlActive: webhookTestStatus,
            }
          : {
              url: webhookLive,
              active: webhookLiveStatus,
            },
    };
    setProcess(true);
    updateBusinessSettings(p)
      .then((res) => {
        if (res.responseCode === "00") {
          setProcess(false);
          alertSuccess("Webhook Settings Updated");
          getBusiness();
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again");
        }
      })
      .catch((e) => {
        setProcess(false);
        alertExceptionError(e)
      })
  };

  React.useEffect(() => {
    if (business_details) {
      if (!_.isNull(business_details.webhook)) {
        setWebhookLive(business_details.webhook.url);
        setWebhookTest(business_details.webhook.testUrl);
        setWebhookTestStatus(business_details.webhook.testUrlActive);
        setWebhookLiveStatus(business_details.webhook.active);
      }
    }
  }, [business_details]);

  return (
    <div>
      <div className="d-flex mt-5">
        <div className="mr-5 mt-3 side">
          <div className="rowx">
            {t('Connect API webhooks to notify your application when certain\n' +
                'payment, inventory, or timecard events occur. Notifications are\n' +
                'typically sent within nano seconds of the associated even.')}
          </div>
          <div className="mt-4 mb-5">
          <Can access="MANAGE_API_KEYS">
            {process ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <AppToggle
                active={webhookLiveStatus}
                onChange={() => setWebhookLiveStatus(!webhookLiveStatus)}
                activeClass={"config-active"}
              />
            )}
            </Can>
            <div style={{ position: "relative" }}>
              <label className="webhooks__label">Live Webhook :</label>
              <input
                className={`d-block form__control--full move-input mb-2`}
                type="text"
                name="live-hook"
                value={webhookLive}
                disabled={!CanAccess('MANAGE_API_KEYS')}
                placeholder="https://webhookurl.com"
                onChange={(e) => setWebhookLive(e.target.value)}
              />
            </div>
            <Can access="MANAGE_API_KEYS">
              <div className="float-right">
                <Button
                  text={
                    process ? (
                      <Spinner
                        animation="border"
                        size="sm"
                        variant="light"
                        disabled={process}
                      />
                    ) : (
                      "Save Changes"
                    )
                  }
                  as="button"
                  buttonType="button"
                  type="secondary"
                  onClick={() => save("live")}
                />
              </div>
            </Can>
          </div>
          <div className="pt-4">
            <div className="my-5">
              <div>
              <Can access="MANAGE_API_KEYS">
                {process ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <AppToggle
                    active={webhookTestStatus}
                    onChange={() => setWebhookTestStatus(!webhookTestStatus)}
                    activeClass={"config-active"}
                  />
                )}
                </Can>
                <div style={{ position: "relative" }}>
                  <label className="webhooks__label">Test Webhook :</label>
                  <input
                    className={`d-block form__control--full move-input `}
                    type="text"
                    name="test-hook"
                    value={webhookTest}
                    disabled={!CanAccess('MANAGE_API_KEYS')}
                    placeholder="https://webhookurl.com"
                    onChange={(e) => setWebhookTest(e.target.value)}
                  />
                </div>
              </div>
              <Can access="MANAGE_API_KEYS">
                <div className="float-right mt-2">
                  <Button
                    text={
                      process ? (
                        <Spinner
                          animation="border"
                          size="sm"
                          variant="light"
                          disabled={process}
                        />
                      ) : (
                        t('Save')
                      )
                    }
                    as="button"
                    buttonType="button"
                    type="secondary"
                    onClick={() => save("test")}
                  />
                </div>
              </Can>
            </div>
          </div>
        </div>
        
        <CardSetting
          key="1"
          index="1"
          item={data}
          goto={() => {}}
          button={true}
          className="custom__setting--box ml-4 boxx"
          link={data.link}
        />
      </div>
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

export default connect(mapStateToProps, {
  getBusiness,
})(Webhooks);
