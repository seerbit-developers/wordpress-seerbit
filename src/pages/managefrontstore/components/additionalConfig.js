import React from "react";
// import Next from "assets/images/svg/next.svg";
import {useTranslation} from "react-i18next";

const StoreAdditionalConfig = ({onEdit})=>{
    const { t } = useTranslation();
    return (
        <div className="col-lg-9 col-md-12 py-3">
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">{t('Discount')}</div>
                        <div className="sbt-value">{t('Configure discounts for purchases')}
                        </div>
                    </div>
                    {/*<img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("setting")}/>*/}
                </div>
            </div>
            <div className="sbt-table-bottomless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">{t('Delivery Zones')}</div>
                        <div className="sbt-value">{t('Configure product delivery zones')}
                        </div>
                    </div>
                    {/*<img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("setting")}/>*/}
                </div>
            </div>
        </div>
    )
};

export default StoreAdditionalConfig;
