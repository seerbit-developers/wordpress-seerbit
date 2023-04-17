import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  updateBusiness,
  switchMode,
  switchUserMode,
  saveKey,
  setBusiness,
  getCountries,
  getIndustries,
  addBusiness,
  getWalletTransaction,
  walletTopUp,
  clearState,
  dispatchUpdateSingleBusiness,
  dispatchUpdateProfile,
} from "actions/postActions";
import AuthService from "utils/auth";
import LogoutIcon from "assets/images/svg/logoutIcon";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import SideMenuModal from "./components/sideMenuModal";
import { NavigationMenu } from "./components/navigationMenu";
import { NavigationMenuMobile } from "./components/navigationMenuMobile";
import {
  alertError,
  alertExceptionError,
  alertSuccess,
  alertInfo,
} from "modules/alert";
import { useHistory } from "react-router";
import { appBusy } from "actions/appActions";
import { setUserRole } from "actions/userManagementActions";
import { fetchBusinessDetails } from "services/authService";
import {
  switchUserDataMode,
  switchBusinessDataMode,
} from "services/userManagementService";
import RightComp from "./components/rightComp";
import { resetBusiness } from "actions/generalActions";
import NewBusinessRequestModal from "./components/newBusiness";
import { hostChecker } from "utils";
import { useTranslation } from "react-i18next";

export function Header(props) {
  const [processBusiness, setProcessBusiness] = useState(false);
  const [isSideMenuModalOpen, setIsSideMenuModalOpen] = useState(false);
  const [businessListBasic, setBusinessList] = useState([]);
  const [businessDataBasic, setBusinessDataBasic] = useState(null);
  const [active, setActive] = useState(
    props.primary_user && props.user_details.id !== props.primary_user.number
      ? props.user_details.mode === "LIVE"
      : props.business_details.setting &&
          props.business_details.setting.mode === "LIVE"
  );
  const [isTourOpen, setTour] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [startTour, setStartTour] = useState(false);
  const [canSwitchMode, setCanSwitchMode] = useState(false);
  const [isPrimaryUser, setIsPrimaryUser] = React.useState(false);
  const [userMode, setUserMode] = React.useState(null);
  const history = useHistory();
  const { t } = useTranslation();
  const initialState = {
    business_analytics: null,
    sample_transactions: [],
    transactions: [],
    pocket_customers: [],
    wallet_payouts: null,
    wallets: null,
    customers: null,
    payouts: null,
    refunds: null,
    branches: null,
    settlement_transactions: null,
    branch_settlements: null,
    disputes: null,
    business_users: null,
    business_advert: null,
    vendor_transactions: null,
    vendor_settlements: null,
    get_vendors: null,
    search_vendor: null,
    vendor_transaction_overview: null,
    get_payment_links: null,
  };

  useEffect(() => {
    if (props.business_key && props.location === "business_key") {
      props.clearState({ ...initialState });
    } else if (
      props.location === "switch_user" ||
      props.location === "switchMode"
    ) {
      props.clearState({ ...initialState });
    }

    if (props.new_business && props.location === "new_business") {
      alertSuccess(
        props.new_business.message
          ? props.new_business.message
          : "Your new business request has been sent successfully."
      );
      setProcessBusiness(false);
      setShowAdd(false);
    }

    if (
      (!props.error_details && props.location === "switch_user") ||
      props.location === "switchMode"
    ) {
      window.location.reload(false);
    }
    if (
      props.error_details &&
      props.error_details.error_source === "new_business"
    ) {
      alertError(props.error_details.message || "action not completed");
      setProcessBusiness(false);
    }
    if (
      props.error_details &&
      (props.error_details.error_source === "switch_user" ||
        props.error_details.error_source === "switchMode")
    ) {
      setActive(
        props.primary_user &&
          props.user_details.id !== props.primary_user.number
          ? props.user_details.mode === "LIVE"
          : props.business_details.setting &&
              props.business_details.setting.mode === "LIVE"
      );
      alertError(props.error_details.data
          ? props.error_details.data.message
          : props.error_details.message || props.error_details.responseMessage);
    }
  }, [
    props.user_details,
    props.location,
    props.error_details,
    props.new_business,
    props.business_details,
  ]);

  useEffect(() => {
    if (props.user_details) {
      if (props.user_details.hasOwnProperty("canSwitchMode")) {
        setCanSwitchMode(props.user_details.canSwitchMode);
      }
      if (props.user_details.hasOwnProperty("mode")) {
        setUserMode(props.user_details.mode);
      }
      if (props.user_details.hasOwnProperty("businessList")) {
        const list = props.user_details.businessList.map((item) => {
          return {
            label: item.business.business_name,
            value: item.business.number,
          };
        });
        setBusinessList(list);
      }
    }
  }, [props.user_details]);

  useEffect(() => {
    if (props.business_details) {
      const b = {
        label: props.business_details.business_name,
        value: props.business_details.number,
      };
      setBusinessDataBasic(b);
    }
  }, [props.business_details]);

  useEffect(() => {
    if (props.business_details && props.user_details) {
      if (props.business_details.primaryUser) {
        setIsPrimaryUser(
          props.business_details.primaryUser.email === props.user_details.email
        );
      }
    }
  }, [props.user_details, props.business_details]);

  useEffect(() => {
    // !props.industry_list && props.getIndustries();
    // !props.countries && props.getCountries();
    props.appBusy();
    window.addEventListener(
      "load",
      setTour(
        !localStorage.getItem("noTour") &&
          window.innerWidth >= 992 &&
          props.business_details &&
          props.business_details.setting
      )
    );
    return () => window.removeEventListener("load", () => "test");
  }, []);

  useEffect(() => {
    if (props.error_details && props.location === "pocket_customers") {
      alertError(props.error_details.message || props.error_details.responseMessage);
    }
  }, [props.error_details]);

  const closeSideMenu = () => {
    setIsSideMenuModalOpen(false);
    // document.getElementById('top_nav').style.position = 'relative'
  };

  const openSideMenu = () => {
    setIsSideMenuModalOpen(true);
    // document.getElementById('top_nav').style.position = 'static'
  };

  const switchDefaultBusiness = (id) => {
    props.appBusy(true, t("Switching Business"));
    fetchBusinessDetails(id)
      .then((res) => {
        props.appBusy();
        if (res.responseCode === "00") {
          props.setBusiness(res.payload[0]);
          props.setUserRole(res.payload[0].role);
          alertSuccess("Successful");
          props.resetBusiness();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again");
        }
      })
      .catch((e) => {
        alertExceptionError(e);
        props.appBusy();
      });
  };

  const onSwitchUserDataMode = () => {
    props.appBusy(true, t("Switching Data Mode"));
    switchUserDataMode(props.user_details.id, null)
      .then((res) => {
        props.appBusy();
        if (res.responseCode == "00") {
          const ud = JSON.parse(JSON.stringify(props.user_details));
          ud.mode = userMode ? (userMode === "LIVE" ? "LIVE" : "TEST") : "TEST";
          props.dispatchUpdateProfile(ud);
          alertSuccess("Success");
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred making request. Kindly try again");
        }
      })
      .catch((e) => {
        props.appBusy();
        alertExceptionError(e);
      });
  };

  const onSwitchBusinessDataMode = () => {
    props.appBusy(
      true,
      `${t("We are switching your business DATA MODE to")} ${
        !active ? "LIVE" : "TEST"
      }`
    );
    switchBusinessDataMode()
      .then((res) => {
        props.appBusy();
        if (res.responseCode == "00") {
          props.dispatchUpdateSingleBusiness(res.payload);
          // alertSuccess('Success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          alertError(res.message
              ? t(res.message)
              : t("An Error Occurred making request. Kindly try again"));
        }
      })
      .catch((e) => {
        props.appBusy();
        alertExceptionError(e);
      });
  };

  const goto = (route) => {
    history.push(route);
  };
  return (
    <>
      <nav className="navigation-menu" id="top_nav">
        <SideMenuModal
          isOpen={isSideMenuModalOpen}
          mode={active}
          close={() => closeSideMenu()}
          businessList={businessListBasic}
          business={businessDataBasic}
          business_details={props && props.business_details}
          switchBusiness={(businessIndex, businessNumber) => {
            switchDefaultBusiness(businessNumber);
            // props.setBusiness(businessIndex);
            // props.saveKey(businessNumber);
          }}
          toggleMode={() => {
            // console.log(props.business_details.status)
            if (props.business_details.status === "APPROVED") {
              setActive(!active);
              props.switchMode({
                location: "switchMode",
                type: "switch-mode",
              });
              alertInfo(
                `We are switching your business DATA MODE to ${
                  !active ? "LIVE" : "TEST"
                }`
              );
            }
            if (props.business_details.status !== "APPROVED") {
              alertInfo(
                "You may not be able to perform this action until your business is approved"
              );
            }
          }}
          name={props.user_details ? props.user_details.full_name : "..."}
          business_name={
            props.business_details
              ? props.business_details.business_name
              : "..."
          }
          business_number={
            props.business_details ? props.business_details.number : "..."
          }
          logo={props.business_details.logo}
          setAdd={setShowAdd}
        />
        <div className="navigation-menu__inner">
          <div className="navigation-menu__inner--left-side">
            <div className="logo">
              <img
                src={hostChecker() === 'seerbit' ? 'https://assets.seerbitapi.com/images/seerbit_logo_type.png' : `https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                alt="seerbit_logo cursor-pointer"
                width="100"
                onClick={() => history.push("/")}
              />
            </div>
            <div className="menu-items-container">
              {props.business_details.setting && (
                <ul>
                  <NavigationMenu
                    business_details={props.business_details}
                    startTour={startTour}
                    setStartTour={setStartTour}
                  />
                </ul>
              )}
            </div>
          </div>
          {props?.business_details?.business_name && (
            <RightComp
              active={active}
              onSwitchBusinessMode={onSwitchBusinessDataMode}
              onSwitchUserMode={onSwitchUserDataMode}
              setStartTour={setStartTour}
              canSwitchMode={canSwitchMode}
              isPrimaryUser={isPrimaryUser}
              userMode={userMode}
            />
          )}
          <div className="navigation-menu__inner--right-side mmm">
            <div className="px-3 d-flex align-items-center justify-content-between">
              <div
                className="cursor-pointer d-flex flex-row justify-content-end w-100"
              >
                <div className="menu-divide-bar">{""}</div>
                <div className="user_name_business ps-4" id="business">
                  <h4
                    className=""
                    title={
                      props.business_details
                        ? props.business_details.business_name
                          ? props.business_details.business_name.substr(0, 20)
                          : "..."
                        : "..."
                    }
                  >
                    {props.business_details
                      ? props.business_details.business_name
                        ? props.business_details.business_name.substr(0, 20)
                        : "..."
                      : "..."}
                  </h4>
                  <h5 className="cursor-pointer" title={t("User Name")}>
                    {props.user_details
                      ? props.user_details.full_name
                        ? props.user_details.full_name.substr(0, 20)
                        : "..."
                      : "..."}
                  </h5>
                </div>
              </div>
            </div>

            {/* < className="mmm"> */}
            <>
              {/* // <img src={help} className="me-" /> */}
              <div className="contain-nav p-6 m-auto">
                <div className="d-flex mx-xs mt-3 ">
                  <div>
                    <span className="text-capitalize font-12">
                      {t("Business ID")} :{" "}
                      {props.business_details
                        ? props.business_details.number
                        : "..."}
                    </span>
                    <br />
                    <span className="text-capitalize font-10">
                      {props.role?.name?.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      AuthService.logout();
                      window.location.href = localizer.path_url;
                    }}
                  >
                    <LogoutIcon />{" "}
                    <span style={{ color: "#FF2300" }}>{t("Sign Out")}</span>
                  </div>
                </div>
                {props?.business_details?.business_name && (
                  <div className="w-100 m-auto mb-3">
                    <div
                      className=" d-flex  justify-content-center flex-column  m-auto"
                      // style={{ width: "250px" }}
                    >
                      {Array.isArray(businessListBasic) &&
                        businessListBasic.length > 1 && (
                          <div className="mt-3">
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginBottom: "5px",
                              }}
                            >
                              {t("Business Switch")}
                            </div>
                            <DropdownSelect
                              containerClass="form__control--full"
                              data={businessListBasic || []}
                              defaultValue=""
                              id="business_list"
                              value={businessDataBasic?.value || null}
                              as={"div"}
                              bold={true}
                              onChange={({ value }) => {
                                switchDefaultBusiness(value);
                              }}
                            />
                          </div>
                        )}
                      <div
                        className="mt-2 mdxx cursor-pointer"
                        onClick={() => goto("/account")}
                      >
                        {t("Account Settings")}
                      </div>
                      <div
                        className="mt-2 mb-3 mdxx cursor-pointer"
                        onClick={() => setShowAdd(true)}
                      >
                        {t("Add a new business")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
      </nav>
      <NavigationMenuMobile
        businessList={businessListBasic}
        business={businessDataBasic}
        switchBusiness={(businessIndex, businessNumber) => {
          props.setBusiness(businessIndex);
          props.saveKey(businessNumber);
        }}
        business_name={
          props.business_details ? props.business_details.business_name : "..."
        }
        business_number={
          props.business_details ? props.business_details.number : "..."
        }
        mode={active}
        toggleMode={() => {
          if (props.business_details.status === "APPROVED") {
            setActive(!active);
            props.switchMode({
              location: "switchMode",
              type: "switch-mode",
            });
            alertInfo(
              `We are switching your business DATA MODE to ${
                !active ? "LIVE" : "TEST"
              }`
            );
          }
          if (props.business_details.status !== "APPROVED") {
            alertInfo(
              "You may not be able to perform this action until your business is approved"
            );
          }
        }}
      />

      <NewBusinessRequestModal
        show={showAdd}
        close={() => setShowAdd(false)}
        business_details={props.business_details}
        countries={props.countries && props.countries.payload}
        industry_list={props.industry_list && props.industry_list.payload}
        addBusiness={props.addBusiness}
        processBusiness={processBusiness}
        setProcessBusiness={setProcessBusiness}
      />

      {props?.business_details?.business_name && !active && (
        <div className="mode-bordx">
          <div className="text-dax">{t("Test Data")}</div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  primary_user: state.data.business_details.primaryUser,
  location: state.data.location,
  business_key: state.data.business_key,
  business: state.data.business,
  user_permissions: state.data.user_permissions,
  industry_list: state.data.industry_list,
  countries: state.data.countries,
  white_label: state.data.white_label,
  error_details: state.data.error_details,
  wallet: state.data.wallet,
  wallets: state.data.wallets,
  new_business: state.data.new_business,
  role: state.data.role,
  language: state.data.language,
});

export default connect(mapStateToProps, {
  switchUserMode,
  saveKey,
  updateBusiness,
  switchMode,
  setBusiness,
  getCountries,
  getIndustries,
  addBusiness,
  getWalletTransaction,
  walletTopUp,
  clearState,
  appBusy,
  setUserRole,
  dispatchUpdateSingleBusiness,
  dispatchUpdateProfile,
  resetBusiness,
})(Header);
