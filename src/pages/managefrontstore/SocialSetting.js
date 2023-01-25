import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Button from "components/button";
import {
    loadAllStoreDetails,
    createGeneralStoreSettings,
    clearState,
} from "actions/postActions";
import { connect } from "react-redux";
import "./css/general.scss";
import AppModal from "../../components/app-modal";
import {saveStoreSettings} from "../../services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {useTranslation} from "react-i18next";

export function GeneralSettings(props) {
    const { t } = useTranslation();
    const {
        setOpen,
        storeId,
        isOpen,
        selectedStore,
        refresh
    } = props;

    const [value, setValue] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [field, setField] = useState({
        redirect: true,
        success: true
    });

    const handleValue = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    useEffect( ()=>{
        if (selectedStore)
        {
            setValue(selectedStore)
        }
    }, [selectedStore])

    const handleSubmit = (e) => {
        e.preventDefault()
        setProcessing(true)
        saveStoreSettings(storeId, { ...value })
            .then(res => {
                if (res.responseCode === '00'){
                    setProcessing(false)
                    refresh();
                    setOpen(false);
                    alertSuccess('Successful')
                }else{
                    alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                }
            })
            .catch(e=>{
                setProcessing(false)
                alertExceptionError(e)
            })
    }

    return (
        <AppModal
            title={"General Setup"}
            isOpen={isOpen}
            close={() => {
                setOpen(false);
            }}>
                    <div className="sbt-general sbt-social">
                        <form onSubmit={(e) => handleSubmit(e)}>

                            <div className="mb-5 mt-5">
                                <div className="form-group mh-40 mt-4">
                                    <input
                                        className="form-control mh-40 "
                                        type="text"
                                        name="welcomeMessage"
                                        minLength={2}
                                        onChange={(e) => handleValue(e)}
                                        value={value && value.welcomeMessage}
                                        placeholder={t('enter store welcome message')}
                                        disabled={processing}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">

                                <div className="sbt-social-title mb-4 ">{t('Social Media Profile')}</div>
                                <div className="form-group mh-40 mb-4">
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                                            <span className="input-group-text" id="basic-addon1">
                                                https://instagram.com/
                                            </span>
                                        </div>
                                        <input
                                            className="form-control mh-40"
                                            name="instagramLink"
                                            type="text"
                                            disabled={processing}
                                            value={value && value.instagramLink}
                                            onChange={(e) => handleValue(e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mh-40 mb-4">
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                                            <span className="input-group-text" id="basic-addon1">
                                                https://facebook.com/
                                            </span>
                                        </div>
                                        <input
                                            className="form-control mh-40"
                                            name="facebookLink"
                                            type="text"
                                            disabled={processing}
                                            value={value && value.facebookLink}
                                            onChange={(e) => handleValue(e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mh-40 mb-4">
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                                            <span className="input-group-text" id="basic-addon1">
                                                https://twitter.com/
                                            </span>
                                        </div>
                                        <input
                                            className="form-control mh-40"
                                            name="twitterLink"
                                            type="text"
                                            disabled={processing}
                                            value={value && value.twitterLink}
                                            onChange={(e) => handleValue(e)}
                                        />
                                    </div>
                                </div>

                                <div className="sbt-social-title mb-4 mt-5 ">{t('After Purchase')}</div>
                                <div className="form-outline mb-3">
                                    <input
                                        name="redirectUrl"
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        onChange={(e) => {
                                            handleValue(e)
                                            setField({ ...field, redirect: false })
                                        }}
                                        disabled={processing}
                                        placeholder="e.g https://seerbit.com"
                                        value={value && value.redirectUrl}
                                    />
                                    {field.redirect && <label className="has-redirect">{t('Redirect Url')}</label>}
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        name="successResponseMessage"
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        disabled={processing}
                                        onChange={(e) => {
                                            handleValue(e)
                                            setField({ ...field, success: false })
                                        }}
                                        placeholder={t('e.g thank you for shopping with us')}
                                        value={value && value.successResponseMessage}
                                    />
                                    {field.success && <label className="has-success">{t('Success Message')}</label>}
                                </div>

                                <div className="mt-5">
                                    <Button
                                        style={{ width: "100%" }}
                                        size="sm"
                                        disabled={processing}
                                        buttonType="submit"
                                    >
                                        {processing && (
                                            <Spinner animation="border" variant="light" size='sm'/>
                                        )}
                                        {!processing && t("Save")}
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </div>
        </AppModal>
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    location: state.data.location,
    create_general_store_settings: state.data.create_general_store_settings
});

export default connect(mapStateToProps, {
    loadAllStoreDetails,
    createGeneralStoreSettings,
    clearState,
})(GeneralSettings);
