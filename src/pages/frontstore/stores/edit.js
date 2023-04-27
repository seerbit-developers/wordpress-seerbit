/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    getAllowedCurrencies,
    getStoreDetails,
    clearState,
    validateStoreName,
} from "actions/postActions";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import AppModal from "components/app-modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {createStore} from "services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "../../../modules/alert";
import Joi from '@hapi/joi';
import validationObject from './validate.create';
import { useTranslation } from "react-i18next";




function CreateFrontStore(props) {
    const {
        validateStoreName,
        validatestorename,
        currencies,
        getAllowedCurrencies,
        close,
        reload,
        isOpen
    } = props;

    const [processing, setProcessing] = useState(false);
    const [time, setTime] = useState(1000);
    const [validating, setValidate] = useState(false);
    const [splitSettlement, setSplitSettlement] = useState(false);
    const [values, setValues] = useState();
    const {t} = useTranslation()

    useEffect(() => {
        getAllowedCurrencies();
        setValidate(false)
    }, [validatestorename])


    useEffect(() => {
        if (values && values.storeName) {
            setValidate(true)
            setTime(1000);
            const timer = setTimeout(() => validateStoreName({ data: values.storeName }), time);
            return () => clearTimeout(timer);
        }
    }, [values && values.storeName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        if (values && values.storeName) {
            if (validatestorename && validatestorename.payload) {
                setProcessing(false);
                alertError("Oops!, the provided custom url is not available.");
                return
            }
        }
        const p = {
            ...values,
            status: "ACTIVE",
            storeUrl: `https://seerbit.store/${values.storeName.replace(/\s/g, '').toLocaleLowerCase()}`
        }
        const schema = Joi.object(validationObject);

        try {
            const validation = await schema.validate(p);
            if (validation.error){
                alertError(validation.error.message);
            }else{
            }
        }
        catch (e) {

        }
        return
        createStore(p)
            .then((res) => {
                setProcessing(false);
                if (res.responseCode === "00") {
                    alertSuccess("Your store was successfully created.");
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

        // createFrontStore({
        //     data: { ...values, status: "ACTIVE", storeUrl: `https://seerbit.store/${values.storeName.replace(/\s/g, '').toLocaleLowerCase()}` },
        //     location: "create_front_store"
        // })

    };

    const handleValue = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    // useEffect(() => {
    //     if (create_front_store && location === "create_front_store") {
    //         setProcessing(false);
    //         cogoToast.success("Your store was successfully created.", {
    //             position: "top-right",
    //         });
    //         clearState({ create_front_store: null });
    //         getStoreDetails({
    //             size: 25,
    //             start: 1,
    //             location: "store_details",
    //         });
    //         close();
    //     }
    // }, [location]);

    // useEffect(() => {
    //     if (error_details) {
    //         setProcessing(false);
    //         cogoToast.error(error_details.message, {
    //             position: "top-right",
    //         });
    //     }
    //     clearState({ error_details: null });
    // }, [error_details]);

    return (
        <AppModal title={"Create Front Store"} isOpen={isOpen} close={() => close()}>
            <form className="w-100" onSubmit={handleSubmit}>

                <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{t("Store Name")}</label>
                    <input
                        className="form-control mh-40 "
                        type="text"
                        name="storeName"
                        value={values && values.storeName}
                        onChange={(e) => handleValue(e)}
                        required
                    />

                    <div className="d-flex justify-content-end mt-1">
                        {values && values.storeName && (
                            validating ? (
                                <span className="font-10 text-muted">{t("checking")}...</span>
                            ) : (
                                <span className="font-10">{validatestorename && !validatestorename.payload ? (
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
                    <label className="font-12 font-medium">{t("Store Url")}</label>
                    <div className="input-group">
                        <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                            <span className="input-group-text" id="basic-addon1">
                                https://seerbit.store/
                            </span>
                        </div>
                        <input
                            className="form-control mh-40"
                            type="text"
                            value={validatestorename && !validatestorename.payload ? values && values.storeName.replace(/\s/g, '').toLocaleLowerCase() : ""}
                            onChange={(e) => handleValue(e)}
                            disabled
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
                        value={values && values.currency}
                        required
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
                        <span className="font-12 font-medium mr-2">{t("Split Settlement")}</span>
                        <input type="checkbox" checked={splitSettlement} onClick={()=>setSplitSettlement(!splitSettlement)}/>
                    </div>
                    {splitSettlement && <input
                        placeholder={t("Enter sub-account ID to split settlement with")}
                        className="form-control mh-40"
                        type="text"
                        name="subAccountId"
                        onChange={(e) => handleValue(e)}
                        value={values && values.subAccountId}
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
    validatestorename: state.data.validatestorename,
    create_front_store: state.data.create_front_store
});
export default connect(mapStateToProps, {
    getAllowedCurrencies,
    validateStoreName,
    getStoreDetails,
    clearState,
})(CreateFrontStore);
