import React from "react";
import { isEmpty } from "lodash";
import Loader from "assets/images/svg/loader.svg";
// import Next from "assets/images/svg/next.svg";
import {useTranslation} from "react-i18next";

const StoreGeneralConfig = ({all_store_details, loading, onEdit})=>{
    const { t } = useTranslation();
    return (
        <div className="col-lg-9 col-md-12 py-3">
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">{t('Store Welcome Message')}</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.welcomeMessage === null ? t('No welcome message set')
                                : all_store_details && all_store_details.payload && all_store_details.payload.welcomeMessage
                        }
                        </div>
                    </div>
                    {/*<img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("social")}/>*/}
                </div>
            </div>
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">{t('Social Media Profiles')}</div>
                            <div className="sbt-value">
                                {isEmpty(all_store_details) && loading
                                    ? <img src={Loader} width="100" height="60" alt="icon" />
                                    : all_store_details && all_store_details.payload && all_store_details.payload.facebookLink === null
                                        ? t('No social media profiles set')
                                        : <div>
                                            <div>{all_store_details && all_store_details.payload && all_store_details.payload.facebookLink}</div>
                                        </div>
                                }
                            </div>
                    </div>
                    {/*<img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("social")}/>*/}
                </div>
            </div>
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">{t('Redirect URL')}</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.redirectUrl === null ? t('No custom redirect URl set')
                                : all_store_details && all_store_details.payload && all_store_details.payload.redirectUrl
                        }
                        </div>
                    </div>
                    {/*<img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("social")}/>*/}
                </div>
            </div>
            <div className="sbt-table-bottomless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">{t('Success Message')}</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.successResponseMessage === null ? t('No custom success message')
                                : all_store_details && all_store_details.payload && all_store_details.payload.successResponseMessage
                        }
                        </div>
                    </div>
                    {/*<img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("social")}/>*/}
                </div>
            </div>
        </div>
    )
};

export default StoreGeneralConfig;
