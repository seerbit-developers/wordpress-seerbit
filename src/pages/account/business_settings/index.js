/**
 * BusinessInformation
 *
 * @format
 */

import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    updateBusiness,
    getKYC,
    getIndustries,
    getCountries,
    getBusiness,
    setErrorLog,
} from "actions/postActions";
import { Can } from "modules/Can";
import { useForm, Controller } from "react-hook-form";
import { ProgressBar } from "react-bootstrap";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import cogoToast from "cogo-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import Button from "components/button";
import verify from "utils/strings/verify";
import validate from "utils/strings/validate";
import { KYCDocument, KYCText, KYCNotSet } from "modules/fileUpload";
import Upload from "assets/images/svg/upload.svg";
import styled from "styled-components";
import {updateBusinessSettings} from "../../../services/businessService";
import {alertError, alertExceptionError, alertSuccess} from "../../../modules/alert";
import {dispatchUpdateSingleBusiness} from "../../../actions/postActions";
import {useTranslation} from "react-i18next";

const Centered = styled.div`
  display: flex;
  justify-content: center;
`;

const Center = styled.div`
  text-align: center;
  margin: auto;
  justify-content: center;
  line-height: 1.2;
`;


const DataWrapper = styled.div`
  height: auto;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Wrap = styled.div`
  margin-bottom: 1.5em;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  color: #676767;
`;

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

export const BusinessSettings = (props) => {
    const [addressProcess, setAddressProcess] = useState(false);
    const [informationProcess, setInformationProcess] = useState(false);
    const [contactProcess, setContactProcess] = useState(false);
    const [kycProcess, setKycProcess] = useState(false);
    const [logoProcess, setLogoProcess] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (props.business_details && props.location === "business_information") {
            cogoToast.success("Update successful", { position: "top-right" });
            if (!props.progress) {
                props.getBusiness();
            }
            setAddressProcess(false);
            setInformationProcess(false);
            setContactProcess(false);
            setKycProcess(false);
            // if (history.goBack) history.goBack();
        }
    }, [props.business_details]);



    useEffect(() => {
        if (
            props.error_details &&
            props.error_details.error_source === "business_information"
        ) {
            cogoToast.error(props.error_details.message || "action not completed", {
                position: "top-right",
            });
            setAddressProcess(false);
            setInformationProcess(false);
            setContactProcess(false);
            setKycProcess(false);
            props.setErrorLog();
        }
    }, [props.error_details]);

    useEffect(() => {
        props.getIndustries();
        props.getKYC();
        // props.getCountries();
    }, []);

    return (
        <Template
            updateBusiness={props.updateBusiness}
            business_details={props.business_details}
            industry_list={props.industry_list && props.industry_list.payload}
            kyc={props.kyc && props.kyc.payload}
            countries={props.countries && props.countries.payload}
            addressProcess={addressProcess}
            setAddressProcess={setAddressProcess}
            contactProcess={contactProcess}
            setContactProcess={setContactProcess}
            kycProcess={kycProcess}
            setKycProcess={setKycProcess}
            informationProcess={informationProcess}
            setInformationProcess={setInformationProcess}
            progress={progress}
            setLogoProcess={setLogoProcess}
            logoProcess={logoProcess}
            setProgress={setProgress}
            props={props}
        />
    );
}

const Template = ({
    updateBusiness,
    business_details,
    industry_list,
    kyc,
    kycProcess,
    setKycProcess,
    setLogoProcess,
    logoProcess,
    progress,
    setProgress,
    props
}) => {

    const address = business_details ? business_details.address : "";
    const fix_data = {
        fieldName: "cac",
        identifier: "00000010",
        countryKycNumber: "000001",
        description: "CAC is Required",
        countryIdentifier: "000001",
        kycDocumentName: "CAC",
        documentType: "PDF",
        category: "LOW",
        status: business_details ? business_details.status : "",
    };

    const [business_name, setBusinessName] = useState(
        business_details ? business_details.business_name : ""
    );
    const { t } = useTranslation();

    const [businessDescription, setBusinessDescription] = useState(
        business_details ?
            business_details.otherInfo ?
                business_details.otherInfo.businessDescription : "" : ""
    );
    const [businessTradingName, setBusinessTradingName] = useState(
        business_details ?
            business_details.otherInfo ?
                business_details.otherInfo.tradingName : "" : ""
    );

    const [business_email, setBusinessEmail] = useState(
        business_details ? business_details.business_email : ""
    );
    const [support_email, setSupportEmail] = useState(
        business_details ? business_details.support_email : ""
    );
    const [chargeback_email, setChargebackEmail] = useState(
        business_details ? business_details.chargeback_email : ""
    );
    const [website_url, setWebsiteURL] = useState(business_details ? business_details.website_url : "");
    const [phone_number, setPhoneNumber] = useState(
        business_details ? business_details.phone_number : ""
    );
    const [business_industry, setBusinessIndustry] = useState(
        business_details ? business_details.business_industry : ""
    );
    const [street, setStreet] = useState(address && address.street);
    const [city, setCity] = useState(address && address.city);
    const [state, setState] = useState(address && address.state);
    const [selected, setSelected] = useState("Business Information")
    const [role, setRole] = useState(null);
    const [country, setCountry] = useState(address && address.country);
    const [editMode, setEitMode] = useState(false);

    const [logo, setLogo] = useState(business_details ? business_details.logo : "");
    const [upload_logo, setUploadLogo] = useState(null);
    const [kycDocuments, setKYCDocuments] = useState(
        business_details ? business_details.kycDocuments : []
    );
    const [kycUpdate, setKYCUpdate] = useState();
    const [business_certificate, setBusinessCertificate] = useState(
        business_details ? business_details.business_certificate : ""
    );
    const [rc_number, setRCNumber] = useState(business_details ? business_details.rc_number : "");

    const [businessNamePass, setBusinessNamePass] = useState(true);
    const [businessDescriptionPass, setBusinessDescriptionPass] = useState(true);
    const [businessEmailPass, setBusinessEmailPass] = useState(true);
    const [chargebackEmailPass, setChargebackEmailPass] = useState(true);
    const [supportEmailPass, setSupportEmailPass] = useState(true);
    const [websiteURLPass, setWebsiteURLPass] = useState(true);
    const [phoneNumberPass, setPhoneNumberPass] = useState(true);
    const [businessIndustryPass, setBusinessIndustryPass] = useState(true);
    const [streetPass, setStreetPass] = useState(true);
    const [cityPass, setCityPass] = useState(true);
    const [statePass, setStatePass] = useState(true);
    const [countryPass, setCountryPass] = useState(true);
    const [RCNumberPass, setRCNumberPass] = useState(true);
    const [items, setItems] = useState([]);
    const [values, setValues] = useState([]);
    const [industries, setIndusries] = useState([]);
    const [informationProcess, setInformationProcess] = useState(false);
    const [addressProcess, setAddressProcess] = useState(false);
    const [contactProcess, setContactProcess] = useState(false);

    let uplaodElement = null;
    var reader = new FileReader();
    const image = new Image();

    const handleBusinessDescription = (e) => {
        var thenum = e.target.value.match(RegExp(verify.business_name, "i"), "");
        if (thenum !== null) {
            setBusinessDescription(thenum[0]);
            setBusinessDescriptionPass(RegExp(validate.business_name, "i").test(thenum[0]));
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

    const handleChargebackEmail = (e) => {
        var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
        if (thenum !== null) {
            setChargebackEmail(thenum[0]);
            setChargebackEmailPass(RegExp(validate.email, "i").test(thenum[0]));
        }
    };

    const handlePhoneNumber = (e) => {
        var thenum = e.target.value.match(RegExp(verify.number), "");
        if (thenum !== null) {
            setPhoneNumber(thenum[0]);
            setPhoneNumberPass(RegExp(validate.number).test(thenum[0]));
        }
    };

    const handleWebsiteURL = (e) => {
        setWebsiteURL(e.target.value);
        setWebsiteURLPass(RegExp(validate.web_no_http, "i").test(e.target.value));
    };

    const handleRCNumber = (e) => {
        var thenum = e.target.value.match(RegExp(verify.rc_number), "");
        if (thenum !== null) {
            setRCNumber(thenum[0]);
            setRCNumberPass(RegExp(validate.rc_number).test(thenum[0]));
        }
    };

    const initContact = async (support_email, chargeback_email, phone_number) => {
        if (!supportEmailPass) {
            setSupportEmailPass(false);
            setContactProcess(false);
        } else if (!chargebackEmailPass) {
            setChargebackEmailPass(false);
            setContactProcess(false);
        } else if (!phoneNumberPass) {
            setPhoneNumberPass(false);
            setContactProcess(false);
        } else {
            setSupportEmailPass(true);
            setChargebackEmailPass(true);
            setPhoneNumberPass(true);

            updateBusinessSettings(
                {
                    support_email,
                    chargeback_email,
                    phone_number,
                }
            )
                .then((res) => {
                    setContactProcess(false);
                    if (res.responseCode === "00") {
                        alertSuccess("Success");
                        props.dispatchUpdateSingleBusiness(res.payload)
                    } else {
                        alertError(res.message
                            ? res.message
                            : "An Error Occurred sending the request. Kindly try again");
                    }
                })
                .catch((e) => {
                    setContactProcess(false);
                    alertExceptionError(e)
                });
        }
    };

    const initAddress = async (street, city, state, country) => {
        if (street !== null && street.length < 2) {
            setStreetPass(false);
            setAddressProcess(false);
        } else if (city !== null && city.length < 2) {
            setCityPass(false);
            setAddressProcess(false);
        } else if (state !== null && state.length < 2) {
            setStatePass(false);
            setAddressProcess(false);
        } else if (country !== null && country.length < 2) {
            setCountryPass(false);
            setAddressProcess(false);
        } else {
            setCountryPass(true);
            setStatePass(true);
            setCityPass(true);
            setStreetPass(true);

            updateBusinessSettings(
                {
                    address: {
                        street,
                        city,
                        state,
                        country,
                    }}
            )
                .then((res) => {
                    setAddressProcess(false);
                    if (res.responseCode === "00") {
                        alertSuccess("Success");
                        props.dispatchUpdateSingleBusiness(res.payload)
                    } else {
                        alertError(res.message
                            ? res.message
                            : "An Error Occurred sending the request. Kindly try again");
                    }
                })
                .catch((e) => {
                    setAddressProcess(false);
                    alertExceptionError(e)
                });
        }
    };

    const initProcess = async (
        business_name,
        business_email,
        phone_number,
        website_url,
        business_industry
    ) => {
        setInformationProcess(false);
        if (!businessNamePass) {
            setBusinessNamePass(false);
        } else if (!businessEmailPass) {
            setBusinessEmailPass(false);
        } else if (!websiteURLPass) {
            setWebsiteURLPass(false);
        } else if (!phoneNumberPass) {
            setPhoneNumberPass(false);
        } else if (!business_industry || business_industry.length < 5) {
            setBusinessIndustryPass(false);
        } else {
            setBusinessNamePass(true);
            setBusinessEmailPass(true);
            setWebsiteURLPass(true);
            setPhoneNumberPass(true);
            setBusinessIndustryPass(true);
            let otherInfo = null
            if (business_details.otherInfo)
            {
                otherInfo = JSON.parse(JSON.stringify(business_details.otherInfo));
                otherInfo.businessDescription = businessDescription
            }else{
                otherInfo = {businessDescription : businessDescription}
            }
            setInformationProcess(true);

            updateBusinessSettings(
                {
                    business_name,
                    business_email,
                    phone_number,
                    website_url,
                    business_industry,
                    otherInfo: otherInfo ? otherInfo : ''
                }
            )
                .then((res) => {
                    setInformationProcess(false);
                    if (res.responseCode === "00") {
                        alertSuccess("Success");
                        props.dispatchUpdateSingleBusiness(res.payload)
                    } else {
                        alertError(res.message
                            ? res.message
                            : "An Error Occurred sending the request. Kindly try again");
                    }
                })
                .catch((e) => {
                    setInformationProcess(false);
                        alertExceptionError(e)
                });
        }
    };

    const onUploadProgress = (progressEvent) => {
        let percentCompleted = 0;
        percentCompleted = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
    };

    const initUpload = (logo) => {
        if (!upload_logo || upload_logo === null) {
            cogoToast.error("Click logo box to upload new logo");
        } else {
            setLogoProcess(true);
            const params = {
                data: {
                    logo,
                },
                location: "business_information",
                onUploadProgress,
            };

            updateBusiness(params);
        }
    };

    const initKYCUpload = async (kycDocuments) => {
        setKycProcess(true);
        const params = {
            data: {
                kycDocuments,
            },
            location: "business_information",
            onUploadProgress,
        };
        updateBusiness(params);
    };

    const initDefaultKYC = async (rc_number, business_certificate) => {
        if (!RCNumberPass) {
            setRCNumberPass(false);
            setKycProcess(false);
            return;
        }
        const params = {
            data: {
                business_certificate,
                rc_number,
            },
            location: "business_information",
        };
        updateBusiness(params);
    };

    useEffect(() => {
        if (upload_logo) {
            if (upload_logo.size > 512 * 1024) {
                cogoToast.error("Maximum of 150 kilobyte is allow");
                return;
            }

            reader.readAsDataURL(upload_logo);

            reader.onload = () => {
                image.src = reader.result;
                image.onload = () => {
                    if ((image.width < 50) || (image.width > 100)) {
                        alertError("Please, upload a file with a width and a height not lesser than 50px and greater than 100px");
                        return;
                    }
                    if ((image.height < 50) || (image.height > 100)) {
                        alertError("Please, upload a file with a width and a height not lesser than 50px and greater than 100px");
                        return;
                    }
                    setLogo(reader.result);
                }
            }
        }
    }, [upload_logo])

    useEffect(() => {
        if (upload_logo) initUpload(logo);
    }, [logo]);

    useEffect(() => {
        const data = industry_list && industry_list.map(item => { return { label: item.name.replace(/_/, ' '), value: item.industry_code } });
        setIndusries(data)

    }, [industry_list]);

    const tabs = ["Business Information", "Business Support Emails", "Business Address", "Kyc"];
    const { register, handleSubmit, control, setError, trigger, formState: { errors } } = useForm();

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

                {selected !== "Kyc" && <div className="d-flex justify-content-end">
                    <Button text={editMode ? 'Done' : 'Edit'}
                        type={editMode ? 'white' : 'secondary'}
                        as="button" buttonType='button' onClick={() => setEitMode(!editMode)} size="sm"/>
                </div>}
                <div>
                    {selected === "Business Information" && <form
                        className="w-100"
                        onSubmit={(e) => {
                            e.preventDefault();
                            initProcess(
                                business_name,
                                business_email,
                                phone_number,
                                website_url,
                                business_industry
                            );
                        }}
                    >
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Business Name")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="business_name"
                                disabled
                                // onChange={(e) => handleBusinessName(e)}
                                placeholder={t("Enter a business name")}
                                value={business_name}
                            />
                            {!businessNamePass && businessNamePass && <Error>{t("Enter a valid business name")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Business Description")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="businessDescription"
                                onChange={(e) => handleBusinessDescription(e)}
                                value={businessDescription}
                            />
                            {!businessNamePass && businessNamePass && <Error>{t("Enter a valid business name")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Website Address")}</label>
                            <Error>
                                {website_url && website_url.length && !websiteURLPass ? t('Invalid Website URI') : ''}
                            </Error>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="website_address"
                                onChange={(e) => handleWebsiteURL(e)}
                                placeholder={t("Enter a valid website.")}
                                value={website_url}
                            />
                            {!websiteURLPass && websiteURLPass && <Error>{t("Enter a valid website")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Phone Number")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="tel"
                                name="phone_number"
                                onChange={(e) => handlePhoneNumber(e)}
                                value={phone_number}
                            />
                            {!phoneNumberPass && phoneNumberPass && <Error>{t("Enter a phone number")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Industry")}</label>
                            <Controller
                                name="role"
                                control={control}
                                {...register('role',{
                                    required: t('An Industry is required'),
                                })}
                                render={({ field }) =>
                                    <DropdownSelect containerClass={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                        {...field}
                                        name="Industry"
                                        data={industries}
                                        defaultValue={t("Select an industry")}
                                        id="industry"
                                        value={business_industry}
                                        as={'div'}
                                        onChange={({ value }) => {
                                            setBusinessIndustry(value);
                                            setBusinessIndustryPass(true);
                                        }}
                                    />
                                }
                            />
                            {!businessIndustryPass && businessIndustryPass && <Error>{t("Select a business industry")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Contact Email")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="email"
                                name="contact_email"
                                onChange={(e) => handleBusinessEmail(e)}
                                placeholder={t("Enter an email address")}
                                value={business_email}
                            />
                            {!businessEmailPass && businessEmailPass && <Error>{t("Enter a valid email address")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <Can access="MANAGE_MERCHANT_PROFILE">
                            <div className="float-right">
                                <Button text={informationProcess ?
                                    <Spinner animation="border" size="sm" variant="light" disabled={informationProcess} /> : t('Save')}
                                    as="button" buttonType='submit' />
                            </div>
                        </Can>
                    </form>}

                    {selected === "Business Support Emails" && (<form
                        className="w-100"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setContactProcess(true);
                            initContact(support_email, chargeback_email, phone_number);
                        }}
                    >
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Chargeback Email")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="chargeback_email"
                                onChange={(e) => handleChargebackEmail(e)}
                                placeholder={t("Enter an email address")}
                                value={chargeback_email}
                            />
                            {!chargebackEmailPass && chargeback_email !== undefined && <Error>{t("Enter a valid email address")}.</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Support Email")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="support_email"
                                placeholder={t("Enter an email address")}
                                onChange={(e) => handleSupportEmail(e)}
                                value={support_email}
                            />
                            {!supportEmailPass && support_email !== undefined && <Error>{t("Enter a valid email address")}.</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Phone Number")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="phone_number"
                                placeholder={t("enter a phone number")}
                                onChange={(e) => handlePhoneNumber(e)}
                                value={phone_number}
                            />
                            {!phoneNumberPass && phone_number !== undefined && <Error>{t("Enter a valid phone number")}.</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <Can access="MANAGE_MERCHANT_PROFILE">
                            <div className="float-right">
                                <Button text={contactProcess ?
                                    <Spinner animation="border" size="sm" variant="light" disabled={contactProcess} /> : t('Save')}
                                    as="button" buttonType='submit' />
                            </div>
                        </Can>
                    </form>)}

                    {selected === "Business Address" && (<form
                        className="w-100"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setAddressProcess(true);
                            initAddress(street, city, state, country);
                        }}
                    >
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Business Address")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="business_address"
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder={t("Enter your business address")}
                                value={street}
                            />
                            {!streetPass && street !== undefined && <Error>{t("Enter a valid business address")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Business City")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                placeholder={t("Enter your business city")}
                                name="business_city"
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                            />
                            {!cityPass && city !== undefined && <Error>{t("Enter a valid city address")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Business State")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="business_state"
                                placeholder={t("Enter your business state")}
                                onChange={(e) => setState(e.target.value)}
                                value={state}
                            />
                            {!cityPass && city !== undefined && <Error>{t("Enter a valid country state")}</Error>}
                            <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`} />
                        </div>
                        <div className={`col-md-12 configuration__item`}>
                            <label className="form__control--label--lg">{t("Business Country")}</label>
                            <input
                                className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                                type="text"
                                name="country"
                                value={
                                    business_details &&
                                    business_details.country &&
                                    business_details.country.name.charAt(0).toUpperCase() + business_details.country.name.slice(1).toLowerCase()
                                }
                                disabled
                            />
                        </div>
                        <Can access="MANAGE_MERCHANT_PROFILE">
                            <div className="float-right">
                                <Button text={addressProcess ?
                                    <Spinner animation="border" size="sm" variant="light" disabled={addressProcess} /> : t('Save')}
                                    as="button" buttonType='submit' />
                            </div>
                        </Can>
                    </form>)}

                    {selected === "Kyc" && (
                        <div className="mt-3">
                            <DataWrapper className="bg-white px-4 pt-4">
                                <Wrap>
                                    <div className="font-medium pb-2 text-black text-center">{t("Business Logo")}</div>
                                    <Centered>
                                        <img
                                            src={logo || Upload}
                                            onClick={(e) => uplaodElement.click()}
                                            height="100"
                                            width="100"
                                            title={t('click to update business logo')}
                                        />
                                    </Centered>
                                    <input
                                        style={{ display: "none" }}
                                        type="file"
                                        accept="image/png, image/jpeg, image/ico"
                                        placeholder={t("Image")}
                                        ref={(e) => (uplaodElement = e)}
                                        onChange={(e) => {
                                            setUploadLogo();
                                            setUploadLogo(e.target.files[0])

                                        }}
                                    />
                                    <Center className="py-3">
                                        <Tag>
                                            {t("Upload a logo with dimensions ranging from 50px to 100px")}
                                    </Tag>
                                    </Center>
                                    <Can access="MANAGE_MERCHANT_PROFILE">
                                        <Center>
                                            {logoProcess && progress > 0 && (
                                                <ProgressBar
                                                    animated
                                                    now={progress}
                                                    label={`${progress}%`}
                                                    className="mb-2"
                                                />
                                            )}
                                            <Button
                                                style={{
                                                    background: "transparent",
                                                    border: "1px solid #DFE0EB",
                                                    boxSizing: "border-box",
                                                    borderRadius: "5px",
                                                }}
                                                variant="xdh"
                                                block
                                                className="btn-outline font-14"
                                                onClick={() => {
                                                    uplaodElement.click();
                                                }}
                                                size="sm"
                                            >
                                                {logoProcess && (
                                                    <FontAwesomeIcon
                                                        icon={faSpinner}
                                                        spin
                                                        className="font-15"
                                                    />
                                                )}{" "}
                                                {logoProcess
                                                    ? t('Uploading')
                                                    : logo
                                                        ? t('Change Logo')
                                                        : t('Upload Logo"')}
                                            </Button>
                                        </Center>
                                    </Can>
                                </Wrap>
                            </DataWrapper>
                            <div className="mt-5">
                                {kyc &&
                                    kyc.length > 0 &&
                                    kyc.map((data, key) => {
                                        if (data.documentType === "TEXT") {
                                            return (
                                                <KYCText
                                                    data={data}
                                                    kycDocuments={kycDocuments}
                                                    setKYCDocuments={(kyc) => setKYCDocuments(kyc)}
                                                    setKYCUpdate={(update) => setKYCUpdate(update)}
                                                    setValues={(val) => setValues(val)}
                                                    values={values}
                                                />
                                            );
                                        } else if (["IMAGE", "PDF"].indexOf(data.documentType) > -1) {
                                            return (
                                                <KYCDocument
                                                    data={data}
                                                    key={key}
                                                    setItems={(item) => setItems(item)}
                                                    items={items}
                                                    kycDocuments={kycDocuments}
                                                    setKYCDocuments={(kyc) => setKYCDocuments(kyc)}
                                                    setKYCUpdate={() => setKYCUpdate(true)}
                                                />
                                            );
                                        }
                                    })}
                                {kyc && kyc.message === "KYC not listed under business!!" && (
                                    <KYCNotSet
                                        data={fix_data}
                                        handleRCNumber={(e) => handleRCNumber(e)}
                                        rc_number={rc_number}
                                        setBusinessCertificate={(data) => setBusinessCertificate(data)}
                                        business_certificate={business_certificate}
                                        setItems={(item) => setItems(item)}
                                        items={items}
                                        setKYCUpdate={() => setKYCUpdate(true)}
                                    />
                                )}
                                {kycUpdate && (
                                    <Can access="MANAGE_MERCHANT_PROFILE">
                                        <Button
                                            style={{
                                                background: "transparent",
                                                border: "1px solid #DFE0EB",
                                                boxSizing: "border-box",
                                                borderRadius: "5px",
                                            }}
                                            variant="xdh"
                                            block
                                            className="btn-outline font-14"
                                            onClick={() => {
                                                if (kyc && kyc.message === "KYC not listed under business!!")
                                                    initDefaultKYC(rc_number, business_certificate);
                                                else initKYCUpload(kycDocuments);
                                            }}
                                            disabled={kycProcess}
                                        >
                                            {kycProcess && (
                                                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                                            )}
                                            {!kycProcess && t('Submit Documents')}
                                        </Button>
                                    </Can>
                                )}
                            </div>
                        </div>
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
    getKYC,
    updateBusiness,
    getBusiness,
    getIndustries,
    getCountries,
    setErrorLog,
    dispatchUpdateSingleBusiness
})(BusinessSettings);

