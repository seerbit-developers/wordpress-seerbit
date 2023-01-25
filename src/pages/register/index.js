/**
 * Register
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { newUser, getCountries } from "../../actions/postActions";
import { popover } from "../../modules/password_guide";
import { OverlayTrigger } from "react-bootstrap";
import ReactCountryFlag from "react-country-flag"
import "./css/index.scss";
import { isEmpty } from "lodash";
import Select from 'react-select';
import Loader from 'components/loader'
import {alertError, alertExceptionError} from "../../modules/alert";
import {registerNewMerchant} from "../../services/authService";
import {fetchCountries} from "../../actions/generalActions";
import {useTranslation} from "react-i18next";
import {hostChecker} from "utils";
import Button from "components/button";



const customStyles = {
  control: styles => ({
    ...styles,
    background: "#FFFFFF",
    border: "1px solid transparent",
    boxSizing: "border-box",
    borderRadius: 3,

    height: 53,
    ":hover": {
      border: "1px solid #389fee",
    },
    ":active": {
      border: "1px solid transparent",
    },
    ":focus": {
      border: "1px solid transparent",
    },
  }),
}

export function Register(props) {
  const { history } = props;
  const [countryCode, setCountryCode] = useState();
  const [value, setValue] = useState(null);
  const [inProcess, setInProcess] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setCountry] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation();

  // if (value?.business_name !== "" && value?.first_name && value?.last_name && value.email && value?.password && value.phone_number) setFormIncomplete(false);

  const screenSizeWatcher = () => {
    if (window.screen.width >= 768) {
      setIsMobile(false);
    } else {
      setIsMobile(true)
    }
  }
  useEffect(() => {
    injectHubSpot();
    props.fetchCountries()
    window.onresize = screenSizeWatcher;
    screenSizeWatcher();
  }, []);

  useEffect(() => {
    if (props.countries) {
      createCountryData(props.countries.payload);
    }
  }, [props.countries]);

  const createCountryData = (data) => {
    if (!isEmpty(data)) {
      let categorizedData = [];
      categorizedData = data.map((list, id) => {
        return {
          ...list,
          id,
          value: list.countryCode,
          label: <div> <ReactCountryFlag
          countryCode={list.countryCode}
          style={{
            lineHeight: '1.6em',
            fontSize: '1.6em',
            marginRight: '6px',
          }}
          svg
          cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
          cdnSuffix="svg"
          title="US"
          />{list.name.charAt(0).toUpperCase() + list.name.slice(1).toLowerCase()}</div>
        };
      });
      setCountryData(categorizedData);
      fetch('http://ip-api.com/json')
      .then(res => res.json())
      .then(response => {
        const defaultCountry = categorizedData.filter(country => country.countryCode === response.countryCode)
        setCountryCode(response.countryCode)
        setCountry(defaultCountry)
      })
      .catch((data, status) => { })
      // getCurrentLocation()
      //   .then(data => {
        //     setCountryCode(JSON.stringify(data.countryCode))
        //     const defaultCountry = categorizedData.filter(country => country.countryCode === data.countryCode);
        //     setCountry(defaultCountry)
        //     setInProcess(false)
        //   })
        //   .catch(error => console.error(error))
      }
    };

    function injectHubSpot() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = "//js.hs-scripts.com/7777416.js";
        s.setAttribute("defer", "defer");
        s.setAttribute("async", "async");
        document.getElementsByTagName('head')[0].appendChild(s);
    }

    const handleValue = (e) => {
      if(e.target.name === 'phone_number' && !(/(^$|^\d*$)/.test(e.target.value))) {
        e.target.value = e.target.value.slice(0, -1);
        alertError('Please enter a valid phone number');
      }
      setValue({ ...value, [e.target.name]: e.target.value });
    };

    const handleCountryCode = (selectedOption) => {
      const { countryCode } = selectedOption;
      const selectedCountry = countryData.filter(country => country.countryCode === countryCode);
      setCountry(selectedCountry)
      setCountryCode(countryCode);
    };

    const initAuthorization =  (e) => {
      e.preventDefault();
      registerNewMerchant({
        ...value,
        password_confirmation: value.password,
        is_developer: false,
        countryCode,
        // businessType:businessType.value,
      })
      .then((res) => {
        setInProcess(false);
        if (res.responseCode === "00") {
          window.location.href = window.origin + "/#/auth/confirm-email/"+value.email
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again");
          }
        })
        .catch((e) => {
          setInProcess(false);
          alertExceptionError(e)
        });
  };
  const togglePasswordVisibility = ()=>{
    setPasswordVisible(!passwordVisible)
  }


  return (
      <div className="p-0 d-flex justify-content-between sbt-register align-items-center" style={{height:'100vh'}}>
          <div className="auth--container">
            <div className='text-center'>
            <img
                src={hostChecker() === 'seerbit' ? 'https://assets.seerbitapi.com/images/seerbit_logo_type.png' : `https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                className="auth-logo mb-5"
            />
            </div>
            <div className="auth--section">
              <div className="auth--section__content">
                <div className="py-3 mb-1 text-center">
                  <div className="sub-heading">{t("Create an account on SeerBit in Minutes")}</div>
                </div>
                <form
                    className="w-100"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setInProcess(true);
                      initAuthorization(e);
                    }}
                >
                  <input autoComplete="on" style={{ display: 'none' }}
                         id="fake-hidden-input-to-stop-google-address-lookup" />
                  <div>
                    <label>{t("Business Country")}</label>
                    <div className="form-country-outline mb-3">
                      <Select
                          className="basic-single"
                          name="country"
                          disabled={props.loading_countries}
                          value={selectedCountry}
                          options={countryData}
                          styles={customStyles}
                          onChange={handleCountryCode}
                          isSearchable={false}
                          isLoading={!isEmpty(countryData) ? false : true}
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label>{t("Business Name")}</label>
                      <input
                          name="business_name"
                          type="text"
                          autoComplete="off"
                          disabled={inProcess}
                          className={value && value.business_name ? `form-control has-business` : `form-control seerbit-business`}
                          onChange={(e) => handleValue(e)}
                          value={value && value.business_name}
                          required
                      />
                    </div>
                    <div className="d-flex flex-column flex-md-row justify-content-between">
                      <div className="w-100 mr-sm-2">
                        <label>{t("First Name")}</label>
                        <div className="form-outline mb-3">
                          <input
                              name="first_name"
                              type="text"
                              disabled={inProcess}
                              autoComplete="off"
                              className={value && value.first_name ? `form-control has-first` : `form-control seerbit-first`}
                              onChange={(e) => handleValue(e)}
                              value={value && value.first_name}
                              required
                          />
                        </div>
                      </div>
                      <div className="w-100 ml-sm-2">
                        <label>{t("Last Name")}</label>
                        <div className="form-outline mb-3">
                          <input
                              name="last_name"
                              type="text"
                              disabled={inProcess}
                              autoComplete="off"
                              className={value && value.last_name ? `form-control has-last` : `form-control seerbit-last`}
                              onChange={(e) => handleValue(e)}
                              value={value && value.last_name}
                              required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-outline mb-3">
                      <label>{t("Email")}</label>
                      <input
                          name="email"
                          type="email"
                          disabled={inProcess}
                          autoComplete="off"
                          className={value && value.email ? `form-control has-email` : `form-control seerbit-email`}
                          onChange={(e) => handleValue(e)}
                          value={value && value.email}
                          required
                      />
                    </div>
                    <div className="form-outline mb-3">
                      <label>{t("Phone Number")}</label>
                      <input
                          name="phone_number"
                          type="tel"
                          disabled={inProcess}
                          autoComplete="off"
                          className={value && value.phone_number ? `form-control has-phone` : `form-control seerbit-phone`}
                          onChange={(e) => handleValue(e)}
                          value={value && value.phone_number}
                          maxLength={15}
                          required
                      />

                    </div>
                    <OverlayTrigger
                        trigger="focus"
                        placement={isMobile ? 'bottom' : 'right'}
                        overlay={popover(value && value.password)}
                    >
                      <div className="form-outline mb-3 position-relative">
                        <label>{t("Password")}</label>
                        <input
                            autoComplete="new-password"
                            name="password"
                            type={passwordVisible ? 'text' : 'password'}
                            className={value && value.password ? `form-control has-password` : `form-control seerbit-login-password`}
                            onChange={(e) => handleValue(e)}
                            required
                            disabled={inProcess}
                        />
                        <span className="toggle-password-visibility" onClick={()=>togglePasswordVisibility()}
                              style={{position:'absolute', top:42, right:10, cursor:'pointer'}}
                        >
    {passwordVisible ? <i className="fa fa-eye" aria-hidden="true"/> :
        <i className="fa fa-eye-slash" aria-hidden="true"/>
    }</span>
                      </div>
                    </OverlayTrigger>
                  </div>
                  <Button
                      full
                      type="submit"
                      disabled={inProcess}
                      size='lg'
                  >
                    {inProcess && <Loader type={'login'}/>}
                    {!inProcess && "Get Started"}

                  </Button>
                  <div className="container pl-1">
                    <div className="row">
                      <div className="mt-3 col-12">
                        <div className="mb-3 font-13">
        <span style={{ color: "#000" }}>
   {t("By clicking 'Get started', I agree to SeerBit's")}
    <a
        href='https://seerbit.com/acceptable-use-policy/'
        target='_blank'
        className='seerbit-color'
    > {t("Terms of Acceptable Use")}</a> <a
            href="https://seerbit.com/privacy/"
            target="_blank"
            className="seerbit-color"
        >{t("Privacy Policy")}
    </a> {t("and")} <a
            href='https://seerbit.com/merchant-agreement/'
            target='_blank'
            className='seerbit-color'>{t("Merchant Service Agreement")}.</a>

                      </span>
                        </div>
                        <span style={{ color: "#000" }}>
                      {t("Already have an account?")}{" "}
                          <span
                              className="link cursor-pointer brand-color"
                              onClick={(e) =>
                                  history.push({
                                    pathname: "login",
                                  })
                              }
                          >
                        {t("Login")}
                      </span>
                    </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
        </div>
      </div>
    </div>
  );
}

Register.propTypes = {
  newUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  signup: state.data.signup,
  error_details: state.data.error_details,
  location: state.data.location,
  loading_countries: state.data.loading_countries,
  countries: state.data.countries,
  white_label: state.data.white_label,
});

export default connect(mapStateToProps, { newUser, getCountries,fetchCountries })(Register);
