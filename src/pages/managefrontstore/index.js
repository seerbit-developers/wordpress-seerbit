import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
    setErrorLog,
    clearState,
    updateFrontStore,
    loadAllStoreDetails,
    getStoreDetails,
    updateTheme,
    getTheme
} from "actions/postActions";

import Button from "components/button";
import useWindowSize from "components/useWindowSize";
import SocialSetting from "./SocialSetting";
import GeneralSettings from "./GeneralSettings";
import { isEmpty } from "lodash";
import "./css/index.scss";
import {useHistory, useParams} from "react-router";
import StoreAdditionalConfig from "./components/additionalConfig";
import StoreGeneralConfig from "./components/generalConfig";
import BasicConfig from "./components/basicConfig";
import StoreThemes from "./components/storeThemes";
import {alertError, alertSuccess} from "modules/alert";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export function ManageFrontstore(props) {
    const {storeId} = useParams();
    const history = useHistory();
    const [selectedTheme, setselectedTheme] = useState();
    const [isOpen, setOpen] = useState(false);
    const [isOpenGeneral, setOpenGeneral] = useState(false);
    const [openType, setOpenType] = useState("setting");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedStore, setselectedStore] = useState(null);
    const [selectedStoreDetails, setselectedStoreDetails] = useState(null);
    const { t } = useTranslation();
    const size = useWindowSize()
    const { width } = size;
    const isMobile = width < 1200;

    const {
        all_store_details,
        updateTheme,
        getTheme,
        loadAllStoreDetails,
        updateFrontStore,
        getStoreDetails,
        themes
    } = props;

    useEffect(() => {
        setLoading(true);
        getTheme()
        loadAllStoreDetails({ storeId: storeId })
        getStoreDetails({ start: 1, size: 25 });
    }, []);

    useEffect(() => {
        setLoading(true);
        if (!isEmpty(themes)) setLoading(false);
        if (!isEmpty(all_store_details)) {
            setLoading(false);
            setselectedStoreDetails(all_store_details.payload)
        }
        if (!isEmpty(props.store_details)) {
            setLoading(false);
            const store = props.store_details.payload.find(item=>item.storeId === storeId)
            setselectedStore(store)
        }
        if (!isEmpty(props.error_details)) setLoading(false);
    }, [themes, all_store_details, props.error_details, props.store_details]);

    useEffect(() => {
        if (props.error_details && props.location === "store_theme") {
            alertError(props.error_details.message);
            props.clearState({ name: "error_details", value: null });
        }

        if (props.error_details && props.location === "update_theme") {
            setProcessing(false);
            alertError(props.error_details.message);
            props.clearState({ name: "error_details", value: null });
        }

        if (props.error_details && props.location === "update_front_store") {
            setProcessing(false);
            alertError(props.error_details.message);
            props.clearState({ name: "error_details", value: null });
        }
    }, [props, props.error_details]);

    useEffect(() => {
        if (props.update_theme && props.location === "update_theme") {
            loadAllStoreDetails({ storeId: storeId })
            getStoreDetails({ start: 1, size: 25 });
            // alertSuccess("Theme was successfully set.")
        }
        if (props.update_front_store && props.location === "update_front_store") {
            getStoreDetails({ start: 1, size: 25 });
            loadAllStoreDetails({ storeId: storeId })
            alertSuccess(`${selectedStore?.status === "ACTIVE" ? "Store deactivated" : "Store activated"}`, 'store_manage');
            setProcessing(false);
        }
    }, [
        props.update_theme,
        props.update_front_store,
        props.location
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        updateFrontStore({
            data: {
                storeName: selectedStore?.storeName,
                subAccountId: selectedStore?.subAccountId,
                currency: selectedStore?.currency,
                storeUrl: selectedStore?.storeUrl,
                theme: selectedStore?.theme,
                status: selectedStore?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
            },
            location: "update_front_store",
            storeId: selectedStore?.storeId
        })

    };

    const onEdit = (type)=>{
        setOpenGeneral(false);
        setOpen(true);
        setOpenType(type)
    }

    const onEditGeneral = (type)=>{
        setOpen(false);
        setOpenGeneral(true);
        setOpenType(type)
    }

    return (
        <div className="sbt-frontstore">
            <GeneralSettings
                    setOpen={setOpenGeneral}
                    storeId={storeId}
                    currency={selectedStore?.currency}
                    isOpen={isOpenGeneral}
                    isMobile={isMobile}
                    refresh={()=>loadAllStoreDetails({ storeId: storeId })}
                    all_store_details={all_store_details}
                />
           <SocialSetting
               setOpen={setOpen}
               storeId={storeId}
               isOpen={isOpen}
               isMobile={isMobile}
               refresh={()=>loadAllStoreDetails({ storeId: storeId })}
               selectedStore={selectedStoreDetails}
           />

            <div
                style={isMobile ? {
                    padding: 30
                } : {
                    // background: "#F0F2F7",
                    padding: "70px 178px"
                }}
            >
                <div className="d-flex flex-row justify-content-between">
                    <div className="sbt-title" style={{ fontSize: 20 }}>{t('Manage Store')}</div>
                    <Link to="/frontstore" className="backk pb-5">
                        <LeftChevron /> {t('return to stores')}
                    </Link>
                </div>
               <BasicConfig
                   save={handleSubmit}
                   selectedStore={selectedStore}
                   setOpen={setOpen}
                   setOpenType={setOpenType}
               />
                <StoreThemes
                    loading={loading}
                    selectedStore={selectedStore}
                    themes={themes}
                    setselectedTheme={setselectedTheme}
                    selectedTheme={selectedTheme}
                    updateTheme={updateTheme}
                    storeId={storeId}
                    all_store_details={all_store_details}
                />
                <div className="my-4 d-flex align-items-center front_store__section">
                    <div className="col-12">
                        <div className="row p-0 m-0">
                            <div className="col-lg-3 col-md-12 py-3">
                                <div className="sbt-label">{t('General Setup')}</div>
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            onEdit("social")
                                        }}
                                    >
                                        {t('edit')}
                                    </Button>
                                </div>
                            </div>
                           <StoreGeneralConfig
                               all_store_details={all_store_details}
                               loading={loading}
                               onEdit={onEdit}
                           />
                        </div>
                    </div>
                </div>
                <div className="my-4 d-flex align-items-center front_store__section py-3">
                    <div className="col-12">
                        <div className="row p-0 m-0">
                            <div className="col-lg-3 col-md-12 py-3">
                                <div className="sbt-label">{t('Additional Setup')}</div>
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            onEditGeneral()
                                        }}
                                    >
                                        {t('edit')}
                                    </Button>
                                </div>
                            </div>
                           <StoreAdditionalConfig
                               onEdit={onEditGeneral}
                           />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    activate: state.data.activate,
    themes: state.data.store_theme,
    all_store_details: state.data.all_store_details,
    update_theme: state.data.update_theme,
    update_front_store: state.data.update_front_store,
    store_details: state.frontStore.business_stores_data,
    location: state.data.location
});

export default connect(mapStateToProps, {
    getTheme,
    setErrorLog,
    loadAllStoreDetails,
    getStoreDetails,
    updateFrontStore,
    clearState,
    updateTheme
})(ManageFrontstore);
