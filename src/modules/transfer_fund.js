/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  transferFund,
  transferNameInquiry,
  clearState,
  getBankList,
} from "../actions/postActions";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import cogoToast from "cogo-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { DebounceInput } from "react-debounce-input";
// import styled from "styled-components";
import "./css/module.scss";
import { isEmpty } from "lodash";

const accounts = [
  { id: 0, type: "Credit Pocket" },
  { id: 1, type: "Debit Pocket" },
  { id: 2, type: "Bank Account" },
];

function PocketTransfer({
  wallet,
  show_transfer,
  close,
  business_details,
  bank_list,
  transferFund,
  error_details,
  clearState,
  location,
  transfer_fund,
  validate_transfer,
  transferNameInquiry,
  transfer_name_inquiry,
  getWalletTransaction,
  getBankList
}) {
  const [newTransfer, setTransfer] = useState({});
  const [processing, setProcessing] = useState(false);
  const [canTransfer, setCanTransfer] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [accountType, setType] = useState("");
  const [bankAccountName, setBankAccountName] = useState(null);
  const [verifying, setVerify] = useState(false);

  const isNigeria =
    business_details &&
    business_details.country &&
    business_details.country.name.toUpperCase() === "NIGERIA";

  useEffect(() => {
    getBankList();
  }, []);

  useEffect(() => {
    if (isEmpty(bankList)) {
      filterELigibleBank();
    }
  }, [bank_list]);

  const filterELigibleBank = () => {
    let data;
    if (isNigeria) {
      data = bank_list && bank_list.payload && bank_list.payload.filter(bank => bank.code !== null)
    } else {
      data = bank_list && bank_list.payload && bank_list.payload.filter(bank => bank.bank_code !== null)
    }
    setBankList(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountType === "Credit Bank Account" && newTransfer.amount > (wallet && wallet.payload && wallet.payload.account.balance)) {
      cogoToast.error("Oops! you have insufficient fund to complete this transfer", { position: "top-right" });
      return
    }

    if (accountType === "Credit Pocket" && newTransfer.amount > (wallet && wallet.payload && wallet.payload.account.balance)) {
      cogoToast.error("Oops! you have insufficient fund to complete this transaction", { position: "top-right" });
      return
    }

    setProcessing(true);
    if (!newTransfer.transReference && accountType === "Debit Pocket") {
      transferFund({
        data: { ...newTransfer, type: "DEBIT_POCKET" },
        location: "transfer_fund",
      });
    }

    if (!newTransfer.transReference && accountType === "Credit Pocket") {
      transferFund({
        data: { ...newTransfer, type: "CREDIT_POCKET" },
        location: "transfer_fund",
      });
    }

    if (!newTransfer.transReference && accountType === "Credit Bank Account") {
      isNigeria ? (
        transferFund({
          data: {
            ...newTransfer,
            type: "CREDIT_BANK",
            bankAccountName: bankAccountName,
          },
          location: "transfer_fund",
        })
      ) : (
        transferFund({
          data: {
            ...newTransfer,
            type: "CREDIT_BANK",
            bankAccountName: bankAccountName,
            isCgBankCode: true
          },
          location: "transfer_fund",
        })
      )
    }

    if (newTransfer.transReference) {
      transferFund({
        data: {
          transReference: newTransfer.transReference,
          transOtp: newTransfer.otp,
        },
        location: "validate_transfer",
      });
    }
  };

  useEffect(() => {
    const { bankCode, accountNumber } = newTransfer;
    if (isNigeria) {
      if (
        accountType === "Credit Bank Account" &&
        accountNumber &&
        bankCode &&
        newTransfer.accountNumber.length > 7
      ) {
        setVerify(true);
        setBankAccountName(null);
        setCanTransfer(false)
        setProcessing(true);
        transferNameInquiry({
          data: { isCgBankCode: false, bankCode, accountNumber },
          location: "transfer_name_inquiry",
        });
      }
    }
  }, [newTransfer.accountNumber, newTransfer.bankCode]);

  useEffect(() => {
    if (!isEmpty(transferFund)) {
      setProcessing(false);
    }
  }, [transferFund]);

  useEffect(() => {
    setVerify(false);
    if (!isEmpty(transfer_name_inquiry)) {
      const { detail } = transfer_name_inquiry;
      if (!isEmpty(detail)) {
        setBankAccountName(detail);
        setCanTransfer(true)
        setProcessing(false);
        clearState({ transfer_name_inquiry: null });
      } else {
        setProcessing(false);
        cogoToast.error(
          "Sorry! We are unable to verify your account. Please try again.",
          { position: "top-right" }
        );
        clearState({ transfer_name_inquiry: null });
      }
    } else {
      setProcessing(false);
      clearState({ transfer_name_inquiry: null });
    }
  }, [transfer_name_inquiry]);

  useEffect(() => {
    setProcessing(false);

    if (error_details && error_details.error_source === "transfer_fund") {
      setProcessing(false);
      cogoToast.error(error_details.message, { position: "top-right" });
      clearState({ transfer_inquiry: null });
    }

    if (
      error_details &&
      error_details.error_source === "transfer_name_inquiry"
    ) {
      setProcessing(false);
      cogoToast.error(error_details.message || error_details.responseMessage, { position: "top-right" });
      clearState({ transfer_name_inquiry: null });
    }

    if (
      error_details &&
      error_details.error_source === "validate_transfer"
    ) {
      setProcessing(false);
      cogoToast.error(error_details.message || error_details.responseMessage, { position: "top-right" });
      clearState({ validate_transfer: null });
    }

  }, [error_details]);

  useEffect(() => {
    if (transfer_fund && location === "transfer_fund") {
      setProcessing(false);
      if (!transfer_fund.transReference) {
        cogoToast.success(transfer_fund.responseMessage, {
          position: "top-right",
        });
        clearState({ transfer_name_inquiry: null });
        clearState({ transfer_fund: null });
        getWalletTransaction()
        close();
      }

      if (transfer_fund.transReference) {
        cogoToast.success(
          "Successful: Please complete the transaction by entering the OTP sent.",
          {
            position: "top-right",
          }
        );
        setTransfer({
          ...newTransfer,
          transReference: transfer_fund.transReference,
          expiresAt: transfer_fund.expiresAt,
        });
        clearState({ transfer_name_inquiry: null });
      }
    }

    if (validate_transfer && location === "validate_transfer") {
      setProcessing(false);
      cogoToast.success(validate_transfer.responseMessage, {
        position: "top-right",
      });
      clearState({ validate_transfer: null });
      getWalletTransaction()
      close();
    }

  }, [location]);

  const handleValue = (e) => {
    setTransfer({ ...newTransfer, [e.target.name]: e.target.value });
  };

  return (
    <Modal centered show={show_transfer} onHide={close} size="md">
      <Modal.Body className="py-3 px-4">
        <Modal.Title className="font-20 text-dark pb-3">
          <div className="py-2 text-bold">
            <strong>New Transfer</strong>
          </div>
        </Modal.Title>
        <form className="w-100" onSubmit={handleSubmit}>
          {!newTransfer.transReference && (
            <div className="form-group mh-40 ">
              <label className="font-12">
                How much do you want to credit or debit?
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1">
                    {business_details.default_currency}
                  </span>
                </div>
                <input
                  className="form-control mh-40 "
                  pattern="^(0|[1-9][0-9]*)$"
                  type="text"
                  name="amount"
                  onChange={(e) => handleValue(e)}
                  value={newTransfer.amount}
                  required
                />
              </div>
            </div>
          )}
          {!newTransfer.transReference && (
            <div className="form-group mh-40 ">
              <label className="font-12">
                Select the account type that you want to credit
              </label>
              <select
                className="form-control mh-40"
                name="accountType"
                onChange={(e) => setType(e.target.value)}
                value={newTransfer.accountType}
                required
              >
                {/* <option selected>-- Type --</option> */}
                {accounts.map((list, key) => {
                  return (
                    <option key={key} value={list.type}>
                      {list.type}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {!newTransfer.transReference && accountType === "Debit Pocket" && (
            <div className="form-group mh-40">
              <label className="font-12">Enter Pocket ReferenceId</label>
              <input
                className="form-control mh-40"
                type="text"
                name="debitPocketReferenceId"
                onChange={(e) => {
                  handleValue(e);
                }}
                value={newTransfer.debitPocketReferenceId}
                required
              />
            </div>
          )}
          {!newTransfer.transReference && accountType === "Credit Pocket" && (
            <div className="form-group mh-40">
              <label className="font-12">Enter Pocket ReferenceId</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="creditPocketReferenceId"
                onChange={(e) => {
                  handleValue(e);
                }}
                value={newTransfer.debitPocketReferenceId}
                required
              />
            </div>
          )}
          {!newTransfer.transReference &&
            accountType === "Credit Bank Account" && (
              <div className="form-group mh-40 ">
                <label className="font-12">Beneficiary Bank</label>
                <select
                  className="form-control mh-40"
                  name="bankCode"
                  onChange={(e) => handleValue(e)}
                  value={newTransfer.bankCode}
                  required
                >
                  <option selected>{!isEmpty(bankList) ? "-- Select Bank --" : "Loading..."}</option>
                  {!isEmpty(bankList) &&
                    bankList.map((list, key) => {
                      return (
                        isNigeria ? (
                          <option key={key} value={list.code}>
                            {list.bank_name}
                          </option>
                        ) : (
                          <option key={key} value={list.bank_code}>
                            {list.bank_name}
                          </option>
                        )
                      );
                    })}
                </select>
              </div>
            )}
          {!newTransfer.transReference &&
            accountType === "Credit Bank Account" && (
              <div className="form-group mh-40">
                <label className="font-12">Account Number</label>

                <DebounceInput
                  minLength={2}
                  debounceTimeout={1000}
                  className="form-control mh-40 "
                  pattern="^[0-9]*$"
                  type="text"
                  name="accountNumber"
                  onChange={(e) => handleValue(e)}
                  value={newTransfer.accountNumber}
                  required
                />
              </div>
            )}

          {isNigeria && !newTransfer.transReference &&
            accountType === "Credit Bank Account" && (
              <div className="form-group mh-40">
                <label className="font-12">Account Name</label>
                <div className="font-11 font-italics my-1">{verifying && "verifying..."}</div>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="bankAccountName"
                  onChange={(e) => handleValue(e)}
                  value={bankAccountName}
                  required
                  disabled
                />
              </div>
            )}

          {!isNigeria && !newTransfer.transReference &&
            accountType === "Credit Bank Account" && (
              <div className="form-group mh-40">
                <label className="font-12">Account Name</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="bankAccountName"
                  onChange={(e) => handleValue(e)}
                  value={bankAccountName}
                  required
                />
              </div>
            )}

          {!newTransfer.transReference && (
            <div className="form-group mh-40 ">
              <label className="font-12">Description</label>
              <input
                className="form-control mh-40 "
                placeholder="Optional"
                type="text"
                name="narration"
                onChange={(e) => handleValue(e)}
                value={newTransfer.narration}
              />
            </div>
          )}
          {!newTransfer.transReference && (
            <div className="form-group mh-40">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"50px"}
                className="brand-btn"
                type="submit"
                disabled={isNigeria ? (!accountType ? true : accountType === "Credit Bank Account" ? !canTransfer : false) : false}
              >
                {processing && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}{" "}
                Transfer
              </Button>
            </div>
          )}
          {newTransfer.transReference && (
            <div className="form-group mh-40">
              <label className="font-12">
                Enter the generated OTP code here
              </label>
              <input
                className="form-control mh-40 "
                pattern="^[0-9]*$"
                type="text"
                name="otp"
                onChange={(e) => handleValue(e)}
                value={newTransfer.otp}
                required
              />
            </div>
          )}
          {newTransfer.transReference && (
            <div className="form-group mh-40">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"50px"}
                className="brand-btn"
                type="submit"
                disabled={processing}
              >
                {processing && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}{" "}
                Submit
              </Button>
            </div>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  bank_list: state.data.bank_list,
  business_details: state.data.business_details,
  add_pocket_customer: state.data.add_pocket_customer,
  error_details: state.data.error_details,
  location: state.data.location,
  transfer_fund: state.data.transfer_fund,
  validate_transfer: state.data.validate_transfer,
  transfer_name_inquiry: state.data.transfer_name_inquiry,
});
export default connect(mapStateToProps, {
  getBankList,
  transferFund,
  clearState,
  transferNameInquiry,
})(PocketTransfer);
