/**
 * BusinessInformation
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setErrorLog,
} from "actions/postActions";
import { Can } from "modules/Can";
import { Spinner } from "react-bootstrap";
import Button from "components/button";
import Toggle from "components/toggle";
import {updateCheckoutPaymentOptions} from "../../../services/checkoutService";
import {alertError, alertExceptionError, alertSuccess} from "../../../modules/alert";
import {dispatchUpdateSingleBusiness} from "../../../actions/postActions";
import {useTranslation} from "react-i18next";

const CheckoutConfig = ({
  business_details,
  dispatchUpdateSingleBusiness
}) => {

  const [selected, setSelected] = useState("Channels");
  const [chanelOptions, setChanelOptions] = useState([]);
  const [process, setProcess] = useState(false);
  const [settle_to_pocket, setSettleToPocket] = useState();
  const [charge_option, setCharge] = useState();
  const [display_fee, setFee] = useState();
  const [transfer_option, setTransfer] = useState();
  const [bank_option, setBank] = useState();
  const [card_option, setCard] = useState();
  const [settlement_email, setSettlementEmail] = useState();
  const [email_receipt_customer, setCustomerReceipt] = useState();
  const [email_receipt_merchant, setMerchantReceipt] = useState();
  const { t } = useTranslation();


  const initProcess = async () => {};

  // const { settleToWallet } = business_details;

  const tabs = ["Channels", "Transaction Fees", "Transaction Notification"];

  const onEditCheckoutPaymentOptions = (status,number,key)=>{
    const copyOptions = JSON.parse(JSON.stringify(chanelOptions));
    copyOptions[key].allow_option = status;
    setChanelOptions(copyOptions)
  }

  const onUpdateCheckoutPaymentOptions = ()=>{
    const uniqArray = [...new Map(chanelOptions.map(item => [item["code"], item])).values()];
    const co = uniqArray.map(item=>({name:item.name,allow_option:item.allow_option}))
    const params = {
      channelOptionStatus:co,
      setting: {
        card_option:card_option,
        bank_option:bank_option,
        transfer_option:transfer_option,
        display_fee:display_fee,
        email_receipt_customer:email_receipt_customer,
        email_receipt_merchant:email_receipt_merchant,
        charge_option:charge_option,
      }
      }
    setProcess(true)
    updateCheckoutPaymentOptions(params).then(res => {
      if (res.responseCode === '00'){
        setProcess(false)
        dispatchUpdateSingleBusiness(res.payload)
        alertSuccess('Update Successful')
      }else{
        alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
      }
    })
        .catch(e=>{
          setProcess(false)
          alertExceptionError(e)
        })
  }

  useEffect( ()=>{
   if (business_details) {
     if (business_details.hasOwnProperty('country') && business_details.country) {
       if (business_details.hasOwnProperty('channelOptionStatus') && business_details.channelOptionStatus) {
         const filterByCountryStatus = business_details.country.defaultPaymentOptions.map(co=>{
          const c = business_details.channelOptionStatus.find(item => {
            return co.name.toLowerCase() == item.name.toLowerCase()
          })
           if (c){
             return {
               allow_option: c.allow_option,
               status: co.status,
               channelOptionNumber: co.channelOptionNumber,
               code: co.code,
               name: co.name,
               description: co.description,
             }
           }else{
             return {
               allow_option: false,
               status: co.status,
               channelOptionNumber: co.channelOptionNumber,
               code: co.code,
               name: co.name,
               description: co.description,
             }
           }
         });
         setChanelOptions(filterByCountryStatus)
       }
     }
     if (business_details.hasOwnProperty('setting')) {

       setCharge(business_details.setting.charge_option)
       setFee(business_details.setting.display_fee)
       setFee(business_details.setting.display_fee)
       setTransfer(business_details.setting.transfer_option)
       setBank(business_details.setting.bank_option)
       setCard(business_details.setting.card_option)
       setCustomerReceipt(business_details.setting.email_receipt_customer)
       setMerchantReceipt(business_details.setting.email_receipt_merchant)
       setSettlementEmail(business_details.settlementNotificationList[0])
     }
   }
  }, [business_details])
  return (
    <div>
      <div className="configuration__container mt-5">
        <div className="mb-4">
          <hr />
          <div className="d-flex justify-content-between">
            {tabs.map((data, id) => (
              <div
                key={id}
                onClick={() => setSelected(data)}
                className={
                  selected === data
                    ? "cursor-pointer text__color--dark font-bold font-14"
                    : "cursor-pointer text__color--base hov"
                }
              >
                {t(data)}
              </div>
            ))}
          </div>
          <hr />
        </div>
        <div>
          {selected === "Channels" && (
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateCheckoutPaymentOptions();
              }}
            >
              {chanelOptions.map((option, key) =>
              option.status === 'ACTIVE' &&
                <div className={`col-md-12 configuration__item`} key={key}>
                <div className="form__control--label--lg">
                {option.name.charAt(0) +
                option.name.slice(1).toLowerCase()}{" "}
                  {t("Payments")}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <div className="d-block form__control--blank">
                {option.description}
                </div>
                <Toggle
                active={option.allow_option}
                activeClass={"config-active"}
                onChange={(e)=>onEditCheckoutPaymentOptions(e,option.channelOptionNumber,key)}
                />
                </div>
                <div className="input__border--bottom"></div>
                </div>
              )
              }
              <Can access="MANAGE_MERCHANT_PROFILE">
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
                    buttonType="submit"
                  />
                </div>
              </Can>
            </form>
          )}
        </div>

        {/* Transaction FEES */}
        <div>
          {selected === "Transaction Fees" && (
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateCheckoutPaymentOptions();
              }}
            >
                  <div className={`col-md-12 configuration__item`}>
                    <div className="form__control--label--lg">{charge_option !== 'MERCHANT'?
                        t('You have opted to charge your customers the fee for each transaction'):
                        t('You have opted to accept the fee charge for each transaction')
                    }</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-block form__control--blank">
                        {t("Accept card payments Mastercard, Visacard, Verve Card and American Express")}
                      </div>
                      <Toggle
                        active={charge_option === "MERCHANT"}
                        activeClass={"config-active"}
                        onChange={ ()=> setCharge(charge_option === "MERCHANT" ? "CUSTOMER" : "MERCHANT")}
                      />
                    </div>
                    <div className="input__border--bottom" />
                  </div>
              <Can access="MANAGE_MERCHANT_PROFILE">
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
                    buttonType="submit"
                  />
                </div>
              </Can>
            </form>
          )}
        </div>

        {/* Transaction Notification */}

        <div>
          {selected === "Transaction Notification" && (
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateCheckoutPaymentOptions();
              }}
            >
              <div className={`col-md-12 configuration__item`}>
                <div className="form__control--label--lg">{t("Merchant Receipt")}</div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-block form__control--blank">
                    {t("Email receipt to me after successful payment by the customer")}
                  </div>
                  <Toggle
                      active={email_receipt_merchant}
                      activeClass={"config-active"}
                      onChange={(s)=>setMerchantReceipt(s)}
                  />
                </div>
                <div className="input__border--bottom"></div>
              </div>
              <div className={`col-md-12 configuration__item`}>
                <div className="form__control--label--lg">{t("Customer Receipt")}</div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-block form__control--blank">
                    {t("Email receipt to customer after successful payment by the customer")}
                  </div>
                  <Toggle
                      active={email_receipt_customer}
                      activeClass={"config-active"}
                      onChange={(s)=>setCustomerReceipt(s)}
                  />
                </div>
                <div className="input__border--bottom" />
              </div>

              <Can access="MANAGE_MERCHANT_PROFILE">
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
                    buttonType="submit"
                  />
                </div>
              </Can>
            </form>
          )}
        </div>
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
  setErrorLog,
  dispatchUpdateSingleBusiness
})(CheckoutConfig);
