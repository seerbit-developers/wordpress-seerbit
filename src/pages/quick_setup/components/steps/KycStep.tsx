import React from 'react';
import {useTranslation} from "react-i18next";
import {alertInfo} from "modules/alert";
function KycStep({
                     icon,
                     percent,
                     setProgressStatus,
                     stageThreeComplete
                 }) {
    const { t } = useTranslation();
    const move = ()=>{
        if (stageThreeComplete){
            setProgressStatus(3)
        }else{
            alertInfo('Please complete your Settlement Details to proceed  👷 🛠', 'kyc_step')
        }
    }
    return (
        <div>
            <div className="row p-0 m-0">
                <div className="progress_indicator_icon">
                    <img src={icon}
                         className='cursor-pointer'
                         onClick={()=>{move()}}
                    />
                </div>
            </div>
            <div>
                <div className="stage mt-2" onClick={()=>{move()}}>{t('STEP 3')}</div>
                <div className="stage-title mb-1 cursor-pointer" onClick={()=>{move()}}>{t('Document Upload')}</div>
                <span className={`${percent > 49 ? 'status-green' : 'status'} px-2 py-1 font-9 cursor-pointer`}>
                   {percent === 100 ? t("Completed") : percent + '%'}
                  </span>
            </div>
        </div>
    );
}

export default KycStep;
