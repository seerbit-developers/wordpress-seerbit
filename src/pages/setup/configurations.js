/**
 * BankAccount
 *
 * @format
 */

import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { clearState } from "../../actions/postActions";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import cogoToast from "cogo-toast";
import styled from "styled-components";
import verify from "../../utils/strings/verify";
import validate from "../../utils/strings/validate";
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

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

export function PaymentConfig({
  business_details,
  updateBusiness,
  configProcess,
  setConfigProcess,
  updateSettlement,
  error_details,
  location
}) {
  return (
    <>
      <Template
        type={"test"}
        updateBusiness={(params) => updateBusiness(params)}
        updateSettlement={updateSettlement}
        business_details={business_details}
        configProcess={configProcess}
        setConfigProcess={setConfigProcess}
        location={location}
        error_details={error_details}
      />{" "}
    </>
  );
}

const Template = ({
  business_details,
  updateBusiness,
  updateSettlement,
  configProcess,
  setConfigProcess,
  error_details,
  location
}) => {
  const uniq = (arr) =>
    arr.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);

  const mapOption = (business_details) => {
    let result = {};
    business_details.channelOptionStatus.map((option) => {
      result = {
        ...result,
        [option.name]: option.allow_option,
      };
    });
    return result;
  };

  const mapChannel = (business_details) => {
    let result = [];
    business_details.channelOptionStatus.map((option) => {
      const set = {
        name: option.name,
        allow_option: option.allow_option,
      };
      result = uniq([set, ...result], (it) => it.u);
    });
    return result;
  };

  const { setting, country, settleToWallet } = business_details;

  const [email_receipt_merchant, setMerchantReciept] = useState(
    setting.email_receipt_merchant
  );
  const [email_receipt_customer, setCustomerReciept] = useState(
    setting.email_receipt_customer
  );
  const { t } = useTranslation();

  const [settle_to_pocket, setSettleToPocket] = useState();
  const [charge_option, setCharge] = useState(setting.charge_option);
  const [display_fee, setFee] = useState(setting.display_fee);
  const [transfer_option, setTransfer] = useState(setting.transfer_option);
  const [bank_option, setBank] = useState(setting.bank_option);
  const [card_option, setCard] = useState(setting.card_option);
  const [settlement_email, setSettlementEmail] = useState(business_details && business_details.settlementNotificationList[0]);

  const [items, setItems] = useState(mapOption(business_details));
  const [channelOptionStatus, setChannelOptionStatus] = useState(
    mapChannel(business_details)
  );

  const params = {
    data: {
      channelOptionStatus,
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



  const initProcess = async () => {

    if (settle_to_pocket !== undefined) {
      updateSettlement({
        data: { settleToWallet: settle_to_pocket },
        location: "settle_to_pocket",
      })
    }
    if (business_details && business_details.settlementNotificationList[0] !== settlement_email) {
      updateBusiness({
        data: { settlementNotificationEmails: [settlement_email] },
        location: "settlement_email",
        type: "settlement_email",
      })
    }
    updateBusiness(params);
  };


  useEffect(() => {
    if (
      error_details &&
      (error_details.error_source === "settle_to_pocket" || error_details.error_source === "settlement_email")
    ) {
      setConfigProcess(false);
      cogoToast.error(error_details.message || error_details.responseMessage, { position: "top-right" });
      clearState({ name: "settle_to_pocket", value: null });
      clearState({ name: "settlement_email", value: null });
    }
  }, [error_details]);

  return (
    <DataWrapper className="bg-white px-4 pb-2 pt-3 sbt-setup mb-3">
      <Wrap>
        <div className="font-medium text-black">{t("Account Configuration")}</div>
      </Wrap>
      <form
        className="w-100"
        onSubmit={(e) => {
          e.preventDefault();
          setConfigProcess(true);
          initProcess(
            settlement_email,
            card_option,
            bank_option,
            transfer_option,
            display_fee,
            email_receipt_customer,
            email_receipt_merchant,
            charge_option,
            settle_to_pocket
          );
        }}
      >
        <div className="w-100 row font-12">
          <div className="col-md-4 my-2 ">
            <div className="  text-muted">{t("Payment Channels")}</div>
          </div>

          {country && (
            <div className="col-md-8 my-1">
              {country.defaultPaymentOptions &&
                country.defaultPaymentOptions.map((option, key) => {
                  return (
                    option.status === "ACTIVE" && (
                      <div className="form-group mb-0 form-inline">
                        <div className="form-group">
                          <input
                            type="checkbox"
                            className="form-control mr-3"
                            checked={items[option.name]}
                            onChange={(e) => {
                              const set = {
                                name: option.name,
                                allow_option: !items[option.name],
                              };

                              setItems({
                                ...items,
                                [option.name]: !items[option.name],
                              });
                              setChannelOptionStatus(
                                uniq(
                                  [set, ...channelOptionStatus],
                                  (it) => it.u
                                )
                              );
                            }}
                          />
                        </div>
                        <label className="form-label mx-2">
                          {`${t("Allow")} ${option.name}  ${t("payments")}`}
                        </label>
                      </div>
                    )
                  );
                })}
            </div>
          )}

          {!country && (
            <div className="col-md-8 my-1">
              <div className="form-group mb-0 form-inline">
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-control mr-3"
                    checked={card_option}
                    onChange={(e) => {
                      setCard(!card_option);
                    }}
                  />
                </div>
                <label className="form-label   mx-2">{t("Allow card payments")}</label>
              </div>
              <div className="form-group mb-0 form-inline">
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-control mr-3"
                    checked={bank_option}
                    onChange={(e) => {
                      setBank(!bank_option);
                    }}
                  />
                </div>
                <label className="form-label   mx-2">{t("Allow bank payments")}</label>
              </div>
              <div className="form-group mb-0 form-inline">
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-control  mr-3"
                    checked={transfer_option}
                    onChange={(e) => {
                      setTransfer(!transfer_option);
                    }}
                  />
                </div>
                <label className="form-label   mx-2">
                  {t("Allow transfer payments")}
                </label>
              </div>
            </div>
          )}
          <div className="col-md-4 my-2">
            <div className=" text-muted">{t("Transaction Fees")}</div>
          </div>
          <div className="col-md-8 my-1">
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="radio"
                  className="form-control mr-3"
                  name="optradio"
                  checked={charge_option === "CUSTOMER"}
                  onChange={(e) => {
                    setFee(true);
                    setCharge("CUSTOMER");
                  }}
                />
              </div>
              <label className="form-label  mx-2">
                {t("Charge my customers for the transaction fees")}
              </label>
            </div>
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="radio"
                  className="form-control mr-3"
                  name="optradio"
                  checked={charge_option === "MERCHANT"}
                  onChange={(e) => {
                    setFee(false);
                    setCharge("MERCHANT");
                  }}
                />
              </div>
              <label className="form-label   mx-2">
                {t("Charge me for the transaction fees")}
              </label>
            </div>
          </div>

          <div className="col-md-4 my-2">
            <div className=" text-muted">{t("Receipt")}</div>
          </div>
          <div className="col-md-8 my-1">
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="checkbox"
                  className="form-control mr-3"
                  checked={email_receipt_customer}
                  onChange={(e) => {
                    setCustomerReciept(!email_receipt_customer);
                  }}
                />
              </div>
              <label className="form-label  mx-2">
                {t("Email receipt to customer")}
              </label>
            </div>
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="checkbox"
                  className="form-control mr-3"
                  checked={email_receipt_merchant}
                  onChange={(e) => {
                    setMerchantReciept(!email_receipt_merchant);
                  }}
                />
              </div>
              <label className="form-label   mx-2">{t("Email receipt to me")}</label>
            </div>
          </div>
          <div className="col-md-4 my-2">
            <div className=" text-muted">{t("Settlement")}</div>
          </div>
          <div className="col-md-8 my-1">
            <div className="form-group mb-0 form-inline">
              <div className="form-group">
                <input
                  type="checkbox"
                  className="form-control mr-3"
                  checked={settle_to_pocket !== undefined ? settle_to_pocket : settleToWallet}
                  onChange={(e) => {
                    setSettleToPocket(!settle_to_pocket);
                  }}
                />
              </div>
              <label className="form-label  mx-2">
                {t("Settle to pocket")}
              </label>
            </div>
          </div>
          <div className="col-4 my-3">
            <div className=" text-muted">{t("Receive Settlement Report")}</div>
          </div>
          <div className="col-md-8 my-1">
            <div className="form-group mb-0 form-inline">
              <div className="form-group w-100">
                {" "}
                <input
                  className="form-control mh-40 "
                  placeholder={t("Provide email here")}
                  type="email"
                  name="settlement_email"
                  onChange={(e) => setSettlementEmail(e.target.value)}
                  value={settlement_email}
                />
              </div>
            </div>
          </div>

          <div className="form-group mt-2 col-12">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"40px"}
              className="brand-btn"
              type="submit"
              disabled={configProcess}
            >
              {configProcess && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              {!configProcess && `Save Changes`}
            </Button>
          </div>
        </div>
      </form>
    </DataWrapper>
  );
};
export { Template };

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  clearState,
})(PaymentConfig);
