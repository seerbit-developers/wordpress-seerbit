import React from "react"
import Office from "assets/images/svg/office-building.svg";
import Settlement from "assets/images/svg/settlement-info.svg";
import Upload from "assets/images/svg/onboarding-upload.svg";
import {useTranslation} from "react-i18next";
import BusinessDetailsStep from "./steps/BusinessDetailsStep";
import SettlementStep from "./steps/SettlementStep";
import KycStep from "./steps/KycStep";

const OnBoardingProgress = ({
                              progressStatus,
                                setProgressStatus,
                                stageOnePercent,
                                stageTwoPercent,
                                stageTwoComplete,
                                stageThreePercent,
                                stageThreeComplete
                          })=>{
    const { t } = useTranslation();

    return (
        <div className="progress_track">

            <BusinessDetailsStep
                icon={Office}
                percent={stageOnePercent}
                setProgressStatus={setProgressStatus}
            />
               <SettlementStep
                   icon={Settlement}
                   percent={stageTwoPercent}
                   setProgressStatus={setProgressStatus}
                   progressStatus={progressStatus}
                   stageTwoComplete={stageTwoComplete}
               />
                <KycStep
                    icon={Upload}
                    percent={stageThreePercent}
                    setProgressStatus={setProgressStatus}
                    progressStatus={progressStatus}
                    stageThreeComplete={stageThreeComplete}
                />
        </div>
    )
}

export default OnBoardingProgress
