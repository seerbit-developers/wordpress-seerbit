import React from 'react';
import {ProgressBar} from "react-bootstrap";
import {useTranslation} from "react-i18next";

function BusinessDetailsStep({
                                icon,
                                percent,
                                 setProgressStatus
                             }) {
    const { t } = useTranslation();
    return (
        <div>
            <div className="row p-0 m-0">
                <div className="progress_indicator_icon">
                    <img src={icon}
                         className='cursor-pointer'
                         onClick={()=>{setProgressStatus(0)}}
                    />
                </div>
                <div className="mx-3 pt-3">
                    <ProgressBar
                        variant={
                            (percent > 49 && "success") || "primary"
                        }
                        now={
                            (percent === 100 && 100) ||
                            percent
                        }
                        style={{width: "120px", height: "3px"}}
                    />
                </div>
            </div>
            <div>
                <div className="stage mt-2 cursor-pointer" onClick={()=>{setProgressStatus(0)}}>{t('STEP 1')}</div>
                <div className="stage-title mb-1 cursor-pointer" onClick={()=>{setProgressStatus(0)}}>{t('Business Profile')}</div>
                <span className={`${percent >= 49 ? 'status-green' : 'status'} px-2 py-1 font-9 cursor-pointer`} onClick={()=>{setProgressStatus(0)}}>
                    {percent === 100 ? t("Completed") : percent + '%'}
                  </span>
            </div>
        </div>
    );
}

export default BusinessDetailsStep;
