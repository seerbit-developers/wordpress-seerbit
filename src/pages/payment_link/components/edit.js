/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    getAllowedCurrencies,
    clearState,
    getPaymentLinks,
    validateCustomUrl,
} from "actions/postActions";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "primereact/calendar";
import validate from "utils/strings/validate";
import AppModal from "components/app-modal";
import moment from "moment";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import {updatePaymentLink} from "services/paymentLinkService";
import {useTranslation} from "react-i18next";

function EditPaymentLink(props) {
    const {
        validateCustomUrl,
        validatecustomurl,
        currencies,
        getAllowedCurrencies,
        update_payment_link,
        business_details,
        create_payment_link,
        location,
        clearState,
        isEdit,
        selectedData,
        isOpen,
        close,
        reload
    } = props;
    const {t} = useTranslation();
    const [newPaymentLink, setPaymentLink] = useState({});
    const [showMobileNumber, setShowMobileNumber] = useState(isEdit ? selectedData.requiredFields.mobileNumber : false);
    const [active, setActive] = useState(isEdit ? selectedData.status === "ACTIVE" ? true : false : true);
    const [type, setType] = useState(isEdit ? selectedData.oneTime : true);
    const [paymentFrequency, setFrequency] = useState(isEdit ? selectedData.paymentFrequency : "ONE_TIME");
    const [showAmount, setShowAmount] = useState(isEdit ? selectedData.requiredFields.amount : false);
    const [showDate, setShowDate] = useState(isEdit ? selectedData.linkExpirable : false);
    const [showAdditionalFields, setShowField] = useState(false);
    const [additionalFields, setAdditionalField] = useState([]);
    const [newField, setNewField] = useState("")
    const [processing, setProcessing] = useState(false);
    const [time, setTime] = useState(1000);
    const [validating, setValidate] = useState(false);
    const [date, setDate] = useState()
    const { setting } = business_details;
    const { mode } = setting;
    const formRef = React.useRef();
    useEffect(() => {
        getAllowedCurrencies();
        setValidate(false)
    }, [validatecustomurl])

    useEffect(() => {
        if (newPaymentLink && newPaymentLink.customizationName) {
            setValidate(true)
            setTime(1000);
            const timer = setTimeout(() => validateCustomUrl({ data: newPaymentLink.customizationName }), time);
            return () => clearTimeout(timer);
        }
    }, [newPaymentLink]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPaymentLink && newPaymentLink.customizationName) {
            if (validatecustomurl && validatecustomurl.payload) {
                alertError("The provided custom url is not available");
                return
            }
        }
        setProcessing(true);

            const payload = {
                ...newPaymentLink,
                amount: !newPaymentLink.amount ? selectedData.amount ? selectedData.amount : undefined : newPaymentLink.amount,
                currency: !newPaymentLink.currency ? selectedData.currency ? selectedData.currency : undefined : newPaymentLink.currency,
                paymentLinkName: !newPaymentLink.paymentLinkName ? selectedData.paymentLinkName : newPaymentLink.paymentLinkName,
                description: !newPaymentLink.description ? selectedData.description ? selectedData.description : undefined : newPaymentLink.description,
                redirectUrl: !newPaymentLink.redirectUrl ? selectedData.redirectUrl ? selectedData.redirectUrl : undefined : newPaymentLink.redirectUrl,
                successMessage: !newPaymentLink.successMessage ? selectedData.successMessage ? selectedData.successMessage : undefined : newPaymentLink.successMessage,
                vendorId: !newPaymentLink.vendorId ? selectedData.vendorId ? selectedData.vendorId : undefined : newPaymentLink.vendorId,
                customizationName: !newPaymentLink.customizationName ? selectedData.customizationName ? selectedData.customizationName : undefined : newPaymentLink.customizationName,
                paymentLinkReference: selectedData.paymentLinkReference,
                paymentLinkId: selectedData.paymentLinkId,
                linkExpirable: showDate,
                expiryDuration: !newPaymentLink.expiryDuration ? selectedData.expiryDuration ? selectedData.expiryDuration : 0 : newPaymentLink.expiryDuration,
                customTime: !newPaymentLink.customTime ? selectedData.customTime ? selectedData.customTime : "" : newPaymentLink.customTime,
                additionalData: additionalDataString(),
                environment: mode,
                status: active ? "ACTIVE" : "INACTIVE",
                oneTime: type,
                paymentFrequency: paymentFrequency,
                requiredFields: {
                    address: true,
                    amount: showAmount,
                    customerName: true,
                    mobileNumber: showMobileNumber,
                    referenceNumber: true
                },
                pocketReference: ""
            }
        updatePaymentLink(payload)
                .then(res => {
                    setProcessing(false);
                    if (res.responseCode === '00'){
                        alertSuccess('Payment link updated');
                        formReset();
                        reload();
                        close()
                    }else{
                        alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                    }
                })
                .catch(e=>{
                    setProcessing(false);
                    alertExceptionError(e)
                })

    };

    const formReset = () => {
        const form = document.querySelector("#seerbit-form")
        Array.from(form.querySelectorAll("input")).forEach(
            input => {
                input.value = ""
            }
        );
        Array.from(form.querySelectorAll("textarea")).forEach(
            input => (input.value = "")
        );
    };

    const handleValue = (e) => {
        if (e.target.name === "customizationName") {
            let removeSpecialCharacters = e.target.value.replace(/[^a-zA-Z ]/g, '').trim()
            let removeSpace = removeSpecialCharacters.replace(/\s/g, '');
            let value = removeSpace.toLocaleLowerCase();

            setPaymentLink({ ...newPaymentLink, customizationName: value });
        } else {
            setPaymentLink({ ...newPaymentLink, [e.target.name]: e.target.value });
        }
    };

    const createCustomField = (newField) => {
        if (newField !== "" && newField.length > 2) {
            const isAvailable = additionalFields.includes(newField);
            if (isAvailable) {
                alertError(`"${newField}" has already been added. The custom field must be unique`);
            } else {
                const updatedFields = [...additionalFields, newField];
                const uniqueFields = updatedFields.filter((field, index) => updatedFields.indexOf(field) === index);
                setAdditionalField(uniqueFields);
            }

        } else {
            alertError(`Please, provide a custom field name with minimum length of 3 characters`);
        }
    }

    const removeField = index => {
        setAdditionalField([...additionalFields.filter(field => additionalFields.indexOf(field) !== index)]);
    };

    const additionalDataString = () => {
        const data = additionalFields.reduce((accumulator, field) => {
            return accumulator + `${field}:null||`;
        }, "");
        return data?.substring(0, data.length - 2)
    }

    useEffect(() => {
        if (create_payment_link && location === "create_payment_link") {
            formReset()
            setProcessing(false);
            alertSuccess("Payment link was successfully created");
            clearState({ create_payment_link: null });
            reload()
            close();
        }

        if (update_payment_link && location === "update_payment_link") {
            setProcessing(false);
            alertSuccess("Payment link was successfully updated");
            clearState({ update_payment_link: null });
            reload()
            close();
        }
    }, [location]);


    const convertDateToMinute = (dateFuture) => {
        const currentDate = new Date();
        const diffInMilliSeconds = dateFuture.getTime() - currentDate.getTime()
        const minutes = Math.floor(diffInMilliSeconds / 60000);
        const startDate = moment(currentDate.getTime()).format("yyyy-MM-DD HH:mm:ss");
        setDate(dateFuture);

        setPaymentLink({
            ...newPaymentLink, expiryDuration: minutes, customTime: startDate,
        })
    }

    return (
        <AppModal title={isEdit ? "Update Payment Link" : "Create Payment Link"} isOpen={isOpen} close={() => close()} >
            <form className="w-100 pb-4" onSubmit={handleSubmit} id='seerbit-form'>
                <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{t('Page Name')}</label>
                    <input
                        className="form-control mh-40 "
                        type="text"
                        name="paymentLinkName"
                        onChange={(e) => handleValue(e)}
                        required
                        value={isEdit && newPaymentLink.paymentLinkName === undefined ? selectedData.paymentLinkName : newPaymentLink.paymentLinkName}
                    />
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{t('Description (optional)')}</label>
                    <textarea
                        name="description"
                        className="form-control"
                        minLength={2}
                        maxLength={100}
                        rows="3"
                        style={{ resize: "none" }}
                        value={isEdit && newPaymentLink.description === undefined ? selectedData.description : newPaymentLink.description}
                        onChange={(e) => handleValue(e)}
                    />
                </div>

                {showAmount && <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{t('Amount')}</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                {isEdit &&
                newPaymentLink.currency === undefined
                    ? selectedData.currency !== undefined ? selectedData.currency : business_details.default_currency
                    : newPaymentLink.currency !== undefined ? newPaymentLink.currency : business_details.default_currency}
              </span>
                        </div>
                        <input
                            className="form-control mh-40 "
                            pattern="[+-]?([0-9]*[.])?[0-9]+"
                            type="text"
                            name="amount"
                            onChange={(e) => handleValue(e)}
                            required
                            value={isEdit && newPaymentLink.amount === undefined ? selectedData.amount : newPaymentLink.amount}
                        />
                    </div>
                </div>
                }

                <div className=" form-inline">
                    <div className="form-group">
                        <input
                            type="checkbox"
                            className="form-control mr-3"
                            checked={showAmount}
                            onChange={(e) => setShowAmount(!showAmount)}
                        />
                    </div>
                    <label className="form-label font-12">{t('I want to collect a fix amount on this page')}</label>
                </div>
                <div className="mb-2">
                    <div className="form-inline">
                        <div className="form-group">
                            <input
                                type="checkbox"
                                className="form-control mr-3"
                                checked={showDate}
                                onChange={(e) => setShowDate(!showDate)}
                            />
                        </div>
                        <label className="form-label font-12">{t('I want to set expiration period')}</label>
                    </div>

                    <div className="form-group mb-0 form-inline">
                        <div className="form-group">
                            <input
                                type="checkbox"
                                className="form-control mr-3"
                                checked={showMobileNumber}
                                onChange={(e) => setShowMobileNumber(!showMobileNumber)}
                            />
                        </div>
                        <label className="form-label font-12">{t('I want to collect phone number')}</label>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <input
                                type="checkbox"
                                className="form-control mr-3"
                                checked={active}
                                onChange={(e) => setActive(!active)}
                            />
                        </div>
                        <label className="form-label font-12">{t('I want to set the status to be active')}</label>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="form-group mh-40 ">
                        <label className="font-12">
                            {t('Accept Specific Currency')}
                        </label>
                        <select
                            className="form-control mh-40"
                            name="currency"
                            onChange={(e) => handleValue(e)}
                            required
                            value={isEdit && newPaymentLink.currency === undefined ? selectedData.currency : newPaymentLink.currency}
                        >
                            <option selected value={null} disabled>
                                {!isEmpty(currencies) && currencies.payload ? t("Select Currency") :t("Loading")+'...'}
                            </option>
                            {
                                !isEmpty(currencies) &&
                                currencies.payload &&
                                currencies.payload.map((list, key) => {
                                    return (
                                        <option key={key} value={list.code}>
                                            {list.currency}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>

                    {showDate && <div className="sbt-expiration">
                        <label className="font-12">
                            {t('Select expiration period')}
                        </label>
                        <Calendar
                            showTime
                            hourFormat="12"
                            placeholder="Select Expiration Period"
                            minDate={new Date()}
                            value={date}
                            onChange={(e) => convertDateToMinute(e.value)}
                            className="font-12 cursor-pointer"
                            style={{ width: "100%" }}
                        ></Calendar>
                    </div>}
                </div>

                <div className="my-2">
                    <div className="font-12 my-2 font-medium">{t('Page Type')}</div>
                    <div className="font-12">
                        {t('Single use links are automatically deactivated once payment has been received while multiple use links can be used multiple times')}
                    </div>
                    <div className="font-12 my-2">
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="radio"
                                    className="form-control mr-3"
                                    name="optradio"
                                    checked={type}
                                    onChange={(e) => {
                                        setType(true);
                                    }}
                                />
                            </div>
                            <label className="form-label mx-2">
                                {t('Single Use')}
                            </label>
                        </div>
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="radio"
                                    className="form-control mr-3"
                                    name="optradio"
                                    checked={!type}
                                    onChange={(e) => {
                                        setType(false);
                                    }}
                                />
                            </div>
                            <label className="form-label mx-2">
                                {t('Multiple Use')}
                            </label>
                        </div>
                    </div>
                </div>

             <div className="my-2">
                    <div className="font-12 my-2 font-medium">{t('Payment Frequency')}</div>
                    <div className="font-12">
                        {t('Select if the link is a recurring payment link or one time payment link')}
                    </div>
                    <div className="font-12 my-2">
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="radio"
                                    className="form-control mr-3"
                                    name="frequency"
                                    checked={paymentFrequency === "ONE_TIME"}
                                    onChange={(e) => {
                                        setFrequency("ONE_TIME");
                                    }}
                                />
                            </div>
                            <label className="form-label mx-2">
                                {t('One time')}
                            </label>
                        </div>
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="radio"
                                    className="form-control mr-3"
                                    name="frequency"
                                    checked={paymentFrequency === "RECURRENT"}
                                    onChange={(e) => {
                                        setFrequency("RECURRENT");
                                    }}
                                />
                            </div>
                            <label className="form-label mx-2">
                                {t('Recurring')}
                            </label>
                        </div>
                    </div>
                </div>


                {showAdditionalFields && <div>
                    <Modal.Title className="font-18 text-dark pb-1">
                        <div className="pt-2 text-bold">
                            <strong>{t('Additional Fields')}</strong> ({t('optional')})
                        </div>
                    </Modal.Title>

                    <div className="form-group mh-40 ">
                        <label className="font-12 font-medium">{t('Custom Payment Link')}</label>
                        <div className="input-group">
                            <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                <span className="input-group-text" id="basic-addon1">
                  https://pay.seerbitapi.com/
                </span>
                            </div>
                            <input
                                className="form-control mh-40"
                                name="customizationName"
                                type="text"
                                value={isEdit && newPaymentLink.customizationName === undefined ? selectedData.customizationName : newPaymentLink.customizationName}
                                onChange={(e) => handleValue(e)}
                            />
                        </div>
                        <div className="d-flex justify-content-end mt-1">
                            {newPaymentLink && newPaymentLink.customizationName && (
                                validating ? (
                                    <span className="font-10 text-muted">{t('checking')}...</span>
                                ) : (
                                    <span className="font-10">{validatecustomurl && !validatecustomurl.payload ? (
                                        <span className="text-success">{t('Available')}</span>
                                    ) : (
                                        <span className="text-danger">{t('Not Available')}</span>
                                    )
                                    }</span>
                                )
                            )}
                        </div>
                    </div>

                    <div className="form-group mh-40 ">
                        <label className="font-12 font-medium">{t('Success Message')}</label>
                        <input
                            className="form-control mh-40 "
                            type="text"
                            name="successMessage"
                            onChange={(e) => handleValue(e)}
                            value={isEdit && newPaymentLink.successMessage === undefined ? selectedData.successMessage : newPaymentLink.successMessage}
                        />
                    </div>

                    <div className="form-group mh-40 ">
                        <label className="font-12 font-medium">{t('Split Payment')}</label>
                        <input
                            placeholder={t('Enter subaccount ID to split payment with')}
                            className="form-control mh-40"
                            type="text"
                            name="vendorId"
                            onChange={(e) => handleValue(e)}
                            value={isEdit && newPaymentLink.vendorId === undefined ? selectedData.vendorId : newPaymentLink.vendorId}
                        />
                    </div>

                    <div className="form-group mh-40 ">
                        <label className="font-12 font-medium">{t('Redirect URL')}</label>
                        <input
                            className="form-control mh-40 "
                            placeholder={t(`Enter a valid URL starting with "http://" or "https://"`)}
                            pattern={validate.web}
                            type="url"
                            name="redirectUrl"
                            onChange={(e) => handleValue(e)}
                            value={isEdit && newPaymentLink.redirectUrl === undefined ? selectedData.redirectUrl : newPaymentLink.redirectUrl}
                        />
                    </div>

                    <div className="px-3 row">
                        {additionalFields && additionalFields.map((field, id) => (
                            <div key={id} className="tag my-2 mr-2 font-12 text-capitailize">
                                <span>{field}</span>
                                <span className="badge" onClick={() => removeField(id)}>X</span>
                            </div>
                        ))
                        }
                    </div>

                    <div className="form-group mh-40 mb-4">
                        <label className="font-12 font-medium">{t('Custom Field')}</label>
                        <div className="input-group">
                            <input
                                className="form-control mh-40 "
                                placeholder={t(`Enter custom field`)}
                                type="text"
                                name="newField"
                                onChange={(e) => setNewField(e.target.value)}
                                value={newField}
                            />
                            <div className="input-group-append">
                                <button
                                    onClick={() => createCustomField(newField)}
                                    className="btn btn-outline-secondary"
                                    type="button">{t('Create')}</button>
                            </div>
                        </div>
                    </div>
                </div>
                }

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
                        {!isEdit ? t("Create Payment Link") : t("Update Payment Link")}
                    </Button>
                </div>
                {showAdditionalFields ? <div
                    className="text-center seerbit-color cursor-pointer mb-2"
                    onClick={() => setShowField(false)}
                >
                    {t('show less')}
                </div>
                    :
                    <div
                        className="text-center seerbit-color cursor-pointer mb-2"
                        onClick={() => setShowField(true)}
                    >
                        {t('show more options')}
                    </div>
                }
            </form>
        </AppModal>
    );
}

const mapStateToProps = (state) => ({
    currencies: state.data.get_allowed_currencies,
    update_payment_link: state.data.update_payment_link,
    create_payment_link: state.data.create_payment_link,
    business_details: state.data.business_details,
    error_details: state.data.error_details,
    location: state.data.location,
    validatecustomurl: state.data.validatecustomurl
});
export default connect(mapStateToProps, {
    getAllowedCurrencies,
    updatePaymentLink,
    validateCustomUrl,
    getPaymentLinks,
    clearState,
})(EditPaymentLink);
