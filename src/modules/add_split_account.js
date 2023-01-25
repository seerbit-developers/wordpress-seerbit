/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  createSplitAccount,
  getVendors,
  nameInquiry,
  clearState,
  updateSplitAccount
} from "../actions/postActions";
import { Button } from "react-bootstrap";
import { isEmpty } from "lodash";
import AppModal from "components/app-modal";
import "./css/module.scss";
import cogoToast from "cogo-toast";
import {Loader} from "semantic-ui-react";
import {alertError, alertSuccess} from "./alert";
import {useTranslation} from "react-i18next";

function AddSplitAccount(props) {
  const {t} = useTranslation()
  const {
    business_details,
    name_inquiry,
    nameInquiry,
    create_split_account,
    createSplitAccount,
    close,
    getVendors,
    bank_list,
    isEdit,
    updateSplitAccount,
    selectedAccount
  } = props;
  const [newAccount, setNewAccount] = useState({});
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerify] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [principalValue, setMyShare] = useState(0);
  const [subAccountValue, setSubAccountShare] = useState(0);

  const isNigeria =
    business_details &&
    business_details.country &&
    business_details.country.name.toUpperCase() === "NIGERIA";

  useEffect(() => {
    if (!isEmpty(create_split_account)) {
      setProcessing(false);
    }
  }, [create_split_account]);

  useEffect(() => {
    if (isEmpty(bankList)) {
      filterELigibleBank();
    }
  }, [bank_list]);

  useEffect(() => {
    const share = newAccount.type === "PERCENTAGE" ? 100 - principalValue : 0;
    setSubAccountShare(share);
    setNewAccount({ ...newAccount, principalValue: Number(principalValue), subAccountValue: Number(share) });
  }, [principalValue])

  useEffect(() => {
    if (newAccount.bankCode && !isEmpty(bankList)) {
      const selectedBank = bankList.filter((list) => list.bank_code === newAccount.bankCode);
      !isEmpty(selectedBank) && setNewAccount({ ...newAccount, bankName: selectedBank[0].bank_name });
    }
  }, [newAccount.bankCode])

  const filterELigibleBank = () => {
    let data;
    if (isNigeria) {
      data = bank_list && bank_list.payload && bank_list.payload.filter(bank => bank.code !== null)
    } else {
      data = bank_list && bank_list.payload && bank_list.payload.filter(bank => bank.bank_code !== null)
    }
    setBankList(data);
  };

  useEffect(() => {
    const { bankCode, accountNumber } = newAccount;
    if (isNigeria) {
      if (
        accountNumber &&
        bankCode &&
        newAccount.accountNumber.length > 9
      ) {
        setNewAccount({ ...newAccount, accountName: "" });
        setVerify(true);
        nameInquiry({
          data: { bankCode, isCgBankCode: true, account: accountNumber },
          location: "name_inquiry",
        });
      }
    }
  }, [newAccount.accountNumber, newAccount.bankCode]);

  useEffect(() => {
    if (!isEmpty(name_inquiry)) {
      const { code, cutomername } = name_inquiry;
      if (code === "00") {
        setNewAccount({ ...newAccount, accountName: cutomername });
        setVerify(false);
        alertSuccess(
          "Verified Successfully"
        );
      }
    }
    clearState({ name: "name_inquiry", value: null });
  }, [name_inquiry]);

  useEffect(() => {
    props.clearState({ error_details: null })
    if (
      props.error_details &&
      props.error_details.error_source === "name_inquiry"
    ) {
      setVerify(false);
      setProcessing(false);
      alertError(props.error_details.message);
      props.clearState({ error_details: null })
    }

    if (
      props.error_details &&
      props.error_details.error_source === "create_split_account"
    ) {
      setProcessing(false);
      alertError(props.error_details.message);
      props.clearState({ error_details: null })
    }

    if (
      props.error_details &&
      props.error_details.error_source === "update_split_account"
    ) {
      setProcessing(false);
      alertError(props.error_details.message);
      props.clearState({ error_details: null })
    }
  }, [props.error_details]);

  useEffect(() => {
    if (props.create_split_account && props.location === "create_split_account") {
      setProcessing(false);
      alertSuccess("Split account was added successfully");
      props.clearState({ create_split_account: null })
      getVendors();
      close();
    }

    if (props.update_split_account && props.location === "update_split_account") {
      setProcessing(false);
      alertSuccess("Split Account was updated successfully");
      props.clearState({ update_split_account: null })
      getVendors();
      close();
    }
  }, [props.location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newAccount.subAccountValue > 100 || newAccount.subAccountValue < 0) {
      alertSuccess("Note: your minimum percentage range should not be below 0 and the maximum percentage range should not be above 100");
      return
    }

    setProcessing(true);

    !isEdit ? (
      createSplitAccount({ data: newAccount, location: "create_split_account" })
    ) : (
      updateSplitAccount({
        data: {
          accountName: !newAccount.accountName ? selectedAccount.accountName : newAccount.accountName,
          bankName: !newAccount.bankName ? selectedAccount.bankName : newAccount.bankName,
          email: !newAccount.email ? selectedAccount.email : newAccount.email,
          phoneNumber: !newAccount.phoneNumber ? selectedAccount.phoneNumber : newAccount.phoneNumber,
          type: !newAccount.type ? selectedAccount.type : newAccount.type,
          subAccountValue: !newAccount.subAccountValue ? selectedAccount.subAccountValue : newAccount.subAccountValue,
          accountNumber: !newAccount.accountNumber ? selectedAccount.accountNumber : newAccount.accountNumber,
          businessName: !newAccount.businessName ? selectedAccount.businessName : newAccount.businessName,
          bankCode: !newAccount.bankCode ? selectedAccount.bankCode : newAccount.bankCode,
          principalValue: !newAccount.principalValue ? selectedAccount.principalValue : newAccount.principalValue,
        },
        location: "update_split_account",
        subAccountId: selectedAccount.subAccountId
      })
    )

  };

  const handleValue = (e) => {
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
  };

  const canTransfer = isEdit && newAccount.accountName === undefined ? true : newAccount.accountName && newAccount.accountName !== ""


  return (
    <AppModal title={isEdit ? t("Update Split Settlement Account") : t("Create Split Settlement Account")} isOpen={props.isOpen} close={() => close(false)}>
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="form-group mh-40 ">
          <label className="font-12">{t('Business Name')}</label>
          <input
            className="form-control mh-40 "
            type="text"
            name="businessName"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.businessName === undefined ? selectedAccount && selectedAccount.businessName : newAccount.businessName}
            required
          />
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">{t('Settlement Bank Name')}</label>
          <select
            className="form-control mh-40"
            name="bankCode"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.bankCode === undefined ? selectedAccount && selectedAccount.bankCode : newAccount.bankCode}
            required
          >
            <option selected disabled>{!isEmpty(bankList) ? t('Select a bank') : t('Loading')+"..."}</option>
            {!isEmpty(bankList) &&
              bankList.map((list, key) => {
                return (
                  <option key={key} value={list.bank_code}>
                    {list.bank_name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">{t('Settlement Bank Account Number')}</label>
          <input
            className="form-control mh-40 "
            type="text"
            name="accountNumber"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.accountNumber === undefined ? selectedAccount && selectedAccount.accountNumber : newAccount.accountNumber}
            required
          />
        </div>

        {isNigeria && <div className="form-group mh-40">
          <label className="font-12">{t('Account Name')}</label>
          <div className="font-11 font-italics my-1">{verifying && t('verifying')+"..."}</div>
          <input
            className="form-control mh-40"
            type="text"
            name="accountName"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.accountName === undefined ? selectedAccount && selectedAccount.accountName : newAccount.accountName}
            required
            disabled
          />
        </div>}

        {!isNigeria && <div className="form-group mh-40">
          <label className="font-12">{t('Account Name')}</label>
          <input
            className="form-control mh-40"
            type="text"
            name="accountName"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.accountName === undefined ? selectedAccount && selectedAccount.accountName : newAccount.accountName}
            required
          />
        </div>}

        <div className="py-2 text-bold">
          <strong>{t('Split Rules')}</strong>
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">{t('Split Type')}</label>
          <select
            className="form-control mh-40"
            name="type"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.type === undefined ? selectedAccount && selectedAccount.type : newAccount.type}
            required
          >
            <option selected disabled>{t('Select Split Type')}</option>
            <option value="PERCENTAGE">{t('Percentage')} </option>
            <option value="FLAT">{t('Flat')}</option>
          </select>
        </div>

        {newAccount && newAccount.type === "PERCENTAGE" && (
          <div className="d-flex flex-row justify-content-between p-0 m-0">
            <div className="form-group mh-40 ">
              <label className="font-12">{t('My Share')}</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    %
                  </span>
                </div>
                <input
                  className="form-control mh-40"
                  style={{ width: "180px" }}
                  name="principalValue"
                  type="number"
                  pattern="^\d*(\.\d{0,2})?$"
                  step=".01"
                  min="0"
                  max="100.00"
                  value={principalValue}
                  onChange={(e) => setMyShare(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mh-40 ">
              <label className="font-12">{t("Sub Account's Share")}</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    %
                  </span>
                </div>
                <input
                  className="form-control mh-40"
                  style={{ width: "180px" }}
                  type="number"
                  pattern="^\d{1,3}$"
                  name="subAccountValue"
                  value={subAccountValue}
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {isEdit && selectedAccount && selectedAccount.type === "PERCENTAGE" && (
          <div className="d-flex flex-row justify-content-between p-0 m-0">
            <div className="form-group mh-40 ">
              <label className="font-12">{t("My Share")}</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    %
                  </span>
                </div>
                <input
                  className="form-control mh-40"
                  style={{ width: "180px" }}
                  name="principalValue"
                  type="number"
                  pattern="^\d{1,3}$"
                  min="0"
                  max="100.00"
                  value={isEdit && principalValue === 0 ? selectedAccount.principalValue : principalValue}
                  onChange={(e) => setMyShare(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mh-40 ">
              <label className="font-12">{t("Sub Account's Share")}</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    %
                  </span>
                </div>
                <input
                  className="form-control mh-40"
                  style={{ width: "180px" }}
                  type="number"
                  pattern="^\d{1,3}$"
                  name="subAccountValue"
                  value={isEdit && subAccountValue === 0 ? selectedAccount.subAccountValue : subAccountValue}
                  disabled
                />
              </div>
            </div>
          </div>)}

        {newAccount && newAccount.type === "FLAT" && (<div className="form-group mh-40 ">
          <label className="font-12">{t("Flat Rate")}</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                {business_details ? business_details.default_currency : ''}
              </span>
            </div>
            <input
              className="form-control mh-40 "
              type="number"
              name="principalValue"
              pattern="^(0|[1-9][0-9]*)$"
              onChange={(e) => setMyShare(e.target.value)}
              value={principalValue}
              required
            />
          </div>
        </div>
        )}

        {isEdit && selectedAccount.type === "FLAT" && (
          <div className="form-group mh-40 ">
            <label className="font-12">{t("Flat Rate")}</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  {business_details && business_details.default_currency}
                </span>
              </div>
              <input
                className="form-control mh-40 "
                type="number"
                name="principalValue"
                pattern="^(0|[1-9][0-9]*)$"
                onChange={(e) => setMyShare(e.target.value)}
                value={isEdit && principalValue === 0 ? selectedAccount.principalValue : principalValue}
                required
              />
            </div>
          </div>

        )}

        <div className="py-2 text-bold">
          <strong>{t("Optional")}</strong>
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">{t("Phone Number")}</label>
          <input
            className="form-control mh-40 "
            type="tel"
            name="phoneNumber"
            pattern="(\+\d{2})?((\(0\)\d{2,3})|\d{2,3})?\d+"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.phoneNumber === undefined ? selectedAccount && selectedAccount.phoneNumber : newAccount.phoneNumber}
          />
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">{t("Email Address")}</label>
          <input
            className="form-control mh-40 "
            type="email"
            name="email"
            onChange={(e) => handleValue(e)}
            value={isEdit && newAccount && newAccount.emailAddress === undefined ? selectedAccount && selectedAccount.emailAddress : newAccount.emailAddress}
          />
        </div>

        <div className="form-group mh-40">
          <Button
            variant="xdh"
            size="lg"
            block
            height={"50px"}
            className="brand-btn"
            type="submit"
            disabled={!canTransfer || processing}
          >
            {processing && (
                <Loader active inline='centered' />
            )}{" "}
            {isEdit ? t("Update Account") : t("Create Account")}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  name_inquiry: state.data.name_inquiry,
  bank_list: state.data.bank_list,
  create_split_account: state.data.create_split_account,
  update_split_account: state.data.update_split_account,
  error_details: state.data.error_details,
  location: state.data.location,
});
export default connect(mapStateToProps, {
  createSplitAccount,
  nameInquiry,
  getVendors,
  clearState,
  updateSplitAccount
})(AddSplitAccount);

