/**
 * BusinessInformation
 *
 * @format
 */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setErrorLog } from "actions/postActions";
import { Can } from "modules/Can";
import clickOutside from "utils/onClickOutside";
import { Spinner } from "react-bootstrap";
import Button from "components/button";
import styled from "styled-components";
import SetupModal from "assets/images/svg/customization";
import Pencil from "assets/images/svg/pencil";
import { SketchPicker } from "react-color";
import { playCheckout } from "utils/js/checkout";
import {updateBusinessSettings} from "../../../services/businessService";
import {alertSuccess, alertInfo, alertError, alertExceptionError} from "modules/alert";
import {getBusiness} from "../../../actions/postActions";
import {useTranslation} from "react-i18next";

const NavMenuItem = styled.div`
  font-size: 1.1em;
  color: #676767 !important;
`;

export const Customization = (props, p, u, o) => {
  return <Template business_details={props.business_details} getBusiness={props.getBusiness}/>;
};

const Template = ({ business_details,getBusiness }) => {
  const [process, setProcess] = React.useState(false);
  const ref = useRef();
  const [logo, setLogo] = useState(business_details.logo);
  const [show, setShow] = useState("");
  const { t } = useTranslation();
  let uplaodElement = null;

  const {
    checkoutPageConfig,
    country,
    default_currency,
    primaryUser,
    phone_number,
    setting,
    test_public_key,
    live_public_key,
  } = business_details;

  const [button_color, setButtonColor] = useState(
    (checkoutPageConfig &&
      checkoutPageConfig != null &&
      checkoutPageConfig.paybuttonColor) ||
      ""
  );
  const [border_color, setBorderColor] = useState(
    (checkoutPageConfig &&
      checkoutPageConfig != null &&
      checkoutPageConfig.paychannelColor) ||
      ""
  );
  const [background_color, setBackgroundColor] = useState(
    (checkoutPageConfig &&
      checkoutPageConfig != null &&
      checkoutPageConfig.backgroundColor) ||
      "#ffffff"
  );

  const close = (close) => {

  };
  const callback = (response) => {

  };

  //UPLOAD LOGO
  const [upload_logo, setUploadLogo] = useState(null);
  var reader = new FileReader();
  const fileuploadHandler = (e) => {
    if (e.target.files[0].size > 512 * 1024) {
      alertError("A maximum of 512KB is allowed");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setLogo(reader.result); //this is what you will set in your img scr={imagePreviewUrl}
        onSaveChanges(true,reader.result);
      };
    }
  };

  const data = [
    {
      labelTitle: `${t('Background Color')} :`,
      name: "background",
      value: background_color,
      set: setBackgroundColor,

    },
    {
      labelTitle: `${t('Payment Button Color')} :`,
      name: "button",
      value: button_color,
      set: setButtonColor,
      defaultValue: '#000000'
    },
    {
      labelTitle: `${t('Border Color')} :`,
      name: "border",
      value: border_color,
      set: setBorderColor,
      defaultValue: '#DCE5E5'
    },
  ];

  const uploadData = [
    t('You can only upload JPG files'),
    t('Image dimensions should be 200px x 200px'),
    t('Your file must be 512kB or smaller'),
  ];

  clickOutside(ref, () => {
    setShow("");
  });

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  };

  const onSaveChanges = (logo=false, file) =>{
    const p = logo ? { logo: file} :

      {
          checkoutPageConfig: {
            backgroundColor: background_color,
            paybuttonColor: button_color,
            paychannelColor: border_color,
          },
        }
    setProcess(true)
    updateBusinessSettings(p)
        .then(res => {
          if (res.responseCode === '00'){
            setProcess(false)
            alertSuccess('Success')
            getBusiness()
          }else{
            alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
          }
        })
        .catch(e=>{
          setProcess(false)
          alertExceptionError(e)
        })
  }

  return (
    <div>
      <div className="d-flex mt-5 checkout--customization">
        <div className="sidee mr-1 mt-3 checkout--customization__custom-setup">
          <div className="d-flex mb-4 align-items-center">
            <div className="slash-border d-flex position-relative">
              <div
                className="position-absolute"
                style={{ right: "-9px", top: "-13px" }}
                onClick={(e) => uplaodElement.click()}
              >
                <Pencil onClick={(e) => uplaodElement.click()} />
              </div>
              <img
                src={logo}
                onClick={(e) => uplaodElement.click()}
                height="110"
                width="110"
                // className="position-absolute"
                style={{ textAlign: "center", margin: "auto" }}
              />
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/png, image/jpeg, image/ico"
                placeholder="image"
                ref={(e) => (uplaodElement = e)}
                onChange={(e) => fileuploadHandler(e)}
              />
            </div>

            <div>
              <ul>
                {uploadData.map((data) => (
                  <li className="mb-2">{data}</li>
                ))}
              </ul>
            </div>
          </div>

          {data.map((data) => (
            <div className="mb-4" style={{ cursor: "pointer" }}>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <label
                  className="webhooks__label reduce-width-custom"
                  onClick={() => setShow(data.name)}
                >
                  {data.labelTitle}
                </label>

                <input
                  className={`d-block form__control--full move-input-custom  mb-2`}
                  type="text"
                  // disabled={true}
                  name={data.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShow(data.name)}
                  value={data.value || data.defaultValue}
                />

                <div
                  className="custom-colour"
                  onClick={() => setShow(data.name)}
                  style={{
                    backgroundColor: data.value.includes("#")
                      ? data.value
                      : data.value.length > 0 ? "#" + data.value : data.defaultValue,
                  }}
                ></div>

                {show === data.name && (
                  <div
                    ref={ref}
                    className="position-absolute"
                    style={{ zIndex: 1, right: "0" }}
                  >
                    <SketchPicker
                      color={data.value}
                      onChangeComplete={(color) =>
                        data.set(color.hex.replace("#", ""))
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <Can access="MANAGE_MERCHANT_PROFILE">
            <div>
              <Button
                  onClick={()=>onSaveChanges()}
                text={
                  process ? (
                    <Spinner
                      animation="border"
                      size="sm"
                      variant="light"
                      disabled={process}
                    />
                  ) : (
                    "Save"
                  )
                }
                as="button"
                buttonType="submit"
                type="primary"
                full
              />
            </div>
          </Can>
        </div>
        <div className="d-flex justify-content-center checkout--customization__custom-preview">
          <NavMenuItem>
            <div className="position-relative">
              {logo && (
                <img
                  src={logo}
                  onClick={(e) => uplaodElement.click()}
                  height="40"
                  width="40"
                  className="position-absolute"
                  style={{ top: "65px", left: "138px" }}
                />
              )}

              <div
                className="border br-normal p-3"
                style={{
                  backgroundColor:
                    background_color.indexOf("#") == 0
                      ? background_color
                      : "#" + background_color,
                  marginRight: "-1em",
                  marginLeft: "-1em",
                  marginBottom: "-1.1em",
                }}
              >
                {/* {border_color !== "" && ( */}
                  <SetupModal
                    customize={{
                      border_color,
                      button_color,
                      background_color,
                      logo,
                    }}
                    width={useWindowDimensions}
                  />
                {/* )} */}
                <div
                  className="font-14 font-weight-bolder sbt-deep-color text-center mt-3"
                  style={{ width: "95%" }}
                >
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      playCheckout({
                        tranref: Math.random().toString(36).substr(2),
                        country: country.countryCode,
                        currency: default_currency,
                        amount: 100,
                        description: t('Modeling Seerbit Checkout'),
                        full_name:
                          primaryUser.first_name + " " + primaryUser.last_name,
                        email: primaryUser.email,
                        mobile_no: phone_number,
                        public_key:
                          setting.mode === "TEST"
                            ? test_public_key
                            : live_public_key,
                        customization: {
                          theme: {
                            name: t('Seerbit Checkout'),
                            border_color:
                              border_color.indexOf("#") == 0
                                ? border_color
                                : "#" + border_color,
                            background_color:
                              background_color.indexOf("#") == 0
                                ? background_color
                                : "#" + background_color,
                            button_color:
                              button_color.indexOf("#") == 0
                                ? button_color
                                : "#" + button_color,
                          },
                          logo,
                        },
                        callback,
                        close,
                      })
                    }
                  >
                    {t('Open Preview')}
                  </span>
                </div>
              </div>
            </div>
          </NavMenuItem>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  kyc: state.data.kyc,
  industry_list: state.data.industry_list,
  error_details: state.data.error_details,
  location: state.data.location,
  countries: state.data.countries,
});

export default connect(mapStateToProps, {
  setErrorLog,getBusiness
})(Customization);
