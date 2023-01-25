import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
    createDeliveryZone,
    getDeliveryZone,
    clearState,
    loadAllStoreDetails,
} from "actions/postActions";
import Back from "assets/images/svg/back-left.svg";
import { connect } from "react-redux";
import Button from "components/button"
import "./css/general.scss";
import {useTranslation} from "react-i18next";
import {alertError, alertSuccess} from "../../modules/alert";

export function Delivery(props) {
    const { t } = useTranslation();
    const [perPage, setPerPage] = useState(25);
    const [showZones, setShowZones] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [value, setValue] = useState();

    const {
        createDeliveryZone,
        get_delivery_zone = [],
        storeId,
        location,
        error_details,
        create_delivery_zone,
        clearState,
        getDeliveryZone,
        loadAllStoreDetails,
        currency,
        close
    } = props;

    useEffect(() => {
        getDeliveryZone({
            storeId,
            size: perPage,
            start: 1,
        })
    }, [])

    const handleValue = (e) => {
        if (e.target.name === "fee") {
            setValue({ ...value, fee: Number(e.target.value) });
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setProcessing(true)
        createDeliveryZone({
            data: {
                ...value,
                storeId: storeId
            },
            location: "create_delivery_zone"
        })
    }

    useEffect(() => {
        if (create_delivery_zone && location === "create_delivery_zone") {
            setProcessing(false);
            alertSuccess("Delivery zone was successfully created");
            getDeliveryZone({
                storeId,
                size: perPage,
                start: 1,
            })
            setShowZones(false)
            loadAllStoreDetails({ storeId })
            clearState({ name: "create_delivery_zone", value: null });
            close();
        }
    }, [clearState, create_delivery_zone, getDeliveryZone, loadAllStoreDetails, location, perPage, storeId]);

    useEffect(() => {
        if (error_details && error_details.error_source === "create_delivery_zone") {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
        }

        if (error_details && error_details.error_source === "get_delivery_zone") {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
        }

        clearState({ name: "error_details", value: null });
    }, [error_details]);

    return (
        <div className="sbt-general mt-5">
            {!showZones && (
                <div className="mb-4">
                    <div className="my-3 d-flex justify-content-end">
                        <Button
                            size="sm"
                            onClick={() => setShowZones(true)}
                        >
                            {t('Create Delivery Zones')}
                        </Button>
                    </div>
                    <div>
                        {get_delivery_zone && get_delivery_zone.payload && get_delivery_zone.payload.length > 0 && (
                            <span className="sbt-delivery">{t('Delivery Zone')}</span>
                        )}
                        <div className="mt-3">
                            {get_delivery_zone && get_delivery_zone.payload && get_delivery_zone.payload.map((data, id) => (
                                <div key={id}>
                                    <div className="d-flex justify-content-between" >
                                        <div>{data.name}</div>
                                        <div>{`${currency} ${data.fee}`}</div>
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showZones && (
                <div>
                    <div className="d-flex justify-content-start align-items-center back cursor-pointer mt-3 mb-4" onClick={() => setShowZones(false)}>
                        <img src={Back} className="font-20 close mr-2" alt="icon" />
                        {t('back')}
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="sbt-sub-title mb-4">{t('Create Delivery Zone')}</div>
                        <div className="form-group mh-40 mt-5">
                            <input
                                className="form-control mh-40 "
                                type="text"
                                name="regionName"
                                onChange={(e) => handleValue(e)}
                                value={value && value.regionName}
                                placeholder={t('Delivery Zone')}
                            />
                        </div>
                        <div className="form-group mh-40 mt-4">
                            <input
                                className="form-control mh-40 "
                                name="fee"
                                type="number"
                                pattern="^\d*(\.\d{0,2})?$"
                                onChange={(e) => handleValue(e)}
                                value={value && value.fee}
                                placeholder={t('Amount')}
                            />
                        </div>
                        <div className="mt-3 d-flex justify-content-end">
                            <Button
                                size="sm"
                                type="submit"
                                disabled={processing}
                            >
                                {processing && (
                                    <Spinner animation="border" variant="light" size='sm'/>
                                )}
                                {!processing && t('Save')}
                            </Button>

                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    location: state.data.location,
    get_delivery_zone: state.data.get_delivery_zone,
    create_delivery_zone: state.data.create_delivery_zone
});

export default connect(mapStateToProps, {
    getDeliveryZone,
    createDeliveryZone,
    loadAllStoreDetails,
    clearState,
})(Delivery);
