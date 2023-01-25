import React from 'react';
import {ProgressBar} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {alertInfo} from "modules/alert";
function SettlementStep({
                            icon,
                            percent,
                            setProgressStatus,
                            stageTwoComplete
                        }) {
    const { t } = useTranslation();

    const move = ()=>{
        if (stageTwoComplete){
            setProgressStatus(2)
        }else{
            alertInfo('Please complete your Business Profile to proceed  👷 🛠', 'settlement_step')
        }
    }
    return (
        <div>
            <div className="row p-0 m-0">
                <div className="progress_indicator_icon">
                    <img
                        className='cursor-pointer'
                        onClick={()=>{move()}}
                        src={icon}
                    />
                </div>
                <div className="mx-3 pt-3">
                    <ProgressBar
                        variant={
                            percent === 100 ? "success" : "primary"
                        }
                        now={percent}
                        style={{width: "100px", height: "3px"}}
                    />
                </div>
            </div>
            <div>
                <div className="stage mt-2 cursor-pointer" onClick={()=>{move()}}>{t('STEP 2')}</div>
                <div className="stage-title mb-1 cursor-pointer" onClick={()=>{move()}}>{t('Settlement Details')}</div>
                <span className={`${percent > 49 ? 'status-green' : 'status'} px-2 py-1 font-9 cursor-pointer`}>
                   {percent === 100 ? t("Completed") : percent + '%'}
                  </span>
            </div>
        </div>
    );
}

export default SettlementStep;
