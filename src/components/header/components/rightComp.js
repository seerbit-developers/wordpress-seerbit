import React, {useState} from "react";
import AppToggle from "../../toggle";
import notify from "assets/images/bell.svg";
import help from "assets/images/help.svg";
import tour from "assets/images/svg/tour.svg";
import docx from "assets/images/svg/docx.svg";
import copyx from "assets/images/svg/copyx.svg";
import support from "assets/images/svg/support.svg";
import notes from "assets/images/svg/notes.svg";
import {hostChecker} from "utils";
import {useTranslation} from "react-i18next";
import DropdownSelect from "../../dropdown-select/dropdown.select";
import i18next from 'i18next'
import {getLanguage} from "../../../utils/localStorage";
const RightComp = ({ setStartTour, onSwitchBusinessMode, onSwitchUserMode, active, canSwitchMode, isPrimaryUser, userMode }) => {
    const lng = getLanguage()
    const { t } = useTranslation();
    const [languages]= useState([
        { value:'en', lng:'en', label: 'English' },
        { value:'fre', lng:'fre', label: 'French' }
    ])
    const changeLanguage = (v) => {
        i18next.changeLanguage(v.value);
        localStorage.setItem('i18nextLng', v.value);
    }


  return (
    <div className="d-flex justify-content-between align-items-center">
      <div
        className="d-flex justify-content-between align-items-center mr-2"
        style={{ lineHeight: "normal" }}
      >
        {/* USER CAN SWITCH MODE BUT IS NOT THE PRIMARY USER
        THIS TOGGLE WILL SWITCH THE USER MODE INSTEAD OF BUSINESS MODE
         */}
        {!isPrimaryUser && canSwitchMode  &&  userMode && hostChecker() !== 'pilot' && <AppToggle
          active={userMode === 'LIVE'}
          onChange={onSwitchUserMode}
          activeClass={"config-active"}
        />}
        {/* THIS WILL SWITCH THE DATA MODE OF THE BUSINESS GENERALLY */}
        {isPrimaryUser && hostChecker() !== 'pilot' && <AppToggle
          active={active}
          onChange={onSwitchBusinessMode}
          activeClass={"config-active"}
        />}
        <span
          className="m-2 mx-erx"
          style={{
            fontWeight: "500",
            marginLeft: "19px",
            marginBottom: "20px",
          }}
          title={((active || userMode === 'LIVE') && hostChecker() !== 'pilot') ? t('Your business is now Live. You can accept payments now.') : ''}
        >
          {isPrimaryUser ? active ?
              `${hostChecker() !== 'pilot' ? t("Live Mode") : t("Pilot Mode")}`:
              `${hostChecker() !== 'pilot' ? t("Test Mode") : t("Pilot Mode")}`
              : ""}
          {!isPrimaryUser ? userMode === 'LIVE' ?
              `${hostChecker() !== 'pilot' ? t("Live Mode") : t("Pilot Mode")}` :
              `${hostChecker() !== 'pilot' ? t("Test Mode") : t("Pilot Mode")}` :
              ""}
        </span>
      </div>

      <li className="mmm d-flex justify-content-center align-items-center">
        <img src={notify} className="mr-4 mxx-erx" />
        <div className="contain p-6 notfi">{t('No notification available')}</div>
      </li>

      <li className="mmm d-flex justify-content-center align-items-center">
        <img src={help} className="mr-2 mcdx-erx" />
        <div className="contain p-6">
          <div className="mt-3">
            <small>{t('Quick Links')}</small>
            <div className="mt-3">
              <div
                className="d-flex mt-3"
                style={{ cursor: "pointer" }}
                onClick={() => setStartTour(true)}
              >
                <img src={tour} className="mr-3" style={{ width: "15px" }} />
                <div className="d-flex">{t('Take a tour')}</div>
              </div>
              <div className="d-flex mt-3" style={{ cursor: "pointer" }}
                   onClick={() => window.open("https://doc.seerbit.com/")}
              >
                <img
                  src={docx}
                  className="mr-3"
                  style={{ width: "15px" }}
                  onClick={() => window.open("https://doc.seerbit.com/")}
                 alt={t('Documentation')}/>
                {t('Documentation')}
              </div>
              <div
                className="d-flex mt-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.location = "#/quick-setup";
                }}
              >
                <img src={copyx} className="mr-3" style={{ width: "15px" }} />
                <div className="d-flex">{t('Get Started')}</div>
              </div>
              <div
                className="d-flex mt-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open("https://releasenotes.seerbitapi.com/")
                }
              >
                <img src={notes} className="mr-3" style={{ width: "15px" }} />
                <div className="d-flex">{t('Release Notes')}</div>
              </div>
              <div
                className="d-flex my-3"
                style={{ cursor: "pointer" }}
                onClick={() => window.open("https://support.seerbit.com/")}
              >
                <img src={support} className="mr-3" style={{ width: "15px" }} />
                <div className="d-flex">{t('Support')}</div>
              </div>
            </div>
          </div>
        </div>
      </li>
        <li className="d-flex justify-content-center align-items-center">
           <div>
               <DropdownSelect
                   data={languages}
                   defaultValue={lng}
                   id="lang_list"
                   value={lng}
                   buttonClass={'border-0'}
                   as={"div"}
                   bold={true}
                   onChange={changeLanguage}
               />
           </div>
        </li>
    </div>
  );
};

export default RightComp;
