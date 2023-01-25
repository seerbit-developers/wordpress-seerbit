/** @format */
import React, {useState, useEffect, useCallback} from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty,debounce } from "lodash";
import AppModal from "components/app-modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {updateStore, validateNewStoreName} from "services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import Joi from '@hapi/joi';
import validationObject from './validate.create';
import Toggle from "../../../../components/toggle";

import { useTranslation } from "react-i18next";


function EditFrontStore(props) {
    const {
        currencies,
        close,
        reload,
        isOpen,
        store
    } = props;

    const [processing, setProcessing] = useState(false);
    const [validating, setValidate] = useState(false);
    const [searchDirty, setSearchDirty] = useState(false);
    const [storeName, setStoreName] = useState('');
    const [storeValidation, setStoreValidation] = useState(null);
    const [splitSettlement, setSplitSettlement] = useState(false);
    const [status, setStatus] = useState('');
    const [values, setValues] = useState();
    const {t} = useTranslation()


    useEffect(() => {
        setValidate(false)
    }, [])

    useEffect(() => {
        if (store){
            setValues(store)
            setStatus(store.status)
            setSplitSettlement(!!store.subAccountId)
        }
    }, [store])

    const checkStoreName =  (nextValue)=>{
        setValidate(true);
        setSearchDirty(true);
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
                console.log(e)
                setValidate(false);
                alertExceptionError(e, "frontstore")
            })
    }

    const debouncedSearch = useCallback(
        debounce((nextValue,checkStoreName)=> checkStoreName(nextValue)
            , 1000)
        , [ ])

    useEffect(() => {
        if (storeName) {
            debouncedSearch(storeName, checkStoreName)
        }
    }, [storeName]);

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
            currency:values.currency ? values.currency :  null,
            subAccountId:values.subAccountId ? values.subAccountId :  null,
            storeName:values.storeName ? values.storeName :  null,
            splitSettlement,
            status: status,
            storeUrl: `https://store.seerbit.com/${values.storeName.replace(/\s/g, '').toLocaleLowerCase()}`
        }
        console.log(p)
        const schema = Joi.object(validationObject);

        try {
            const validation = await schema.validate(p);
            if (validation.error){
                alertError(validation.error.message);
            }else{
                setProcessing(true);
                updateStore(p, values.storeId)
                    .then((res) => {
                        setProcessing(false);
                        if (res.responseCode === "00") {
                            alertSuccess("Your store was successfully updated.");
                            reload();
                            close();
                        } else {
                            alertError(res.message
                                ? res.message
                                : "An Error Occurred sending the request. Kindly try again");
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        setProcessing(false);
                        alertExceptionError(e)
                    });
            }
        }
        catch (e) {
            alertExceptionError(e)
        }

    };

    const handleValue = (e) => {
        if (e.target.name === 'storeName'){
            setStoreName(e.target.value.toLowerCase().replace(/\s/g, ''));
        }
        setValues({ ...values, [e.target.name]: e.target.name === 'storeName' ?  e.target.value.toLowerCase().replace(/\s/g, '') : e.target.value });
    };

    return (
        <AppModal title={`Edit Store ${values && values.storeName && ' ('+values.storeName + ')'}`} isOpen={isOpen} close={() => close()}>
            <form className="w-100" onSubmit={handleSubmit} id='seerbit-form'>

                <div className="form-group mh-40 ">
                    <label className="font-12 font-medium">{status === "ACTIVE" ? t("Your store is Live") : t('Your store is Offline')}</label>
                    <Toggle
                        active={status === "ACTIVE"}
                        activeClass={"config-active"}
                        onChange={ ()=> setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                    />
                </div>
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
                        {searchDirty && values && values.storeName && (
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
                            value={values && values.storeName && values.storeName.replace(/\s/g, '').toLocaleLowerCase()}

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
                        value={values && values.currency}
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
                        value={values && values.subAccountId}
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
});
export default connect(mapStateToProps, {

})(EditFrontStore);
