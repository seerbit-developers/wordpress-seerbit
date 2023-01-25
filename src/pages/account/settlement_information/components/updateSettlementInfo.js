import React, { useState } from "react";
import Button from "components/button";
import { Spinner } from "react-bootstrap";
import AppModal from "components/app-modal";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import {
    nameEnquiry,
    updateBusinessSettlementDetails
} from "services/businessService";
import {alertSuccess, alertInfo, alertError, alertExceptionError } from "../../../../modules/alert";

import Joi from '@hapi/joi';
import validationForeign from './validate.foreign';
import validationLocal from './validate.local';
import {useTranslation} from "react-i18next";
const UpdateSettlementInfoModal = ({ isOpen, close, data, banks, getBusiness, business_details,update }) => {
    const [process, setProcess] = useState(false);
    const [open, setOpen] = useState(true);
    const [errors, setErrors] = useState({});
    const [payout_account_number, set_payout_account_number] = useState(data ? data.payout_account_number ? data.payout_account_number : "" : "");
    const [payout_bank_code, set_payout_bank_code] = useState(data ? data.payout_bank_code ? data.payout_bank_code : "" : "");
    const [payout_account_name, set_payout_account_name] = useState(data ? data.payout_account_name ? data.payout_account_name : "" : "");
    const [payout_bvn_number, set_payout_bvn_number] = useState(data ? data.payout_bvn_number ? data.payout_bvn_number : "" : "");
    const { t } = useTranslation();
    const isNigeria =
        business_details &&
        business_details.country &&
        business_details.country.name.toUpperCase() === "NIGERIA";

    const getBankDetails = (v) => {
        if (v.length >= 10 && isNigeria) {
            setProcess(true)
            const p = {
                bankCode: payout_bank_code,
                isCgBankCode: true,
                account: v,
            }
            nameEnquiry(p).then(res => {
                setProcess(false)
                if (res.code === '00') {
                    set_payout_account_name(res.cutomername)
                } else {
                    alertError('We are unable to validate your bank account at the moment. Please try again.')
                }
            }).catch(e => {
                setProcess(false);
                alertExceptionError(e)
            })
        }
    }

    const validate = ()=>{
        if (payout_account_number.length < 4){
            setErrors({payout_account_number:{message: 'Invalid Account number'}})
            return false;
        }
        setErrors({})
        return true;
    }

    const save = async (e) => {
        e.preventDefault()
        if (!validate()){
            return false
        }
        setProcess(true)
        if (isNigeria){
            const p = {
                bankCode: payout_bank_code,
                isCgBankCode: true,
                account: payout_account_number,
            }
            nameEnquiry(p).then( async res => {
                setProcess(false)
                if (res.code === '00') {
                    set_payout_account_name(res.cutomername)
                    const p =
                        {
                            payout_bank_code,
                            payout_account_name,
                            payout_account_number,
                            payout_bvn_number: payout_bvn_number ? payout_bvn_number : "",
                        }
                    const schema = Joi.object(validationLocal);
                    const validation = await schema.validate(p);
                    if (validation.error){
                        alertError(validation.error.message);
                        return
                    }
                    setProcess(true)
                    updateBusinessSettlementDetails({
                        payout: p
                    })
                        .then(res => {
                            setProcess(false)
                            if (res.responseCode === '00') {
                                alertSuccess('Settlement data Updated');
                                close();
                                update(res.payload);
                            }
                            else if (res.responseCode === "02") {
                                alertInfo(res.message);
                                close();
                            }
                            else {
                                alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                            }
                        })
                        .catch(e => {
                            setProcess(false)
                            alertExceptionError(e)
                        }).catch(e => {
                        setProcess(false)
                        alertExceptionError(e)
                    })
                } else {
                    alertError('We are unable to validate your bank account at the moment. Please try again.')
                }
            }).catch(e => {
                setProcess(false);
                alertExceptionError(e)
            })
        }else{
            const p = {
                payout_bank_code,
                payout_account_name,
                payout_account_number,
                payout_bvn_number: payout_bvn_number ? payout_bvn_number : "",
            }
            const schema = Joi.object(validationForeign);
            const validation = await schema.validate(p);
            if (validation.error){
                alertError(validation.error.message);
                setProcess(false)
                return
            }

            updateBusinessSettlementDetails({
                payout: p
            })
                .then(res => {
                    setProcess(false);
                    if (res.responseCode === '00') {
                        alertSuccess('Settlement data Updated');
                        close();
                        update(res.payload);
                    }
                    else if (res.responseCode === "02") {
                        alertInfo(res.message);
                        close();
                    }
                    else {
                        alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                    }
                })
                .catch(e => {
                    setProcess(false)
                    alertExceptionError(e)
                })
        }
    }

    React.useEffect( ()=>{
        validate()
    }, [payout_account_number]);


    React.useEffect( ()=>{
        if (data && data.payout_bank_code){
        }else{
            if (banks && Array.isArray(banks) && banks.length > 0){
                set_payout_bank_code(banks[0].value)
            }
        }
    }, [data, banks])
    return (
        <AppModal title="Settlement Account Details" isOpen={isOpen} close={() => close()}>
            <form
                className="w-100"
                autoComplete="off"
                onSubmit={save}
            >
                <div className="d-flex flex-column justify-content-between ">
                    <div className="mt-5 mb-3">
                        <label htmlFor="payout_account_name">{t('Account Name')}</label>

                        <input
                            className={`d-block form__control--full`}
                            type="text"
                            id="payout_account_name"
                            autoComplete="off"
                            disabled={isNigeria ? true : false}
                            value={payout_account_name}
                            onChange={e => {
                                set_payout_account_name(e.target.value)
                            }}
                        />
                    </div>
                    <div className={`mb-3`}>
                        <label htmlFor="payout_account_number">{t('Account Number')}</label>
                        {errors.payout_account_number && <span className="text-danger pl-2">{errors.payout_account_number.message}</span>}
                        <input
                            className={`d-block form__control--full`}
                            type="text"
                            id="payout_account_number"
                            autoComplete="off"
                            value={payout_account_number}
                            disabled={process}
                            onChange={e => {
                                set_payout_account_number(e.target.value);
                                isNigeria && getBankDetails(e.target.value)
                            }}
                        />
                    </div>
                    {isNigeria && <div className={`mb-3`}>
                        <label htmlFor="payout_bvn_number">{t('BVN')}</label>
                        <input
                            className={`d-block form__control--full`}
                            type="number"
                            autoComplete="off"
                            id="payout_bvn_number"
                            value={payout_bvn_number}
                            disabled={process}
                            onChange={e => set_payout_bvn_number(e.target.value)}
                        />
                    </div>}
                    <div className={`mb-3`}>
                        <label htmlFor="bank">{t('Bank')}</label>
                        <DropdownSelect containerClass="form__control--full"
                                        data={banks}
                                        disabled={process}
                                        defaultValue={payout_bank_code ? payout_bank_code : t('Select a bank')}
                                        id="role"
                                        value={payout_bank_code}
                                        as={'div'}
                                        onChange={({ value }) => {
                                            set_payout_bank_code(value)
                                        }}
                        />
                    </div>

                </div>
                <div className="d-flex justify-content-end">
                    <Button size="sm" text={process ?
                        <Spinner animation="border" size="sm" variant="light" disabled={process} /> : 'Save'}
                            as="button" buttonType='submit' disabled={process} />
                </div>
            </form>
        </AppModal>
    )
}

export default UpdateSettlementInfoModal
