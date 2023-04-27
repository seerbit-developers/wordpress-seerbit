/**
 * BusinessInformation
 *
 * @format
 */

import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    getProgressStatus,
    saveBusinessSettlements,
    saveBusinessDetails,
    saveBusinessSupport,
    getIndustries,
    getCountries,
    setErrorLog,
    nameInquiry,
    clearState
} from "actions/postActions";
import Select from 'react-select';
import { ProgressBar, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import KYCForms from "modules/kycForms";
import { isEmpty } from "lodash";
import "./css/quick-setup.scss";
import styled from "styled-components";
import Placeholder from "assets/images/svg/image-gallery.svg";
import Upload from "assets/images/svg/onboarding-upload.svg";
import { useHistory } from "react-router-dom"
import StagesTrack from "./components/StagesTrack";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import {
    hostChecker,
    hostName,
    StageOneComplete,
    StageOnePercent,
    StageThreeComplete,
    StageTwoComplete
} from "utils";
import {
    updateBusinessCertificate,
    updateBusinessDetails,
    updateBusinessSupportDetails,
    updateBusinessSettlementDetails
} from "services/businessService";
import {useTranslation} from "react-i18next";
import {AnimatePresence, motion} from "framer-motion";
import SectionDetails from "./components/sectionDetails";
import BanksJson from './banks.json';

const Card = styled.div`
  height: 100px;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #D8DBE6;
  box-sizing: border-box;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;



const Centered = styled.div`
  display: flex;
  justify-content: center;
`;


const DataWrapper = styled.div`
  height: 124px;
  width: 121px;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Bar = styled.div`
  position: relative;
  background: #cccccc7a;
  height: 30px;
  width: 17%;
  border-radius: 3px;
  margin: 0.3rem auto;
  border:  1px solid #EBEDFB;
`

const Fill = styled.div`
  background-color: ${(props) => `${props.color}`};
  width: 100%;
  border-radius: inherit;
  transition: height 0.2s ease-in;
  height: ${(props) => `${props.percentage}%`};
`


const customStyles = {
    control: (styles, { isDisabled }) => ({
        ...styles,
        backgroundColor: isDisabled ? '#e9ecef' : 'white',
        border: "1px solid #d0d6db",
        boxSizing: "border-box",
        borderRadius: 3,
        height: 53,
        cursor: isDisabled ? 'not-allowed' : 'default',
        color: isDisabled ? '#5e5e60' : 'black',
        ":hover": {
            border: "1px solid #389fee",
        },
        ":active": {
            border: "1px solid transparent",
        },
        ":focus": {
            border: "1px solid transparent",
        },
    }),
    valueContainer: styles => ({
        ...styles,
        marginTop: 13,
        outline: "unset",
        ":focus": {
            border: "1px solid red",
        },
    }),
}

const staffSize = [
    { id: 0, value: "50", label: "50+ People", name: "staffSize" },
    { id: 1, value: "100", label: "100+ People", name: "staffSize" },
    { id: 2, value: "200", label: "200+ People", name: "staffSize" },
]

const internationalTrans = [
    { id: 0, value: "Yes", label: "Yes", name: "acceptInternationalTrans" },
    { id: 1, value: "No", label: "No", name: "acceptInternationalTrans" },
]

let uploadElement = null;
var reader = new FileReader();
const image = new Image();
export function BusinessDetails(props) {
    const [value, setValue] = useState(null);
    const [industryData, setIndustryData] = useState([]);
    const [bankData, setBankData] = useState([]);
    const [logo, setLogo] = useState(props && props.business_details && props.business_details.logo);
    const [currentField, setCurrentField] = useState();
    const [loading, setLoading] = useState(false)
    const [upload_logo, setUploadLogo] = useState(null);
    const [verifying, setVerify] = useState(false);
    const [kycDocuments, setKYCDocuments] = useState();
    const [inquiryValue, setInquiry] = useState(null);
    // const [errors, setErrors] = useState(null);
    const { handleSubmit, control, setError,clearErrors,watch, formState: { errors } } = useForm();
    const [fields, setField] = useState(null)
    const [kycDocs, setKycDocs] = useState([])
    const [completedKyc, setCompletedKyc] = useState(false)
    const [annualTrans, setAnnualTrans] = useState([])
    const history = useHistory();
    const accountNumberRef = useRef();

    const [emptyUpload, setEmptyUpload] = useState(false);

    const {
        stageCompleted,
        setStageCompleted,
        setProgressShow,
        user_details,
        business_details,
        onboarding,
        name_inquiry,
        kyc,
        clearState,
        totalProgress,
        countries,
        progressStatus,
        refreshBusiness,
        businessFields,
        stageOnePercent,
        stageThreePercent,
        stageTwoPercent,
        bank_list
    } = props;

    const {
        business_name = undefined,
        default_currency,
        merchant_email,
    } = business_details;
    const { t } = useTranslation();
    const isNigeria =
        business_details &&
        business_details.country &&
        business_details.country.name.toUpperCase() === "NIGERIA";

    const totalField = kyc && kyc.payload && kyc.payload.length;
    const requiredField = kyc && kyc.payload && kyc.payload.filter(item=>item.approvalStatus !== "NOT_REQUIRED").filter(data => ["PROFILED"].indexOf(data.status) > -1);
    const approvedField = requiredField && requiredField.filter(data => ["APPROVED"].indexOf(data.status) > -1).length;
    const { payload = {} } = onboarding;

    useEffect(() => {
        if (kyc && business_details){
            const biz_country_code = business_details.country.countryCode
            //SET ANNUAL TRANSACTIONS
                const currencyCode = business_details.default_currency ? business_details.default_currency : 'NGN'
                setAnnualTrans(
                    [
                        { id: 0, value: `50,000 - 100,000`, label: `50,000${currencyCode} - 100,000${currencyCode}`, name: "annualTransaction" },
                        { id: 1, value: "10,0000 - 150,000", label: `100,000${currencyCode} - 150,000${currencyCode}`, name: "annualTransaction" },
                    ]
                )
            const country_kyc = countries.payload.find(item=>item.countryCode == biz_country_code).kycConfigs
                .filter(item=>item.status !== "NOT_REQUIRED")
                .filter(item=>item.status !== "INACTIVE")
            const kyc_filtered = business_details.kycDocuments.filter(biz_kyc=>{
                const f = country_kyc.find(item => item.name === biz_kyc.kycDocumentName)
                return f
            })
            setKycDocs(kyc_filtered)
            const totalPending = kyc_filtered ? kyc_filtered.filter(item=>item.status !== "SUBMITTED") : [];
            setCompletedKyc(totalPending.length === 0)
        }
    }, [countries, kyc, business_details])

    useEffect(() => {
        if (value){
            if (Array.isArray(value)){
                if(kycDocs.length === value.length){
                    setCompletedKyc(true)
                }
            }
        }
    }, [value])

    useEffect(() => {
        if (props.industry_list) createIndustryData(props.industry_list.payload);
        let data;
        if (isNigeria) {
            data = BanksJson && BanksJson.payload && BanksJson.payload.filter(bank => bank.code !== null)
            if (hostChecker() !== 'seerbit'){
                data = data.filter((item) => {
                    return item.bank_name.toLowerCase().indexOf(hostName().toLowerCase()) !== -1
                } )
            }
        } else {
            data = bank_list && bank_list.payload && bank_list.payload.filter(bank => bank.bank_code !== null)
        }
        if (data) createBankData(data);
    }, [props]);

    useEffect(() => {
        setLoading(false);
        setValue()
        setCurrentField();
        setStageCompleted(false)
    }, [progressStatus])

    const submitForm = (e) => {
        if (totalField && approvedField) {
            if (totalField === approvedField) {
                setProgressShow(false);
            }
        } else {
            // if (stageCompleted || progressStatus === 3) {
                const { id } = user_details;
                if (progressStatus === undefined || progressStatus === 0) {
                    setLoading(true)
                    const payload = { ...value, logo, progressStatus: StageOneComplete(value) ? 1 : 0 }
                    updateBusinessDetails(payload)
                        .then(res=>{
                            refreshBusiness();
                            setLoading(false)
                        })
                        .catch(e=>{
                            setLoading(false)
                            alertExceptionError(e)
                        })
                }
                if (progressStatus === 1) {
                    setLoading(true)
                    const payload =
                        {
                            support_email: value? value.support_email : '',
                            chargeback_email: value ? value.chargeback_email : '',
                            business_email: value ? value.business_email : '',
                            address: {
                                street: value ? value.business_address : '',
                                city: value ? value.business_city  : '',
                                state: value ? value.business_state : '',
                                country: business_details.countryCode
                            },
                            progressStatus: StageTwoComplete(value) ? 2 : 0
                }
                    updateBusinessSupportDetails(payload)
                        .then(res=>{
                            refreshBusiness();
                            setLoading(false)
                        })
                        .catch(e=>{
                            setLoading(false)
                            alertExceptionError(e)
                        })

                }
                if (progressStatus === 2) {
                    const selectedBank = bankData.find(data => data.bank_code === value.bank_code)
                    setLoading(true)
                    const payload =
                        {
                            payout: {
                                payout_account_number: value.account_number,
                                payout_account_name: value.account_name,
                                payout_bank_code: value.bank_code,
                                payout_bank_name: selectedBank.bank_name,
                                payout_bvn_number: value.bvn_number || "",
                                currency: default_currency
                            },
                            otherSettlementDetails: [],
                            progressStatus: StageThreeComplete(value, isNigeria) ? 3 : 2,
                        }
                    updateBusinessSettlementDetails(payload)
                        .then(res=>{
                            refreshBusiness();
                            setLoading(false)
                        })
                        .catch(e=>{
                            setLoading(false)
                            alertExceptionError(e)
                        })
                }
                if (progressStatus === 3) {
                    setLoading(true)
                    const pending = kycDocs.filter(item=> item.status !== "SUBMITTED");
                    let lastDoc = false
                    if (pending.length === value.length){
                        if(pending[0].fieldName === value[0].fieldName){
                            lastDoc = true
                        }
                    }
                    if(fields === null) {
                        setLoading(false);
                        alertError('Kindly upload all required legal documents');
                        setEmptyUpload(true);
                        return;
                    }
                    updateBusinessCertificate(
                        {
                            kycDocuments: value,
                            progressStatus: lastDoc ? 4 : 3,
                            userId: id
                        }
                    ).then(res=>{
                        refreshBusiness(lastDoc);
                        setLoading(false);
                        !lastDoc && alertSuccess('Document saved  💪')
                    })
                        .catch(e=>{
                            setLoading(false)
                            alertExceptionError(e)
                        })

                }
            // } else {
            //     setStageCompleted(true)
            // }
        }
    };

    useEffect(() => {
        if (inquiryValue &&
            inquiryValue.account_number &&
            !inquiryValue.bank_code
        ){
            setError("bank_name", {
                type: "manual",
                message: "Please select a bank",
            });
            return
        } else if (inquiryValue &&
            !inquiryValue.account_number &&
            !value.account_number &&
            inquiryValue.bank_code
        ){
            setError("account_number", {
                type: "manual",
                message: "Bank Account Number is required",
            });
            accountNumberRef.current.focus()
            return
        }else if (inquiryValue &&
            inquiryValue.account_number < 6 &&
            inquiryValue.bank_code
            && isNigeria
        ){
            setError("account_number", {
                type: "manual",
                message: "Bank Account Number is incomplete",
            });
            return
        }
        if (inquiryValue &&
            inquiryValue.account_number &&
            inquiryValue.bank_code &&
            inquiryValue.account_number.length > 9
        ) {
            const { account_number, bank_code } = inquiryValue
            setValue({ ...value, account_name: "" });
            setVerify(true);
            clearErrors(['account_number', 'bank_name'])
            props.nameInquiry({
                data: { bankCode: bank_code, isCgBankCode: true, account: account_number },
                location: "name_inquiry",
            });
        }
    }, [inquiryValue]);

    useEffect(() => {
        if (!isEmpty(name_inquiry)) {
            const { code, cutomername } = name_inquiry;
            if (code === "00") {
                setValue({ ...value, account_name: cutomername });
                setVerify(false);
            }
        }
        clearState({ name: "name_inquiry", value: null });
    }, [name_inquiry]);

    const createIndustryData = (data) => {
        if (!isEmpty(data)) {
            let categorizedData = [];
            categorizedData = data.map((list, id) => {
                return {
                    ...list,
                    id,
                    name: "business_industry",
                    value: list.industry_code,
                    label: list.name.charAt(0).toUpperCase() + list.name.slice(1).toLowerCase()
                };
            });
            setIndustryData(categorizedData);
        }
    };

    const createBankData = (data) => {
        if (!isEmpty(data)) {
            let categorizedData = [];
            categorizedData = data.map((list, id) => {
                return {
                    ...list,
                    id,
                    name: "bank_code",
                    value: list.bank_code,
                    label: list.bank_name
                };
            });
            setBankData(categorizedData);
        }
    };


    useEffect(() => {
        props.clearState({ name: "error_details", value: null });
        if (
            props.error_details &&
            props.error_details.error_source === "name_inquiry"
        ) {
            setVerify(false);
            setLoading(false);
            // alertError(props.error_details.message);
            setError("account_number", {
                type: "manual",
                message: props.error_details.message,
            });
            props.clearState({ name: "error_details", value: null });
        }

    }, [props.error_details]);

    const handleValue = (e) => {
        if (e.target.name !== "account_number") {
            setCurrentField([e.target.name])
            setValue({ ...value, [e.target.name]: e.target.value });
        } else {
            if (isNigeria) setInquiry({ ...inquiryValue, [e.target.name]: e.target.value });
            setCurrentField([e.target.name])
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }

    const handleSelected = (selected) => {
        if (selected.value === "Yes") {
            setCurrentField([selected.name])
            setValue({ ...value, [selected.name]: true });
        } else if (selected.value === "No") {
            setCurrentField([selected.name])
            setValue({ ...value, [selected.name]: false });
        } else if (selected.name === "bank_code") {
            if (isNigeria) setInquiry({ ...inquiryValue, [selected.name]: selected.value });
            setCurrentField([selected.name])
            setValue({ ...value, [selected.name]: selected.value });
        } else {
            setCurrentField([selected.name])
            setValue({ ...value, [selected.name]: selected.value });
        }
    }

    useEffect(() => {
        if (upload_logo) {
            if (upload_logo.size > 512 * 1024) {
                alertError("Maximum of 150 kilobyte is allow");
                return;
            }

            reader.readAsDataURL(upload_logo);

            reader.onload = () => {
                image.src = reader.result;
                image.onload = () => {
                    if ((image.width < 50) || (image.width > 1000)) {
                        alertError("Please, upload a file with a width and a height not lesser than 50 and greater than 100");
                        return;
                    }
                    if ((image.height < 50) || (image.height > 1000)) {
                        alertError("Please, upload a file with a width and a height not lesser than 50 and greater than 100");
                        return;
                    }
                    setLogo(reader.result);
                }
            }
        }
    }, [upload_logo]);

    const onFormError = (e)=>{
    }

    useEffect( ()=>{
        if(businessFields && value){
                setValue({ ...value, ...businessFields });
            }else{
                setValue({ ...businessFields });
            }
    }, [businessFields,progressStatus])

    return (
        <div className="onboarding__container">
            <SectionDetails
                progressStatus={progressStatus}
                setProgressShow={setProgressShow}
            />
                <div className="col-12">
                    <div className="row">
                        <StagesTrack
                                     totalProgress={totalProgress}
                                     completedKyc={completedKyc}
                                     stageOnePercent={stageOnePercent}
                                     stageThreePercent={stageThreePercent}
                                     stageTwoPercent={stageTwoPercent}
                        />
                        <form
                            className="col-10"
                            onSubmit={handleSubmit(submitForm, onFormError)}
                        >
                            {(!progressStatus || progressStatus === 0) && value && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x:-10 }}
                                    >
                                <div>
                                    <input autoComplete="on" style={{ display: 'none' }}
                                        id="fake-hidden-input-to-stop-google-address-lookup" />
                                    <div className="col-12 p-0 m-0">
                                        <div className="row">
                                            <div className="col-9">
                                                <div className="form-outline mb-3">
                                                    <input
                                                        name="business_name"
                                                        type="text"
                                                        autoComplete="off"
                                                        className={value && value.business_name || business_name ? `form-control has-business` : `form-control seerbit-business`}
                                                        onChange={(e) => handleValue(e)}
                                                        value={value ? value.business_name : business_name}
                                                        required
                                                        disabled={stageCompleted}
                                                    />
                                                    <label className="form-label">{t('Business Name')}</label>
                                                </div>
                                                <div className="form-outline mb-3">
                                                    <input
                                                        name="tradingName"
                                                        type="text"
                                                        autoComplete="off"
                                                        className={value && value.tradingName ? `form-control has-trading` : `form-control seerbit-trading`}
                                                        onChange={(e) => handleValue(e)}
                                                        value={value ? value.tradingName : ''}
                                                        required
                                                        disabled={stageCompleted}
                                                    />
                                                    <label className="form-label">{t('Trading Name')}</label>
                                                </div>
                                            </div>
                                            <div className="col-3 p-0 m-0">
                                                {!logo && <DataWrapper className="bg-white px-4 pt-4 business_logo_placeholder">
                                                    <Centered>
                                                        <img
                                                            src={Placeholder}
                                                            onClick={(e) => uploadElement.click()}
                                                            width="70"
                                                            title={t('Click to update business logo')}
                                                            className="img-thumbnail bg-transparent border-0 cursor-pointer"
                                                        />
                                                    </Centered>
                                                    <input
                                                        style={{ display: "none" }}
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/ico"
                                                        placeholder="image"
                                                        ref={(e) => (uploadElement = e)}
                                                        onChange={(e) => {
                                                            setUploadLogo();
                                                            setUploadLogo(e.target.files[0])

                                                        }}
                                                    />
                                                </DataWrapper>}
                                                {logo && <DataWrapper className="bg-white">
                                                    <Centered>
                                                        <div className="vertical-center">
                                                            <img
                                                                src={logo || Upload}
                                                                onClick={(e) => uploadElement.click()}
                                                                height="100"
                                                                width="100"
                                                                title="Click to update a business logo"
                                                                className='cursor-pointer'
                                                            />
                                                        </div>
                                                    </Centered>
                                                    <input
                                                        style={{ display: "none" }}
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/ico"
                                                        placeholder="image"
                                                        ref={(e) => (uploadElement = e)}
                                                        onChange={(e) => {
                                                            setUploadLogo();
                                                            setUploadLogo(e.target.files[0])

                                                        }}
                                                    />
                                                </DataWrapper>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="website_url"
                                            type="text"
                                            autoComplete="off"
                                            className={value && value.website_url ? `form-control has-website` : `form-control seerbit-website`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.website_url : ''}
                                            disabled={stageCompleted}
                                            required={hostChecker() === 'uba'}

                                        />
                                        <label className="form-label">{t('Website')}
                                            {
                                                hostChecker() !== 'uba' && <span className="text-muted font-10">{"(Optional)"}</span>
                                            }
                                        </label>
                                    </div>
                                        <div className="form-onboarding-outline mb-3">
                                            <Controller
                                                name="business_industry"
                                                defaultValue={value.business_industry}
                                                className="basic-single"
                                                render={({ field }) => {
                                                    return (
                                                        <Select
                                                            options={industryData}
                                                            styles={customStyles}
                                                            onChange={e => {
                                                                field.onChange(e.value);
                                                                handleSelected(e)
                                                            }}
                                                            isSearchable={true}
                                                            value={industryData.find(c => c.value === field.value)}
                                                            isLoading={!isEmpty(industryData) ? false : true}
                                                            isDisabled={stageCompleted}
                                                        />
                                                    )
                                                }}
                                                control={control}
                                                rules={{ required: true }}
                                            />
                                            {errors && errors.business_industry && errors.business_industry.type === "required" && (
                                                <span className="text-danger font-12">{"Business Category is required"}</span>
                                            )}
                                            <label className="form-label-onboarding">{t('Business Category')}</label>
                                        </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="businessDescription"
                                            type="text"
                                            autoComplete="off"
                                            className={value && value.businessDescription ? `form-control has-description` : `form-control seerbit-description`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.businessDescription : ''}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Business Description')}</label>
                                    </div>
                                    <div className="form-onboarding-outline mb-3">
                                        <Controller
                                            name="staffSize"
                                            defaultValue={value.staffSize || ""}
                                            className="basic-single"
                                            render={({ field }) => (
                                                <Select
                                                    options={staffSize}
                                                    styles={customStyles}
                                                    value={staffSize.find(c => c.value === field.value)}
                                                    onChange={e => {
                                                        handleSelected(e)
                                                        field.onChange(e.value);
                                                    }}
                                                    isSearchable={false}
                                                    isLoading={!isEmpty(staffSize) ? false : true}
                                                    isDisabled={stageCompleted}
                                                />
                                            )}
                                            control={control}
                                            rules={{ required: true }}
                                        />
                                        {errors && errors.staffSize && errors.staffSize.type === "required" && (
                                            <span className="text-danger font-12">{t("Staff size is required")}</span>
                                        )}
                                        <label className="form-label-onboarding">{t('Staff Size')}</label>
                                    </div>
                                    <div className="form-onboarding-outline mb-3">
                                        <Controller
                                            name="annualTransaction"
                                            defaultValue={value.annualTransaction || ""}
                                            className="basic-single"
                                            render={({ field }) => (
                                                <Select
                                                    options={annualTrans}
                                                    styles={customStyles}
                                                    value={annualTrans.find(c => c.value === field.value)}
                                                    onChange={e => {
                                                        handleSelected(e)
                                                        field.onChange(e.value);
                                                    }}
                                                    isSearchable={false}
                                                    isLoading={!isEmpty(annualTrans) ? false : true}
                                                    isDisabled={stageCompleted}
                                                />
                                            )}
                                            control={control}
                                            rules={{ required: true }}
                                        />
                                        {errors && errors.annualTransaction && errors.annualTransaction.type === "required" && (
                                            <span className="text-danger font-12">{t("Annual Transaction Value is required")}</span>
                                        )}
                                        <label className="form-label-onboarding">{t('Annual Transaction Value Estimation')}</label>
                                    </div>
                                        <div className="form-onboarding-outline mb-3">
                                            <Controller
                                                name="acceptInternationalTrans"
                                                defaultValue={value.acceptInternationalTrans ? 'Yes' : 'No'}
                                                className="basic-single"
                                                render={({field}) => {
                                                    return (
                                                        <Select
                                                            options={internationalTrans}
                                                            styles={customStyles}
                                                            value={internationalTrans.find(c => c.value === field.value)}
                                                            onChange={e => {
                                                                handleSelected(e)
                                                                field.onChange(e.value);
                                                            }}
                                                            isSearchable={false}
                                                            isLoading={!isEmpty(internationalTrans) ? false : true}
                                                            isDisabled={stageCompleted}
                                                        />
                                                    )
                                                }}
                                                control={control}
                                                rules={{required: true}}
                                            />
                                            {errors && errors.acceptInternationalTrans && errors.acceptInternationalTrans.type === "required" && (
                                                <span
                                                    className="text-danger font-12">{t("International Transaction Value is required")}</span>
                                            )}
                                            <label
                                                className="form-label-onboarding">{t('Will you be accepting international transaction?')}</label>
                                        </div>
                                    <div className="d-flex justify-content-between my-4">
                                        <div>{stageCompleted && <div onClick={() => {
                                            setStageCompleted(false);
                                        }} className="font-15 cursor-pointer mt-2 text-dark">Edit</div>}</div>
                                        {
                                            totalProgress === 100 ?
                                                <Button
                                                    block
                                                    type={'button'}
                                                    className="brand-btn h-50px w-200px"
                                                    onClick={() => history.push('account/business_details')}
                                                >
                                                    <span> {t('Go to settings')}</span>
                                                </Button>
                                                :
                                                <Button
                                                    block
                                                    type="submit"
                                                    className="brand-btn h-50px w-200px"
                                                    disabled={loading}
                                                >
                                                    <span>{loading ? <Spinner animation="border" variant="light"
                                                                              size/> : t("Save & Continue")} </span>
                                                </Button>
                                        }
                                    </div>
                                </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                            {progressStatus === 1 && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x:-10 }}
                                    >
                                    <input autoComplete="on" style={{ display: 'none' }}
                                        id="fake-hidden-input-to-stop-google-address-lookup" />
                                    <div className="form-outline mb-3">
                                        <input
                                            name="business_email"
                                            type="email"
                                            autoComplete="off"
                                            className={value && value.business_email ? `form-control has-business-email` : `form-control seerbit-business-email`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.business_email : ''}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Business Email')}</label>
                                        <div className="p-0 m-0" onClick={() => setValue({ ...value, business_email: merchant_email })}>
                                            <span className="seerbit-color font-12 cursor-pointer">{t("use registered email")}</span>
                                        </div>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="support_email"
                                            type="email"
                                            autoComplete="off"
                                            className={value && value.support_email ? `form-control has-support` : `form-control seerbit-support`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.support_email : props.business_details.support_email}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Support Email')}</label>
                                        <div className="p-0 m-0" onClick={() => setValue({ ...value, support_email: merchant_email })}>
                                            <span className="seerbit-color font-12 cursor-pointer">{t("use registered email")}</span>
                                        </div>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="chargeback_email"
                                            type="email"
                                            autoComplete="off"
                                            className={value && value.chargeback_email ? `form-control has-chargeback` : `form-control seerbit-chargeback`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.chargeback_email : ''}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Chargeback Email')}</label>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="business_state"
                                            type="text"
                                            autoComplete="off"
                                            className={value && value.business_state ? `form-control has-state` : `form-control seerbit-state`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.business_state : ''}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Business State')}</label>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="business_city"
                                            type="text"
                                            autoComplete="off"
                                            className={value && value.business_city  ? `form-control has-city` : `form-control seerbit-city`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.business_city : ''}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Business City')}</label>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="business_address"
                                            type="text"
                                            autoComplete="off"
                                            className={value && value.business_address ? `form-control has-address` : `form-control seerbit-address`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.business_address : ''}
                                            disabled={stageCompleted}
                                            required
                                        />
                                        <label className="form-label">{t('Business Address')}</label>
                                    </div>
                                    <div className="d-flex justify-content-between my-4">
                                        <div>{stageCompleted && <div onClick={() => {
                                            setStageCompleted(false);
                                        }} className="font-15 cursor-pointer mt-2 text-dark">{t('Edit')}</div>}</div>
                                        {
                                            totalProgress === 100 ?
                                                <Button
                                                    block
                                                    type={'button'}
                                                    className="brand-btn h-50px w-200px"
                                                    onClick={() => history.push('account/business_details')}
                                                >
                                                    <span> {t('Go to settings')}</span>
                                                </Button>
                                                :
                                                <Button
                                                    block
                                                    type="submit"
                                                    className="brand-btn h-50px w-200px"
                                                    disabled={loading}
                                                >
                                            <span>{loading ? <Spinner animation="border" variant="light" size/> :
                                                t("Save & Continue")} </span>
                                                </Button>
                                        }
                                    </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                            {(progressStatus == 2 && value) && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x:-10 }}
                                    >
                                    <input autoComplete="on" style={{ display: 'none' }}
                                        id="fake-hidden-input-to-stop-google-address-lookup" />
                                    <div className="form-onboarding-outline mb-3">
                                        <Controller
                                            name="bank_name"
                                            defaultValue={value.bank_code}
                                            className="basic-single"
                                            render={({ field }) => (
                                                <Select
                                                    options={bankData}
                                                    styles={customStyles}
                                                    value={bankData.find(c => c.value === field.value)}
                                                    onChange={e => {
                                                        handleSelected(e)
                                                        field.onChange(e.value)
                                                    }}
                                                    isSearchable={true}
                                                    isLoading={!isEmpty(bankData) ? false : true}
                                                    isDisabled={stageCompleted || verifying || loading}
                                                />
                                            )}
                                            control={control}
                                            rules={{ required: true }}
                                        />
                                        {errors && errors.bank_name && errors.bank_name.type === "required" && (
                                            <span className="text-danger font-12">{t('A settlement bank is required')}</span>
                                        )}
                                        {errors && errors.bank_name && errors.bank_name.type === "manual" && (
                                            <span className="text-danger font-12">{t(errors.bank_name.message)}</span>
                                        )}
                                        <label className="form-label-onboarding">{t('Bank')}</label>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="account_number"
                                            placeholder='...'
                                            type="number"
                                            autoComplete="off"
                                            className={value && value.account_number ? `form-control has-account` : `form-control seerbit-account`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.account_number : ''}
                                            disabled={stageCompleted || verifying || loading}
                                            required
                                            ref={accountNumberRef}
                                        />
                                        {errors && errors.account_number && errors.account_number.type === "manual" && (
                                        <span className="text-danger font-12">{t(errors.account_number.message)}</span>
                                    )}
                                        <label className="form-label">{t('Business Account Number')}</label>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            name="account_name"
                                            type="text"
                                            autoComplete="off"
                                            className={value && value.account_name ? `form-control has-account-name` : `form-control seerbit-account-name`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.account_name : ''}
                                            disabled={ isNigeria || verifying }
                                            required
                                            placeholder={verifying ? t('Verifying...') : ''}
                                        />
                                        <label className="form-label">{t('Account Name')}</label>
                                    </div>
                                    {isNigeria && <div className="form-outline mb-3">
                                        <input
                                            name="bvn_number"
                                            type="number"
                                            min={11}
                                            autoComplete="off"
                                            className={value && value.bvn_number ? `form-control has-bvn` : `form-control seerbit-bvn`}
                                            onChange={(e) => handleValue(e)}
                                            value={value ? value.bvn_number : ''}
                                            required
                                            disabled={loading || stageCompleted || verifying}
                                        />
                                        <label className="form-label">{t('BVN')}</label>
                                    </div>}
                                    <div className="d-flex justify-content-between my-4">
                                        <div>{stageCompleted && <div onClick={() => {
                                            setStageCompleted(false);
                                        }} className="font-15 cursor-pointer mt-2 text-dark">{t('Edit')}</div>}</div>
                                        {
                                            totalProgress === 100 ?
                                                <Button
                                                    block
                                                    type={'button'}
                                                    className="brand-btn h-50px w-200px"
                                                    onClick={() => history.push('account/business_details')}
                                                >
                                                    <span> {t('Go to settings')}</span>
                                                </Button>
                                                :
                                                <Button
                                                    block
                                                    type="submit"
                                                    className="brand-btn h-50px w-200px"
                                                    disabled={loading || verifying}
                                                >
                                                    <span>{loading ? <Spinner animation="border" variant="light"
                                                                              size/> : t("Save & Continue")} </span>
                                                </Button>
                                        }
                                    </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                            {progressStatus === 3 && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x:-10 }}
                                    >
                                    <input autoComplete="on" style={{ display: 'none' }}
                                        id="fake-hidden-input-to-stop-google-address-lookup" />
                                    {kyc && kyc.message === "KYC not listed under business!!" && (
                                        <div className="form-outline mb-3">
                                            <input
                                                name="rc_number"
                                                type="text"
                                                autoComplete="off"
                                                className={value && value.rc_number || payload.rc_number ? `form-control has-rc` : `form-control seerbit-rc`}
                                                onChange={(e) => {
                                                    if (value && value.kycDocuments) {
                                                        const { kycDocuments } = value;
                                                        setValue({
                                                            kycDocuments: [
                                                                ...kycDocuments, {
                                                                    fieldName: "rc_number",
                                                                    documentType: "TEXT",
                                                                    kycRecordUpdate: e.target.value
                                                                }]
                                                        });
                                                    } else {
                                                        setValue({
                                                            kycDocuments: [{
                                                                fieldName: "rc_number",
                                                                documentType: "TEXT",
                                                                kycRecordUpdate: e.target.value
                                                            }]
                                                        });
                                                    }
                                                }}
                                                value={value ? value.rc_number : payload.rc_number}
                                                disabled={stageCompleted}
                                                required
                                            />
                                            <label className="form-label">{t('RC Number')}</label>
                                        </div>
                                    )}
                                    <div>
                                        {kyc && kyc.message !== "KYC not listed under business!!" && (
                                            kycDocs && kycDocs.map((data, key) => (
                                                <KYCForms
                                                    fields={fields}
                                                    setField={setField}
                                                    data={data}
                                                    key={key}
                                                    value={value}
                                                    handleValue={handleValue}
                                                    setValue={setValue}
                                                    kycDocuments={kycDocuments}
                                                    setKYCDocuments={setKYCDocuments}

                                                    // emptyUpload={emptyUpload}
                                                    // setEmptyUpload={setEmptyUpload}
                                                />
                                            )))}
                                    </div>
                                    <div className="d-flex justify-content-end my-4">
                                        {
                                            totalProgress  === 100 ?
                                                <Button
                                                    block
                                                    type={'button'}
                                                    className="brand-btn h-50px w-200px"
                                                    onClick={()=> history.push('account/business_details')}
                                                >
                                            <span> {t('Go to settings')}</span>
                                                </Button>
                                                :
                                                <Button
                                                    block
                                                    type={ "submit"}
                                                    className="brand-btn h-50px w-200px"
                                                    disabled={loading}
                                                >
                                            <span>{
                                                    loading ? <Spinner animation="border" variant="light" size />
                                                    // : emptyUpload ? t("Upload documents to continue")
                                                    :  t('Complete Setup')
                                            } </span>
                                                </Button>

                                        }

                                    </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                            <Card className="mt-5 px-4">
                                <div className="pb-1">
                                    <span className="font-12 text-dark">{t('Progressing')} {completedKyc ? 100 : totalProgress}%</span>
                                </div>
                                <div>
                                    <ProgressBar variant="success" now={completedKyc ? 100 : totalProgress} style={{ height: "5px" }} />
                                </div>
                                {/* <div className="text-center py-2 font-12">
                                    {currentField && currentField[0].replace("_", " ")}
                                </div> */}
                            </Card>
                        </form>
                    </div>
                </div>
        </div>
    );
};


BusinessDetails.propTypes = {
    getKYC: PropTypes.func.isRequired,
    getIndustries: PropTypes.func.isRequired,
    getCountries: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    industry_list: state.data.industry_list,
    bank_list: state.data.bank_list,
    error_details: state.data.error_details,
    location: state.data.location,
    countries: state.data.countries,
    save_business_details: state.data.save_business_details,
    save_business_support: state.data.save_business_support,
    name_inquiry: state.data.name_inquiry,
    save_business_settlement: state.data.save_business_settlement,
    save_business_kyc: state.data.save_business_kyc
});

export default connect(mapStateToProps, {
    getProgressStatus,
    saveBusinessDetails,
    saveBusinessSupport,
    saveBusinessSettlements,
    getIndustries,
    getCountries,
    nameInquiry,
    setErrorLog,
    clearState
})(BusinessDetails);
