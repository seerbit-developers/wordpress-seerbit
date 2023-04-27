/** @format */
import React, {useState, useEffect, useCallback} from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty,debounce } from "lodash";
import AppModal from "components/app-modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {createStore, validateNewStoreName} from "services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import Joi from '@hapi/joi';
import validationObject from './validate.create';


import { useTranslation } from "react-i18next";


function CreateFrontStore(props) {
    const {
        currencies,
        close,
        reload,
        isOpen
    } = props;

    const [processing, setProcessing] = useState(false);
    const [validating, setValidate] = useState(false);
    const [storeValidation, setStoreValidation] = useState(null);
    const [splitSettlement, setSplitSettlement] = useState(false);
    const [values, setValues] = useState({currency:"NGN"});
    const {t} = useTranslation()


    useEffect(() => {
        setValidate(false)
    }, [])

    const checkStoreName =  (nextValue)=>{
        setValidate(true);
        validateNewStoreName(nextValue)
            .then((res) => {
                setValidate(false);
                if (res.responseCode === "00") {
                    setStoreValidation(res)
                } else {
                    alertError(res.message
                        ? res.message
                        : "An Error Occurred sending the request. Kindly try again");
                }
            })
            .catch((e) => {
                setValidate(false);
                alertExceptionError(e, "frontstore")
            })
    }

    const debouncedSearch = useCallback(
        debounce((nextValue,checkStoreName)=> checkStoreName(nextValue)
            , 1000)
    , [ ])


    useEffect(() => {
        if (values && values.storeName) {
            debouncedSearch(values.storeName, checkStoreName)
        }
    }, [values && values.storeName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (values && values.storeName) {
            if (storeValidation && storeValidation.payload) {
                setProcessing(false);
                alertError("Oops!, the provided custom url is not available.");
                return
            }
        }
        const p = {
            ...values,
            splitSettlement,
            status: "ACTIVE",
            storeUrl: `https://store.seerbit.com/${values.storeName.replace(/\s/g, '').toLocaleLowerCase()}`
        }
        const schema = Joi.object(validationObject);

        try {
            const validation = await schema.validate(p);
            if (validation.error){
                alertError(validation.error.message);
            }else{
                setProcessing(true);
                createStore(p)
                    .then((res) => {
                        setProcessing(false);
                        if (res.responseCode === "00") {
                            alertSuccess("Your store was successfully created.");
                            formReset()
                            reload();
                            close();
                        } else {
                            alertError(res.message
                                ? res.message
                                : "An Error Occurred sending the request. Kindly try again");
                        }
                    })
                    .catch((e) => {
                        setProcessing(false);
                        alertExceptionError(e)
                    });
            }
        }
        catch (e) {
            alertExceptionError(e)
        }


        // createFrontStore({
        //     data: { ...values, status: "ACTIVE", storeUrl: `https://seerbit.store/${values.storeName.replace(/\s/g, '').toLocaleLowerCase()}` },
        //     location: "create_front_store"
        // })

    };

    const handleValue = (e) => {
        setValues({ ...values, [e.target.name]: e.target.name === 'storeName' ?
                e.target.value.toLowerCase().replace(/\s/g, '') :
                e.target.value });
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


    return (
        <AppModal title={"Create a store"} isOpen={isOpen} close={() => close()}>
            <form className="w-100" onSubmit={handleSubmit} id='seerbit-form'>

                <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{t("Store Name")}</label>
                    <input
                        className="form-control mh-40 "
                        type="text"
                        name="storeName"
                        onChange={(e) => handleValue(e)}
                        required
                    />

                    <div className="d-flex justify-content-end mt-1">
                        {values && values.storeName && (
                            validating ? (
                                <span className="font-10 text-muted">{t("checking availability")}...</span>
                            ) : (
                                <span className="font-10">{storeValidation && !storeValidation.payload ? (
                                    <span className="text-success">{t("Available")}</span>
                                ) : (
                                    <span className="text-danger">{t("Not Available")}</span>
                                )
                                }</span>
                            )
                        )}
                    </div>
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{t("Store URL")}</label>
                    <div className="input-group">
                        <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                            <span className="input-group-text" id="basic-addon1">
                                https://store.seerbit.com/
                            </span>
                        </div>
                        <input
                            className="form-control mh-40"
                            type="text"
                            onChange={(e) => handleValue(e)}
                            disabled
                            value={(storeValidation && !storeValidation.payload) ? values && values.storeName && values.storeName.replace(/\s/g, '').toLocaleLowerCase() : ""}

                        />
                    </div>
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12">
                        {t("Store Currency")}
                    </label>
                    <select
                        className="form-control mh-40"
                        name="currency"
                        onChange={(e) => handleValue(e)}
                        required
                        defaultValue="NGN"
                    >
                        <option selected disabled>{!isEmpty(currencies) && currencies.payload ? t("Select currency") : t("Loading")+"..."}</option>
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
                <div className="form-group mh-40 ">
                    <div className="d-flex align-items-center mb-2">
                        <span className="font-12 font-medium mr-2" title={t('Share your revenue with another account')}>{t("Split Settlement")}</span>
                        <input type="checkbox" checked={splitSettlement} onClick={()=>setSplitSettlement(!splitSettlement)}/>
                    </div>
                    {splitSettlement && <input
                        placeholder={t("Enter sub-account ID to split settlement with")}
                        className="form-control mh-40"
                        type="text"
                        name="subAccountId"
                        onChange={(e) => handleValue(e)}
                    />}
                </div>

                <div className="form-group mh-40 mt-4 mb-3">
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
                        {t("Save")}
                    </Button>
                </div>

            </form>
        </AppModal>
    );
}

const mapStateToProps = (state) => ({
    currencies: state.data.get_allowed_currencies,
    business_details: state.data.business_details,
    error_details: state.data.error_details,
    location: state.data.location,
    create_front_store: state.data.create_front_store
});
export default connect(mapStateToProps, {

})(CreateFrontStore);
