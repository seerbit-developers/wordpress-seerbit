import React from "react";
import Button from "components/button";
import UserIcon from "../../../assets/images/svg/userIcon";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import LogoutIcon from "../../../assets/images/svg/logoutIcon";
import BooksIcon from "../../../assets/images/svg/booksIcon";
import SettingsIcon from "../../../assets/images/svg/settingsIcon";
import NoteIcon from "../../../assets/images/svg/noteIcon";
import SupportIcon from "../../../assets/images/svg/supportIcon";
import { withRouter } from "react-router";
import AuthService from "../../../utils/auth";
import AppToggle from "../../toggle";
import {useTranslation} from "react-i18next";

const SideMenuModal = (props) => {
  const { t } = useTranslation();
  const goto = (route) => {
    props.close();
    props.history.push(route);
  };

  React.useEffect(() => {
    if (props.isOpen) {
      document.getElementById("top_nav").style.position = "static";
      window.document.body.style.overflow = "hidden";
      // console.log(window.document.body.style)
    } else {
      document.getElementById("top_nav").style.position = "relative";
      window.document.body.style.overflow = "auto";
    }
  }, [props.isOpen]);

  const onSwitchBusiness = (biz) => {
    const BizIndex = props.businessList.findIndex((item) => item.value === biz);
    props.switchBusiness(BizIndex, biz);
  };

  const onSwitchBusinessMode = () => {
    props.toggleMode();
  };

  return (
    <React.Fragment>
      <div
        id="side-modal-overlay"
        className={`${
          props.isOpen ? "side-modal-overlay" : "side-modal-overlay--hidden"
        }`}
        onClick={() => props.close()}
      />
      <div
        style={{ background: "#ECECEC" }}
        className={`side-account-window ${
          props.isOpen
            ? "side-account-window-visible"
            : "side-account-window-hidden"
        }`}
      >
        <div style={{ background: "#ECECEC" }}>
          <div className="user_business__section ml-4">
            <div className="user_business__section--business_logo text-center">
              {props.logo && (
                <img
                  src={props.logo}
                  style={{
                    width: "90px",
                    height: "90px",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>
            <div className="user_business__section--business_user_details">
              <h3>{props.business_name}</h3>
              <h4>{props.name}</h4>
              <h4>{t('Business ID')} : {props.business_number}</h4>
            </div>
          </div>

          {props && props.business_number && (
            <div className="d-flex justify-content-between mt-5">
              <Button
                type="white"
                size="sm"
                full
                className="mr-2"
                style={{ width: "90%" }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ lineHeight: "normal" }}
                >
                  <label className="m-0">{t('Test Mode')}</label>
                  <AppToggle
                    active={props.mode}
                    onChange={onSwitchBusinessMode}
                    activeClass={"config-active"}
                  />
                  <label className="m-0">{t('Live Mode')}</label>
                </div>
              </Button>
              <Button
                type="white"
                size="sm"
                full
                className="ml-2"
                styles={{ width: "70%" }}
                onClick={() => goto("/account")}
              >
                <UserIcon /> {t('My Account')}
              </Button>
            </div>
          )}

          {props && props.business_number && (
            <div className="card-basic mt-4 bg-white">
              <h5 className="title">{t('Business Switch')}</h5>
              <DropdownSelect
                containerClass="form__control--full"
                data={props.businessList ? props.businessList : []}
                defaultValue=""
                id="business_list"
                value={props.business ? props.business.value : null}
                as={"div"}
                onChange={({ value }) => {
                  onSwitchBusiness(value);
                }}
              />
            </div>
          )}

          {props && props.business_number && (
            <div className="mt-4">
              <Button
                type="white"
                size="lg"
                textColor="#000000"
                full={true}
                className="title py-2"
                onClick={() => props.setAdd(true)}
              >
                {t('Add Business')}
              </Button>
              {/* <bu */}
            </div>
          )}

          <div className="card-basic mt-2 bg-white">
            <h5 className="title">{t('Quick Links')}</h5>
            <div className="quick-links-container mt-3">
              <div className="row mb-5">
                {/*<div className="col-6">
                  <p className=" d-flex align-items-center cursor-pointer" >
                    <SendIcon /> <span className="pl-2">Take a Tour</span>
                  </p>
                </div>*/}
                <div className="col-6">
                  <p
                    className=" d-flex align-items-center cursor-pointer"
                    onClick={() => {
                      window.location = "#/quick-setup";
                      props.close();
                    }}
                  >
                    <BooksIcon /> <span className="pl-2">{t('Get Started')}</span>
                  </p>
                </div>
                <div className="col-6">
                  <p
                    className=" d-flex align-items-center cursor-pointer"
                    onClick={() => window.open("https://doc.seerbit.com/")}
                  >
                    <SettingsIcon /> <span className="pl-2">{t('Documentation')}</span>
                  </p>
                </div>
              </div>
              <div className="row mt-4 mb-5">
                <div className="col-6">
                  <p
                    className=" d-flex align-items-center cursor-pointer"
                    onClick={() => window.open("https://support.seerbit.com/")}
                  >
                    <SupportIcon /> <span className="pl-2">{t('Support')}</span>
                  </p>
                </div>
                <div className="col-6">
                  <p
                    className=" d-flex align-items-center cursor-pointer"
                    onClick={() =>
                      window.open("https://releasenotes.seerbitapi.com/")
                    }
                  >
                    <NoteIcon /> <span className="pl-2">{t('Release Notes')}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right mt-2 pb-5">
            <Button
              type="white"
              size="sm"
              textColor="#FF2300"
              full={true}
              onClick={() => {
                AuthService.logout();
                window.location.href = "/";
              }}
            >
              <LogoutIcon /> <span>{t('Sign Out')}</span>
            </Button>
          </div>
          <div>
            <React.Fragment>{props.children}</React.Fragment>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(SideMenuModal);
