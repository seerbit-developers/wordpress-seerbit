/**
 * BankAccount
 *
 * @format
 */

import React, { useState } from "react";
import verify from "utils/strings/verify";
import validate from "utils/strings/validate.json";
import { Loader } from 'semantic-ui-react'
import  Button from "components/button";
import styled from "styled-components";
import AppModal from "components/app-modal";
import {useTranslation} from "react-i18next";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1;
  font-weight: normal;
  margin-top: .2em;
`;

const NewBusinessRequestModal = ({
                         close,
                         industry_list,
                         countries,
                         addBusiness,
                         setProcessBusiness,
                         processBusiness,
                         show
                     }) => {
    const { t } = useTranslation();
    const [business_name, setBusinessName] = useState();
    const [business_email, setBusinessEmail] = useState();
    const [support_email, setSupportEmail] = useState();
    const [support_phone, setSupportPhone] = useState();
    const [industryCode, setIndustryCode] = useState(
        industry_list && industry_list[0].industry_code
    );
    const [countryCode, setCountryCode] = useState(
        countries && countries[0].countryCode
    );

    const [businessNamePass, setBusinessNamePass] = useState(false);
    const [businessEmailPass, setBusinessEmailPass] = useState(false);
    const [supportEmailPass, setSupportEmailPass] = useState(false);
    const [supportPhonePass, setSupportPhonePass] = useState(false);
    const [industryCodePass, setIndustryCodePass] = useState(true);
    const [countryCodePass, setCountryCodePass] = useState(true);

    const handleBusinessName = (e) => {
        var thenum = e.target.value.match(RegExp(verify.business_name, "i"), "");
        if (thenum !== null) {
            setBusinessName(thenum[0]);
            setBusinessNamePass(RegExp(validate.business_name, "i").test(thenum[0]));
        }
    };

    const handleBusinessEmail = (e) => {
        var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
        if (thenum !== null) {
            setBusinessEmail(thenum[0]);
            setBusinessEmailPass(RegExp(validate.email, "i").test(thenum[0]));
        }
    };

    const handleSupportEmail = (e) => {
        var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
        if (thenum !== null) {
            setSupportEmail(thenum[0]);
            setSupportEmailPass(RegExp(validate.email, "i").test(thenum[0]));
        }
    };

    const handleSupportPhone = (e) => {
        var thenum = e.target.value.match(RegExp(verify.phone_no, "i"), "");
        if (thenum !== null) {
            setSupportPhone(thenum[0]);
            setSupportPhonePass(RegExp(validate.phone_no, "i").test(thenum[0]));
        }
    };

    const initProcess =  (
        business_email,
        business_name,
        support_email,
        support_phone,
        countryCode,
        industryCode
    ) => {
        setProcessBusiness(true);
        if (!businessNamePass) {
            setBusinessNamePass(false);
            setProcessBusiness(false);
        } else if (!businessEmailPass) {
            setBusinessEmailPass(false);
            setProcessBusiness(false);
        } else if (!supportEmailPass) {
            setSupportEmailPass(false);
            setProcessBusiness(false);
        } else if (!supportPhonePass) {
            setSupportPhonePass(false);
            setProcessBusiness(false);
        } else if (countryCode.length < 2) {
            setCountryCodePass(false);
            setProcessBusiness(false);
        } else if (industryCode.length < 2) {
            setIndustryCodePass(false);
            setProcessBusiness(false);
        } else {
            setBusinessNamePass(true);
            setBusinessEmailPass(true);
            setSupportEmailPass(true);
            setSupportPhonePass(true);
            setCountryCodePass(true);
            setIndustryCodePass(true);
            const params = {
                data: {
                    business_email,
                    business_name,
                    support_email,
                    support_phone,
                    countryCode,
                    industryCode,
                },
                location: "new_business",
            };
            addBusiness(params);
        }
    };

    return (
        <AppModal
            title="Register a new business"
            description="Approval takes a few hours after review and confirmation of request."
            isOpen={show} close={() => close()}>

            <form
                className="w-100"
                onSubmit={(e) => {
                    e.preventDefault();
                    initProcess(
                        business_email,
                        business_name,
                        support_email,
                        support_phone,
                        countryCode,
                        industryCode
                    );
                }}
            >
                <div className="row">
                    <div className="form-group col-md-6 mh-40">
                        <label className="font-12">{t('Business Name')}</label>
                        <input
                            className="form-control mh-40 "
                            type="text"
                            name="business_name"
                            onChange={(e) => handleBusinessName(e)}
                            value={business_name}
                            required
                        />
                        {!businessNamePass && business_name && (
                            <Error>{t('Enter a valid business name')}</Error>
                        )}
                    </div>
                    <div className="ps-1 form-group mh-40 col-md-6">
                        <label className="font-12">{t('Business Email')}</label>
                        <input
                            className="form-control mh-40 "
                            type="text"
                            name="business_email"
                            onChange={(e) => handleBusinessEmail(e)}
                            value={business_email}
                            required
                        />
                        {!businessEmailPass && business_email && (
                            <Error>{t('Enter a valid email address')}</Error>
                        )}
                    </div>
                    <div className=" form-group mh-40 col-md-6">
                        <label className="font-12">{t('Support Email')}</label>
                        <input
                            className="form-control mh-40 "
                            type="text"
                            name="support_email"
                            onChange={(e) => handleSupportEmail(e)}
                            value={support_email}
                            required
                        />
                        {!supportEmailPass && support_email && (
                            <Error>{t('Enter a valid email address')} </Error>
                        )}
                    </div>
                    <div className="ps-1 form-group mh-40 col-md-6">
                        <label className="font-12">{t('Support Phone number')}</label>
                        <input
                            className="form-control mh-40 "
                            type="text"
                            name="account_number"
                            onChange={(e) => handleSupportPhone(e)}
                            value={support_phone}
                            required
                        />
                        {!supportPhonePass && support_phone && (
                            <Error>{t('Enter a valid phone number')}</Error>
                        )}
                    </div>

                    <div className="form-group mh-40 col-md-6">
                        <label className="font-12">{t('Country')}</label>
                        <select
                            className="form-control mh-40"
                            name="bank"
                            onChange={(e) => setCountryCode(e.target.value)}
                            value={countryCode}
                        >
                            <option selected disabled>{t('SELECT COUNTRY')}</option>
                            {countries &&
                            countries.map((list, key) => {
                                return (
                                    <option key={key} value={list.countryCode}>
                                        {list.name}
                                    </option>
                                );
                            })}
                        </select>
                        {!countryCodePass && (
                            <Error>{t('Select a valid country of your business')}</Error>
                        )}
                    </div>

                    <div className="ps-1 form-group mh-40 col-md-6">
                        <label className="font-12">{t('Business Industry')}</label>
                        <select
                            className="form-control mh-40"
                            name="bank"
                            onChange={(e) => setIndustryCode(e.target.value)}
                            value={industryCode}
                        >
                            <option selected disabled>{t('SELECT INDUSTRY')}</option>
                            {industry_list &&
                            industry_list.map((list, key) => {
                                return (
                                    <option key={key} value={list.industry_code}>
                                        {list.name}
                                    </option>
                                );
                            })}
                        </select>
                        {!industryCodePass && (
                            <Error>{t('Select the industry of your business')}</Error>
                        )}
                    </div>

                    <div className="form-group mh-40 col-12">
                        <Button
                            size="lg"
                            full
                            className="brand-btn"
                            buttonType="submit"
                            disabled={processBusiness}
                        >
                            {processBusiness && (
                                <Loader active inline='centered' />
                            )}
                            {!processBusiness && t(`Send request`)}
                        </Button>
                    </div>
                </div>
            </form>

        </AppModal>
    );
};

export default NewBusinessRequestModal;
