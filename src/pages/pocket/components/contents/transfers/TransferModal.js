import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    transferFund,
    transferNameInquiry,
    clearState,
    getBankList,
} from "actions/postActions";
import { isEmpty } from "lodash";
import AppModal from "components/app-modal";
import Button from "components/button";
import { DebounceInput } from "react-debounce-input";
import { Spinner } from "react-bootstrap";
import {alertError, alertExceptionError, alertInfo, alertSuccess} from "modules/alert";
import {useTranslation} from "react-i18next";
import {nameEnquiry, payoutToBank, validatePayoutToBank} from "services/pocketService";

function PocketTransfer({
                            isOpen,
                            wallet,
                            close,
                            business_details,
                            bank_list,
                            transferFund,
                            error_details,
                            clearState,
                            location,
                            transfer_fund,
                            validate_transfer,
                            getWalletTransaction,
                            getBankList
                        }) {
    const { t } = useTranslation();
    const [newTransfer, setTransfer] = useState({});
    const [processing, setProcessing] = useState(false);
    const [canTransfer, setCanTransfer] = useState(false);
    const [bankList, setBankList] = useState([]);
    const [accountType, setType] = useState("");
    const [bankAccountName, setBankAccountName] = useState(null);
    const [verifying, setVerify] = useState(false);
    const [accounts] = useState([
        { id: 0, type: t('Credit Pocket') },
        { id: 1, type: t('Debit Pocket') },
        { id: 2, type: t('Bank Account') },
    ]);

    const isNigeria =
        business_details &&
        business_details.country &&
        business_details.country.name.toUpperCase() === "NIGERIA";

    useEffect(() => {
        getBankList();
    }, []);

    useEffect(() => {
        setTransfer({})
        setBankAccountName('')
        setType('')
    }, [isOpen]);

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
        if (!newTransfer.transReference && accountType == 1) {
            if (!newTransfer.debitPocketReferenceId){
                return alertError('Pocket ID is required');
            }
            onValidatePayoutToBank(
                { ...newTransfer, type: "DEBIT_POCKET" }
            )
        }

        if (!newTransfer.transReference && accountType == 0) {
            if (!newTransfer.creditPocketReferenceId){
                return alertError('Pocket ID is required');
            }
            onValidatePayoutToBank(
                { ...newTransfer, type: "CREDIT_POCKET" }
            )
        }

        if (!newTransfer.transReference && accountType === 2) {
            isNigeria ? onValidatePayoutToBank(
                {
                    ...newTransfer,
                    bankAccountName: bankAccountName,
                    type: "CREDIT_BANK"
                }) : onValidatePayoutToBank(
                {
                ...newTransfer,
                bankAccountName: bankAccountName,
                isCgBankCode: true
                }
            )
        }

        if (newTransfer.transReference) {
            onPayoutToBank({
                    transReference: newTransfer.transReference,
                    transOtp: newTransfer.otp,
            });
        }
    };

    const onPayoutToBank = (p) => {
        setProcessing(true);
        payoutToBank(p).then(res=>{
            setProcessing(false);
            if (res.responseCode === "00"){
                alertSuccess(res.responseMessage);
                close();
            } else{
                alertError(res.responseMessage)
            }
        }).catch(e=>{
            console.log(e)
            setProcessing(false);
            alertExceptionError(e)
        })
    }

    const onValidatePayoutToBank = (p) => {
        setProcessing(true);
        validatePayoutToBank(p).then(res=>{
            setProcessing(false);
            if (res.responseCode === "00"){
                alertSuccess(res.responseMessage);
                setTransfer(prevState => ({...prevState, ...res.payload}))
            } else{
                alertError(res.responseMessage)
            }
        }).catch(e=>{
            console.log(e)
            setProcessing(false);
            alertExceptionError(e)
        })
    }

    useEffect(() => {
        validateBankAccount();
    }, [newTransfer.bankCode, newTransfer.accountNumber]);

    const validateBankAccount = () => {
        const { bankCode, accountNumber } = newTransfer;
        if (isNigeria) {
            if (
                accountType === 2 &&
                accountNumber &&
                bankCode &&
                accountNumber.length > 7
            ) {
                if (bankCode === 'Select a Bank'){
                    return alertInfo('Select a bank to proceed');
                }
                startNameEnquiry();
                nameEnquiry(
                    { isCgBankCode: false, bankCode, accountNumber }
                ).then(res=>{
                    stopNameEnquiry();
                    console.log('res', res)
                    if (res.responseCode === "00"){
                        setBankAccountName(res.detail);
                    } else {
                        console.log('clear bank ac name')
                        setBankAccountName('')
                    }
                }).catch(e=>{
                    stopNameEnquiry();
                    setBankAccountName('');
                })
            }
        }
    }
    const startNameEnquiry = () => {
        setProcessing(true);
        setCanTransfer(false);
        setVerify(true);
    }
    const stopNameEnquiry = () => {
        setProcessing(false);
        setCanTransfer(true);
        setVerify(false);
    }

    useEffect(() => {
        if (!isEmpty(transferFund)) {
            setProcessing(false);
        }
    }, [transferFund]);

    useEffect(() => {
        setProcessing(false);

        if (error_details && error_details.error_source === "transfer_fund") {
            setProcessing(false);
            alertError(error_details.message);
            clearState({ transfer_inquiry: null });
        }

        if (
            error_details &&
            error_details.error_source === "transfer_name_inquiry"
        ) {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
            clearState({ transfer_name_inquiry: null });
        }

        if (
            error_details &&
            error_details.error_source === "validate_transfer"
        ) {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
            clearState({ validate_transfer: null });
        }

    }, [error_details]);

    useEffect(() => {
        if (location){
            setProcessing(false);
        }
        if (transfer_fund && location === "transfer_fund") {
            setProcessing(false);
            if (!transfer_fund.transReference) {
                alertSuccess(transfer_fund.responseMessage);
                clearState({ transfer_name_inquiry: null });
                clearState({ transfer_fund: null });
                getWalletTransaction()
                close();
            }

            if (transfer_fund.transReference) {
                alertSuccess(
                    "Successful: Please complete the transaction by entering the OTP sent.",
                "sux");
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
            alertSuccess(validate_transfer.responseMessage, "sux");
            clearState({ validate_transfer: null });
            getWalletTransaction()
            close();
        }

    }, [location]);

    const handleValue = (e) => {
        setTransfer(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        });
    };

    return (
        <AppModal
            title={"Transfer"}
            isOpen={isOpen}
            close={() => close(false)}
        >
            <form className="w-100" onSubmit={handleSubmit}>
                {!newTransfer.transReference && (
                    <div className="form-group mh-40 ">
                        <label className="font-12">
                            {t('How much do you want to credit or debit?')}
                        </label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
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
                                disabled={verifying || processing}
                            />
                        </div>
                    </div>
                )}
                {!newTransfer.transReference && (
                    <div className="form-group mh-40 ">
                        <label className="font-12">
                            {t('Select the account type that you want to credit')}
                        </label>
                        <select
                            className="form-control mh-40"
                            name="accountType"
                            onChange={(e) => setType(parseInt(e.target.value))}
                            value={newTransfer.accountType}
                            required
                            disabled={verifying || processing}
                        >
                            {/* <option disabled selected>{t('Type')}</option> */}
                            {accounts.map((list, key) => {
                                return (
                                    <option key={key} value={list.id}>
                                        {list.type}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}
                {!newTransfer.transReference && accountType == 1 && (
                    <div className="form-group mh-40">
                        <label className="font-12">{t('Enter Pocket Reference ID')}</label>
                        <input
                            className="form-control mh-40"
                            type="text"
                            name="debitPocketReferenceId"
                            onChange={(e) => {
                                handleValue(e);
                            }}
                            value={newTransfer.debitPocketReferenceId}
                            required
                            disabled={verifying || processing}
                        />
                    </div>
                )}
                {!newTransfer.transReference && accountType == 0 && (
                    <div className="form-group mh-40">
                        <label className="font-12">{t('Enter Pocket Reference ID')}</label>
                        <input
                            className="form-control mh-40 "
                            type="text"
                            name="creditPocketReferenceId"
                            onChange={(e) => {
                                handleValue(e);
                            }}
                            value={newTransfer.debitPocketReferenceId}
                            required
                            disabled={verifying || processing}
                        />
                    </div>
                )}
                {!newTransfer.transReference &&
                    accountType === 2 && (
                        <div className="form-group mh-40 ">
                            <label className="font-12">{t('Beneficiary Bank')}</label>
                            <select
                                className="form-control mh-40"
                                name="bankCode"
                                onChange={(e) => handleValue(e)}
                                value={newTransfer.bankCode}
                                required
                                disabled={verifying || processing}
                            >
                                <option selected value={null}>{!isEmpty(bankList) ? t('Select a Bank') : t('Loading')+"..."}</option>
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
                    accountType === 2 && (
                        <div className="form-group mh-40">
                            <label className="font-12">{t('Account Number')}</label>
                            <DebounceInput
                                minLength={2}
                                debounceTimeout={2000}
                                className="form-control mh-40 "
                                pattern="^[0-9]*$"
                                type="text"
                                name="accountNumber"
                                onChange={(e) => handleValue(e)}
                                value={newTransfer.accountNumber}
                                required
                                disabled={verifying || processing}
                            />
                        </div>
                    )}

                {isNigeria && !newTransfer.transReference &&
                    accountType === 2 && (
                        <div className="form-group mh-40">
                            <label className="font-12">{t('Account Name')}</label>
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
                    accountType === 2 && (
                        <div className="form-group mh-40">
                            <label className="font-12">{t('Account Name')}</label>
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
                        <label className="font-12">{t('Description')}</label>
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
                            full={true}
                            className="brand-btn"
                            type="submit"
                            // disabled={isNigeria ? (!accountType ? true : accountType == 2 ? !canTransfer : false) : false}
                            disabled={processing || verifying}
                            text={processing ?
                                <Spinner animation="border" size="sm" variant="light" disabled={processing} /> : t('Validate')}
                        />
                        {/* {processing && (
                  <Spinner icon={faSpinner} spin className="font-20" />
                )}{" "}
                Transfer
              </Button> */}
                    </div>
                )}
                {newTransfer.transReference && (
                    <div className="form-group mh-40">
                        <label className="font-12">
                            {t('Enter the OTP code sent to your email here')}
                        </label>
                        <input
                            className="form-control mh-40 "
                            pattern="^[0-9]*$"
                            type="text"
                            name="otp"
                            onChange={(e) => handleValue(e)}
                            value={newTransfer.otp}
                            required
                            disabled={verifying || processing}
                        />
                    </div>
                )}
                {newTransfer.transReference && (
                    <div className="form-group mh-40">
                        <Button
                            variant="xdh"
                            size="lg"
                            block
                            full={true}
                            height={"50px"}
                            className="brand-btn"
                            type="submit"
                            disabled={verifying || processing}
                            text={processing ?
                                <Spinner animation="border" size="sm" variant="light" disabled={process} /> : t('Transfer')}
                        />
                        {/* {processing && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}{" "}
                Submit
              </Button> */}
                    </div>
                )}
            </form>
        </AppModal>
    );
};

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
