import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "components/button";
import { connect } from "react-redux";
import {
    createStoreSettings,
    loadAllStoreDetails,
    clearState,
} from "actions/postActions";
import "./css/general.scss";
import {alertError, alertSuccess} from "../../modules/alert";
import {useTranslation} from "react-i18next";

export function OtherSettings(props) {
    const { t } = useTranslation();
    const {
        storeId,
        createStoreSettings,
        create_store_settings,
        location,
        error_details,
        all_store_details,
        loadAllStoreDetails,
        clearState
    } = props;

    const [value, setValue] = useState({
        isInvoice: all_store_details && all_store_details.payload && all_store_details.payload.isInvoice ? true : false,
        isNegotiation: all_store_details && all_store_details.payload && all_store_details.payload.isNegotiation ? true : false,
        isPayLater: all_store_details && all_store_details.payload && all_store_details.payload.isPayLater ? true : false,
        isNotification: all_store_details && all_store_details.payload && all_store_details.payload.isNotification ? true : false,
    }
    );
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        setProcessing(true)
        createStoreSettings({
            data: { ...value },
            storeId: storeId,
            location: "create_store_settings"
        })
        // saveStoreSettingsGeneral(storeId, { ...value })
        //     .then(res => {
        //         if (res.responseCode === '00'){
        //             setProcessing(false)
        //             // dispatchUpdateSingleBusiness(res.payload)
        //             alertSuccess('Update Successful')
        //         }else{
        //             alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
        //         }
        //     })
        //     .catch(e=>{
        //         setProcessing(false)
        //         alertExceptionError(e)
        //     })
    }

    useEffect(() => {
        if (create_store_settings && location === "create_store_settings") {
            setProcessing(false);
            alertSuccess("Store settings was successfully created.", 'store_manage');
            loadAllStoreDetails({ storeId })
            clearState({ name: "create_store_settings", value: null });
        }
    }, [clearState, create_store_settings, location]);

    useEffect(() => {
        if (error_details && error_details.error_source === "create_store_settings") {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
        }
        clearState({ name: "error_details", value: null });
    }, [clearState, error_details]);

    return (
        <div className="sbt-general mt-5">
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                    <span className="font-bold">{t('Invoicing')}</span>
                    <div className="d-flex justify-content-between my-4">
                        <span className="sbt-sub-title">{t('Invoicing')}</span>
                        <label className="switch">
                            <input type="checkbox" checked={value.isInvoice} />
                            <span className="slider round" onClick={() => setValue({ ...value, isInvoice: !value.isInvoice })}></span>
                        </label>
                    </div>
                    <span className="font-bold">{t('Negotiation')}</span>
                    <div className="d-flex justify-content-between my-4">
                        <span className="sbt-sub-title">{t('Allow Negotiation')}</span>
                        <label className="switch">
                            <input type="checkbox" checked={value.isNegotiation} />
                            <span className="slider round" onClick={() => setValue({ ...value, isNegotiation: !value.isNegotiation })}></span>
                        </label>
                    </div>
                    <span className="font-bold">{t('Pay Later')}</span>
                    <div className="d-flex justify-content-between my-4">
                        <span className="sbt-sub-title">{t('Enable Pay Later')}</span>
                        <label className="switch">
                            <input type="checkbox" checked={value.isPayLater} />
                            <span className="slider round" onClick={() => setValue({ ...value, isPayLater: !value.isPayLater })}></span>
                        </label>
                    </div>

                    <span className="font-bold">{t('Notification')}</span>
                    <div className="d-flex justify-content-between mt-4">
                        <span className="sbt-sub-title">{t('Allow Notification')}</span>
                        <label className="switch">
                            <input type="checkbox" checked={value.isNotification} />
                            <span className="slider round" onClick={() => setValue({ ...value, isNotification: !value.isNotification })}></span>
                        </label>
                    </div>
                </div>
                <div className="mt-5">
                    <Button
                        style={{ width: "100%" }}
                        disabled={processing}
                        type="submit"
                        size="sm"
                    >
                        {processing && (
                            <Spinner animation="border" variant="light" size='xs' />
                        )}
                        {!processing && t("Save")}
                    </Button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    location: state.data.location,
    create_store_settings: state.data.create_store_settings
});

export default connect(mapStateToProps, {
    createStoreSettings,
    loadAllStoreDetails,
    clearState,
})(OtherSettings);
