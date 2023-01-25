import React from "react";
import {Flipper} from "react-flip-toolkit";
import styled from "styled-components";
import Office from "assets/images/svg/company.svg";
import Done from "assets/images/svg/done.svg";
import Uploaded from "assets/images/svg/uploaded.svg";
import Settlement from "assets/images/svg/settlement-info.svg";
import SettlementInfo from "assets/images/svg/settlement_info.svg";
import Upload from "assets/images/svg/onboarding-upload.svg";
import {useTranslation} from "react-i18next";
const Bar = styled.div`
  position: relative;
  background: #cccccc7a;
  height: 30px;
  width: 17%;
  border-radius: 3px;
  margin: 0.3rem auto;
  border:  1px solid #EBEDFB;
`

const Fill = styled.div`
  background-color: ${(props) => `${props.color}`};
  width: 100%;
  border-radius: inherit;
  transition: height 0.2s ease-in;
  height: ${(props) => `${props.percentage}%`};
`

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  background: #FFFFFF;
  border: 1px solid #AEADB1;
  box-sizing: border-box;
  border-radius: 50%;
  position:relative;
  display:flex;
  justify-content: center;
  align-items: center;
`;

const HorizontalProgressBar = ({ percentage, color }) => {

    return (
        <div>
            <Bar>
                <Fill percentage={percentage} color={color} />
            </Bar>
        </div>
    );
}


const StagesTrack = ({stages,totalProgress,completedKyc,stageOnePercent,stageThreePercent, stageTwoPercent})=>{
    const { t } = useTranslation();
    return (
            completedKyc ?
                <div className="p-0 mr-1">
                    <Flipper flipKey={true}>
                    <IconWrapper className="text-center">
                        <img
                            src={Done}
                            alt={t('Business Information')}
                        />
                    </IconWrapper>
                    </Flipper>
                    <HorizontalProgressBar percentage={stageOnePercent} color={"#5CBD7C"}/>
                    <Flipper flipKey={true}>
                    <IconWrapper className="text-center">
                        <img
                            src={Done}
                            alt={t('Business Information')}
                        />
                    </IconWrapper>
                    </Flipper>
                    <HorizontalProgressBar percentage={stageOnePercent} color={"#5CBD7C"}/>
                    <Flipper flipKey={true}>
                    <IconWrapper className="text-center">
                        <img
                            src={Done}
                            alt={t('Business Information')}
                            title={t('Business Information')}
                        />
                    </IconWrapper>
                    </Flipper>

                </div>
                :
        <div className="p-0 mr-1">
            <Flipper flipKey={stageOnePercent >= 50}>
                {
                    stageOnePercent >= 50 ? (
                        <IconWrapper className="text-center">
                            <img
                                src={Done}
                                alt={t('Business Information')}
                                title={t('Business Information')}
                            />
                        </IconWrapper>
                    ) : (
                        <IconWrapper className="text-center">
                            <img
                                src={Office}
                                alt={t('Business Information')}
                                title={t('Business Information')}
                            />
                        </IconWrapper>
                    )
                }
            </Flipper>
            <HorizontalProgressBar percentage={stageOnePercent} color={stageOnePercent >= 50 ? "#5CBD7C" : "#3B44F0"}/>

            <Flipper flipKey={stageTwoPercent >= 50}>
                {
                    stageTwoPercent >= 50 ? (
                        <IconWrapper className="text-center">
                            <img
                                src={Done}
                                alt={t('Bank Details for settlement')}
                                title={t('Bank Details for settlement')}
                            />
                        </IconWrapper>
                    ) : (
                        stageTwoPercent >= 50 ? (
                            <IconWrapper className="text-center">
                                <img
                                    src={SettlementInfo}
                                    alt={t('Bank Details for settlement')}
                                    title={t('Bank Details for settlement')}
                                />
                            </IconWrapper>) : (
                            <IconWrapper className="text-center">
                                <img
                                    src={Settlement}
                                    alt={t('Bank Details for settlement')}
                                    title={t('Bank Details for settlement')}
                                />
                            </IconWrapper>
                        )
                    )
                }
            </Flipper>
            <HorizontalProgressBar percentage={stageThreePercent} color={stageThreePercent === 100 ? "#5CBD7C" : "#3B44F0"}/>

            <Flipper flipKey={stageThreePercent === 100}>
                {
                    stageThreePercent == 100 ? (
                        <IconWrapper className="text-center">
                            <img
                                src={Done}
                                alt={t('Business Legal Documents')}
                                title={t('Business Legal Documents')}
                            />
                        </IconWrapper>
                    ) : (
                        stageThreePercent >= 75 ? (
                            <IconWrapper className="text-center">
                                <img
                                    src={Uploaded}
                                    alt={t('Business Legal Documents')}
                                    title={t('Business Legal Documents')}
                                />
                            </IconWrapper>) : (
                            <IconWrapper className="text-center">
                                <img
                                    src={Upload}
                                    title={t('Business Legal Documents')}
                                    alt={t('Business Legal Documents')}
                                />
                            </IconWrapper>
                        )
                    )
                }
            </Flipper>
        </div>
    )
}

export default StagesTrack
