/**
 * QuiteSetup
 *
 * @format
 */

import React from "react";
import styled from "styled-components";
import { Button, Spinner } from "react-bootstrap";
import { isEmpty } from "lodash";
import "rc-steps/assets/index.css";
import "./css/quick-setup.scss";
import { useHistory } from "react-router-dom";
import Wave from "assets/images/waving-hand.svg";
import OnBoardingProgress from "./components/onboardingProgress";
import { hostName} from "utils";
import {useTranslation} from "react-i18next";

const Title = styled.div`
  font-size: 30px;
  color: #000;
`;

const SubHeading = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000;
`;

export function Onboarding(props) {
  const {
    user_details,
    showOnboardingProgress,
    setProgressShow,
    onboarding,
    kyc,
    progressStatus,
    setProgressStatus,
    loading_onboarding_status,
    stageOnePercent,
    stageTwoPercent,
    stageTwoComplete,
    stageThreePercent,
    stageThreeComplete,
    totalProgress
  } = props;
  const { first_name = undefined } = user_details;
  const history = useHistory();
  const { t } = useTranslation();


  return (
    <div className="onboarding__container">

      <div className="mb-5 sbt-quick-setup">
        <div className="mb-2">
          <Title>
            {t('Hello')}{" "}
            <span className="mr-2" style={{ color: "#253B80" }}>
              {first_name}
            </span>
            <img src={Wave} />{" "}
          </Title>
        </div>
        <SubHeading>
          {t(`welcomeMsgOnboard`, { n1: hostName() })}
        </SubHeading>
      </div>
      <div>
          <OnBoardingProgress
              progressStatus={progressStatus}
              stageOnePercent={stageOnePercent}
              stageTwoPercent={stageTwoPercent}
              stageThreePercent={stageThreePercent}
              stageTwoComplete={stageTwoComplete}
              stageThreeComplete={stageThreeComplete}
              setProgressStatus={setProgressStatus}
          />
        {
          totalProgress < 100 &&
          <div className="my-4">
            <Button
                block
                className="brand-btn h-50px w-200px"
                onClick={() =>
                    progressStatus === 4
                        ? history.push("/")
                        : setProgressShow(!showOnboardingProgress)
                }
                disabled={(isEmpty(onboarding) || isEmpty(kyc) || loading_onboarding_status)}
            >
              {(isEmpty(onboarding) || isEmpty(kyc) || loading_onboarding_status) ? (
                      <Spinner animation="border" variant="light" size/>
                  ) :
                  progressStatus === 0 ? t("Application to go Live") : t("Continue Application")
              }
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

export default Onboarding;
