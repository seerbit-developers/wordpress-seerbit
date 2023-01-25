/**
 * QuiteSetup
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {getProgressStatus, getBankList, getKYC, getIndustries, setBusiness} from "../../actions/postActions";
import "rc-steps/assets/index.css";
import "./css/quick-setup.scss";
import Onboarding from "./Onboarding";
import BusinessDetails from "./BusinessDetails";
import OnBoardingSidebar from "./components/onBoardingSidebar";
import {getOnBoardingStatus} from "../../actions/authActions";
import {AppModalCenter} from "../../components/app-modal";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {fetchBusinessDetails} from "services/authService";
import {alertError, alertExceptionError} from "modules/alert";
import {
  StageOnePercent,
  StageThreeComplete,
  StageThreePercent,
  StageTwoComplete,
  StageTwoPercent
} from "utils";
import {AnimatePresence, motion} from "framer-motion";


export function QuickSetup({setBusiness,getProgressStatus, ...props}) {
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState(0);
  const [showOnboardingProgress, setProgressShow] = useState(false);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [businessFields, setBusinessFields] = useState(null);
  const [stageOnePercent, setStageOnePercent] = useState(0);
  const [stageTwoPercent, setStageTwoPercent] = useState(0);
  const [stageThreePercent, setStageThreePercent] = useState(0);
  const [totalPercent, setTotalPercent] = useState(0);
  const [stageTwoComplete, setStageTwoComplete] = useState(false);
  const [stageThreeComplete, setStageThreeComplete] = useState(false);
  const [open, setOpen] = useState(false)
  const { t } = useTranslation();
  const history = useHistory();
  // const brand_label = props.white_label || Brand.default;
  const {
    setting,
    test_public_key,
    live_public_key,
    test_private_key,
    live_private_key,
    number
  } = props.business_details;

  const { user_details, business_details, getOnBoardingStatus, onboarding,loading_onboarding_status, getBankList, getKYC, kyc, bank_list, industry_list, getIndustries } = props;

  useEffect(() => {
    getOnBoardingStatus()
    if (bank_list && bank_list.hasOwnProperty('payload') && Array.isArray(bank_list.payload) && bank_list.payload.length){
    }else{
      getBankList()
    }
    if (kyc && kyc.hasOwnProperty('payload') && Array.isArray(kyc.payload) && kyc.payload.length){
    }else{
      getKYC();
    }
    if (industry_list && industry_list.hasOwnProperty('payload') && Array.isArray(industry_list.payload) && industry_list.payload.length){
    }else{
      getIndustries();
    }
    document.querySelector('.mode-bordx') ? document.querySelector('.mode-bordx').style.display = 'none' :  null
  }, [])


  useEffect( ()=>{
    if (onboarding){
      if (onboarding.payload?.progressStatus){
        setProgressStatus(onboarding.payload?.progressStatus)
      } else {

      }

    }
  }, [onboarding]);

  useEffect( ()=>{
    if(business_details){
      const availableFields = {
        business_industry : business_details.business_industry,
        business_name : business_details.business_name,
        website_url : business_details.website_url,
        businessDescription : business_details.otherInfo?.businessDescription,
        staffSize : business_details.otherInfo?.staffSize,
        annualTransaction : business_details.otherInfo?.annualTransaction,
        acceptInternationalTrans : business_details.otherInfo?.acceptInternationalTrans,
        tradingName : business_details.otherInfo?.tradingName,

        business_email : business_details?.business_email,
        support_email : business_details?.support_email,
        chargeback_email : business_details?.chargeback_email,
        business_state : business_details?.address?.state,
        business_city : business_details?.address?.city,
        business_address : business_details?.address?.street,

        bank_name : business_details?.payout?.payout_bank_name,
        bank_code : business_details?.payout?.payout_bank_code,
        account_number : business_details?.payout?.payout_account_number,
        account_name : business_details?.payout?.payout_account_name,
        bvn_number : business_details?.payout?.payout_bvn_number,
      }
      console.log('availableFields', availableFields)
      const isNigeria =
          business_details &&
          business_details.country &&
          business_details.country.name.toUpperCase() === "NIGERIA";
      setStageOnePercent(StageOnePercent(availableFields))
      setStageTwoPercent(StageTwoPercent(availableFields, isNigeria))
      setStageThreePercent(StageThreePercent(business_details.kycDocuments))
      setTotalPercent(
          Math.ceil( (StageOnePercent(availableFields) +
          StageTwoPercent(availableFields, isNigeria) +
          StageThreePercent(business_details.kycDocuments)) / 300 * 100)
      )
      setStageThreeComplete(StageThreeComplete(availableFields,isNigeria))
      setStageTwoComplete(StageTwoComplete(availableFields,isNigeria))
      setBusinessFields(availableFields);
    }
  }, [business_details]);

  const refreshBusiness = (lastDoc) => {
    fetchBusinessDetails(number)
        .then(res => {
          if (res.responseCode === '00') {
            setBusiness(res.payload[0])
            if (lastDoc){
              setProgressShow(true)
              setOpen(true)
              getProgressStatus();
            }else{
              getProgressStatus();
            }

          } else {
            alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
          }
        }).catch(e => {
          console.error(e)
      alertExceptionError(e)
    })
  }

  console.log('stageOnePercent', stageOnePercent)
  console.log('progressStatus', progressStatus)

  return (
    <div className="col-12 sbt-quick-setup onboarding">
      <AppModalCenter
          close={() => setOpen(false)}
          isOpen={open}
      >
        <div className='d-flex align-items-center mb-2'>
          <h4 className='d-inline-block mr-2 mb-0'>{t('Congratulations')} </h4>
          <span>👍</span>
        </div>

        <div className='mb-3'>
          {t('You have successfully completed all requirements.')}
          <br/>
          {t('After a successful review, your account will be activated for Live transactions.')}
        </div>
        <Button
            block
            className="brand-btn w-200px cursor-pointer"
            onClick={() => history.push("/")}
        >
          <span className='mr-2'>👉</span> {' '} {t(' Go to your Dashboard')}
        </Button>
      </AppModalCenter>
      <div className="row" style={{height:'100vh'}}>
        <div className="col-lg-8 col-sm-12">
          <AnimatePresence>
          {!showOnboardingProgress ?
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x:-10 }}
            >
          <Onboarding
            user_details={user_details}
            setProgressShow={setProgressShow}
            onboarding={onboarding && onboarding || {}}
            loading_onboarding_status={loading_onboarding_status}
            kyc={kyc}
            stageOnePercent={stageOnePercent}
            stageTwoPercent={stageTwoPercent}
            stageThreePercent={stageThreePercent}
            stageTwoComplete={stageTwoComplete}
            stageThreeComplete={stageThreeComplete}
            setProgressStatus={(d)=>{setProgressStatus(d); setProgressShow(true); } }
            progressStatus={progressStatus}
            totalProgress={totalPercent}
          />
            </motion.div>
              :
            <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x:-10 }}
            >
            <BusinessDetails
            progress={progress}
            progressStatus={progressStatus}
            setProgress={setProgress}
            refreshBusiness={refreshBusiness}
            stageCompleted={stageCompleted}
            business_details={business_details}
            businessFields={businessFields}
            setStageCompleted={setStageCompleted}
            setProgressShow={setProgressShow}
            onboarding={onboarding && onboarding || {}}
            kyc={kyc && kyc || {}}
            totalProgress={totalPercent}
            stageOnePercent={stageOnePercent}
            stageTwoPercent={stageTwoPercent}
            stageThreePercent={stageThreePercent}
            />
            </motion.div>
          }
          </AnimatePresence>
        </div>
        <div className="col-lg-3 d-none d-lg-block  p-0 m-0 page-container" style={{ backgroundColor: "#EFF2F6" }}>
          <OnBoardingSidebar
              setting={setting}
          test_private_key={test_private_key}
          live_private_key={live_private_key}
          test_public_key={test_public_key}
          live_public_key={live_public_key}
          />
        </div>
      </div>
    </div>

  );
}

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  user_permissions: state.data.user_permissions,
  white_label: state.data.white_label,
  onboarding: state.data.onboarding,
  loading_onboarding_status: state.data.loading_onboarding_status,
  kyc: state.data.kyc,
  industry_list: state.data.industry_list,
  bank_list: state.data.bank_list,
    country_kyc: state.userManagement.country_kyc,
    loading_country_kyc: state.userManagement.loading_country_kyc
});

export default connect(mapStateToProps, {
  getProgressStatus,
  getBankList,
  getKYC,
  getIndustries,
  getOnBoardingStatus,
  setBusiness
    // getCountryKYc
})(QuickSetup);
