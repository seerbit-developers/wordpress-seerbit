import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Button from "components/button";
import AppToggle from "components/toggle";
import { alertSuccess, alertInfo, alertError, alertExceptionError } from "modules/alert";
import UpdateSettlementInfoModal from "./components/updateSettlementInfo";
import { dispatchUpdateSingleBusiness, getBusiness } from "../../../actions/postActions";
import {updateBusinessSettlementDetails} from "../../../services/businessService";
import {hostChecker, hostName} from "../../../utils";
import {useTranslation} from "react-i18next";
const debounce = require("lodash/debounce");

const SettlementInformation = ({
  business_details,
  bank_list,
  getBusiness,
  dispatchUpdateSingleBusiness
}) => {
  const [process, setProcess] = useState(false);
  const [settleToPocket, setSettleToPocket] = useState(false);
  const [editMode, setEitMode] = useState(false);
  const [editModal, setEitModal] = useState(false);
  const [banks, setBanks] = useState([]);
  const { t } = useTranslation();
  React.useEffect(() => {
    if (business_details) {
      if (business_details.hasOwnProperty("settleToWallet")) {
        setSettleToPocket(business_details.settleToWallet);
      }
      if (bank_list) {
        if (bank_list.hasOwnProperty("payload")) {
          let banks = bank_list.payload;
          if (hostChecker() !== 'seerbit'){
            banks = banks.filter((item) => {
              return item.bank_name.toLowerCase().indexOf(hostName().toLowerCase()) !== -1
            } )
          }
          banks = banks.map((item) => {
              return {
                label: item.bank_name,
                value: item.bank_code,
                code: item.code,
                bank_nip_code: item.bank_nip_code,
                number: item.number,
              };
            });
          setBanks(banks);
        }
      }
    }
  }, [business_details, bank_list]);

  const getBankName = (code) => {
    const b = bank_list && bank_list.payload && bank_list.payload.find((b) => b.bank_code == code);
    if (b) {
      return b.bank_name;
    } else {
      return code;
    }
  };

  const save = (s) => {
    setProcess(true);
    const p = {
      settleToWallet: s,
    };
    updateBusinessSettlementDetails(p)
      .then((res) => {
        setProcess(false);
        if (res.responseCode === "00") {
          alertSuccess("Successful");
          dispatchUpdateSingleBusiness(res.payload)
        }
        else if (res.responseCode === "02") {
          alertInfo(res.message);
          setSettleToPocket(!s)
        }
         else {
          alertInfo(
            res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again"
          );
        }
      })
      .catch((e) => {
        setProcess(false);
        alertExceptionError(e)
      });
  };

  const debouncedSave = React.useCallback(debounce(save, 1000), []);

  return (
    <div className="configuration__container mt-5">
      {business_details ? (
        <UpdateSettlementInfoModal
          business_details={business_details}
          isOpen={editModal}
          close={() => setEitModal(false)}
          data={business_details ? business_details.payout : null}
          banks={banks}
          update={dispatchUpdateSingleBusiness}
          getBusiness={getBusiness}
        />
      ) : null}
      <div className="d-flex justify-content-between">
        <label className="form__control--label--lg">{t('Bank Payout Details')}</label>
        <Button
          text={editMode ? "Done" : "Edit"}
          type={editMode ? "white" : "secondary"}
          size="sm"
          as="button"
          buttonType="button"
          onClick={() => setEitModal(true)}
        />
      </div>
      <form
        className="w-100 mt-5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <label className="font-12">{t('Account Number')}</label>
            <p className="font-12">
              {business_details
                ? business_details.payout
                  ? business_details.payout.payout_account_number
                  : ""
                : ""}
            </p>
          </div>
          <div className="d-flex flex-column">
            <label className="font-12">{t('Bank Name')}</label>
            <p className="font-12">
              {business_details
                ? business_details.payout
                  ? getBankName(business_details.payout.payout_bank_code)
                  : ""
                : ""}
            </p>
          </div>
          <div className="d-flex flex-column">
            <label className="font-12">{t('Account Name')}</label>
            <p className="font-12">
              {business_details
                ? business_details.payout
                  ? business_details.payout.payout_account_name
                  : ""
                : ""}
            </p>
          </div>
        </div>
        <div className={`input__border--bottom mt-4`} />
        <div className="d-flex justify-content-between mt-4">
          <div>
            <label className="form__control--label--lg">
              {t('Settlement to Pocket')}
            </label>
            <p className="font-12">
              {t('Allow your settlements be paid into your business pocket')}
            </p>
          </div>
          <div className="text-right">
            <label
              className="form__control--label--lg"
              style={{ visibility: "hidden" }}
            >
              {t('Settlement to Pocket')}
            </label>
            <div className="text-right">
              {process ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <AppToggle
                  active={settleToPocket}
                  onChange={() => {
                    setSettleToPocket(!settleToPocket);
                    debouncedSave(!settleToPocket);
                  }}
                  activeClass={"config-active"}
                />
              )}
            </div>
          </div>
        </div>
        <div className={`input__border--bottom mt-3`} />
        {/*<div className="d-flex justify-content-between flex-column mt-4">*/}
        {/*<input*/}
        {/*    className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}*/}
        {/*    type="text"*/}
        {/*    name="phone_number"*/}
        {/*    placeholder="Enter an Email to receive notifications"*/}
        {/*/>*/}
        {/*    <input*/}
        {/*        className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}*/}
        {/*        type="text"*/}
        {/*        name="phone_number"*/}
        {/*        placeholder="Enter an Email to receive notifications"*/}
        {/*    />*/}
        {/*</div>*/}
        {/*<div className={`input__border--bottom mt-3`}/>*/}
        {/*<div className="float-right">*/}
        {/*    <Button*/}
        {/*        text={personalProcess ?*/}
        {/*            <Spinner animation="border" size="sm" variant="light"  disabled={personalProcess}/>: 'Save Changes'}*/}
        {/*        as="button" buttonType='submit'/>*/}
        {/*</div>*/}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  bank_list: state.data.bank_list,
  countries: state.data.countries,
});

export default connect(mapStateToProps, {
  getBusiness,
  dispatchUpdateSingleBusiness
})(SettlementInformation);
