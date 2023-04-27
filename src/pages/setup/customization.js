/**
 * BankAccount
 *
 * @format
 */

import React, { memo, useState, useRef } from "react";

import { Button, Modal } from "react-bootstrap";
import useOnClickOutside from "../../utils/onClickOutside";


import { playCheckout } from "../../utils/js/checkout";

import SetupModal from "../../modules/setupModal";
import { SketchPicker } from 'react-color';
import cogoToast from "cogo-toast";

import styled from "styled-components";
import "./css/setup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

const NavMenuItem = styled.div`
  font-size: 1.1em;
  color: #676767 !important;
`;

const DataWrapper = styled.div`
  width: 400px;
  height: 487px;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Wrap = styled.div`
  margin-bottom: 1em;
`;

export function Customization({
  business_details,
  updateBusiness,
  customProcess,
  setCustomProcess,
  white_label,
}) {
  const { checkoutPageConfig } = business_details;
  const [button_color, setButtonColor] = useState(
    (checkoutPageConfig &&
      checkoutPageConfig != null &&
      checkoutPageConfig.paybuttonColor) ||
    white_label.button_color
  );
  const [border_color, setBorderColor] = useState(
    (checkoutPageConfig &&
      checkoutPageConfig != null &&
      checkoutPageConfig.paychannelColor) ||
    white_label.border_color
  );
  const [background_color, setBackgroudColor] = useState(
    (checkoutPageConfig &&
      checkoutPageConfig != null &&
      checkoutPageConfig.backgroundColor) ||
    "#ffffff"
  );

    const { t } = useTranslation();

    const [logo, setLogo] = useState(business_details.logo);
  const [upload_logo, setUploadLogo] = useState(null);
  var reader = new FileReader();
  const fileuploadHandler = (e) => {
    if (e.target.files[0].size > 512 * 1024) {
      alert(t("Maximum of 150 kilobyte is allow"));
      cogoToast.error("Maximum of 150 kilobyte is allow");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setLogo(reader.result); //this is what you will set in your img scr={imagePreviewUrl}
        initUpload(reader.result);
      };
    }
  };
  const initUpload = async (logo) => {
    setCustomProcess(true);
    const params = {
      data: {
        logo,
      },
      location: "business_information",
    };

    updateBusiness(params);
  };
  return (
    <div className="d-flex">
      <Customizer
        updateBusiness={updateBusiness}
        business_details={business_details}
        customProcess={customProcess}
        setCustomProcess={setCustomProcess}
        background_color={background_color}
        setBackgroudColor={setBackgroudColor}
        border_color={border_color}
        setBorderColor={setBorderColor}
        button_color={button_color}
        setButtonColor={setButtonColor}
      />
      <Template
        business_details={business_details}
        button_color={button_color}
        border_color={border_color}
        background_color={background_color}
        fileuploadHandler={fileuploadHandler}
        logo={logo}
      />
    </div>
  );
}

const Template = ({
  business_details,
  border_color,
  button_color,
  background_color,
  fileuploadHandler,
  logo,
}) => {
  let uplaodElement = null;
    const { t } = useTranslation();

    const {
    country,
    default_currency,
    primaryUser,
    phone_number,
    setting,
    test_public_key,
    live_public_key,
  } = business_details;
  const close = (close) => {

  };
  const callback = (response) => {

  };
  return (
    <div className="sbt-setup col-md-6 d-flex justify-content-center">
      <NavMenuItem>
        <div className="position-relative">
          <img
            src={logo}
            onClick={(e) => uplaodElement.click()}
            height="50"
            width="50"
            className="position-absolute"
            style={{ top: "78px", left: "138px" }}
          />
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/png, image/jpeg, image/ico"
            placeholder="image"
            ref={(e) => (uplaodElement = e)}
            onChange={(e) => fileuploadHandler(e)}
          />
          <Button
            style={{
              backgroundColor:
                button_color.indexOf("#") == 0
                  ? button_color
                  : "#" + button_color,
              width: "280px",
              border: "none",
              top: "212px",
              left: "143px",
            }}
            className={`h-30px font-12 py-0 position-absolute`}
          >
              {t("pay")}
          </Button>
          <div
            className="position-absolute"
            style={{ top: "257px", left: "123px" }}
          >
            {[{}, {}, {}].map(() => (
              <div
                className="p-3 br-normal mb-1"
                style={{
                  border: `solid 1px ${border_color.indexOf("#") == 0
                    ? border_color
                    : "#" + border_color
                    }`,
                  width: "320px",
                  height: "46px",
                }}
              >
                &nbsp;
              </div>
            ))}
          </div>
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
            <SetupModal />
            <div
              className="font-14 font-weight-bolder sbt-deep-color text-center"
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
                    description: t("Modeling Seerbit Checkout"),
                    full_name:
                      primaryUser.first_name + " " + primaryUser.last_name,
                    email: primaryUser.email,
                    mobile_no: phone_number,
                    public_key:
                      setting.mode === "TEST" ? test_public_key : live_public_key,
                    customization: {
                      theme: {
                        name: "Seerbit Checkout",
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
                      display_fee: setting.display_fee,
                      display_type: "embed",
                      logo,
                    },
                    callback,
                    close,
                  })
                }
              >
                {t("Open Preview")}
            </span>
            </div>
          </div>

        </div>
      </NavMenuItem>
    </div>
  );
};

const Customizer = ({
  updateBusiness,
  customProcess,
  setCustomProcess,
  button_color,
  setButtonColor,
  border_color,
  setBorderColor,
  background_color,
  setBackgroudColor,
}) => {
  const [showBackgroundColor, setShowBackgroundColor] = useState(false);
  const [showButtonColor, setShowButtonColor] = useState(false);
  const [showBorderColor, setShowBorderColor] = useState(false);
    const { t } = useTranslation();


    const ref = useRef();
  useOnClickOutside(ref, () => {
    setShowBackgroundColor(false);
    setShowButtonColor(false);
    setShowBorderColor(false);
  });

  const initProcess = async (background_color, button_color, border_color) => {
    const params = {
      data: {
        checkoutPageConfig: {
          backgroundColor: background_color,
          paybuttonColor: button_color,
          paychannelColor: border_color,
        },
      },
      location: "business_information",
    };
    updateBusiness(params);
  };

  return (
    <DataWrapper className="bg-white px-4 pb-3 py-4 sbt-setup ">
      <Wrap>
        <div className="font-medium text-black">{t("Checkout Customization")}</div>
        <div className="text-muted font-12 pt-2 bg-mute">
            {t("Customize your checkout page to suite your brand")}
        </div>
      </Wrap>
      <form
        className="w-100"
        onSubmit={(e) => {
          e.preventDefault();
          setCustomProcess(true);
          initProcess(background_color, button_color, border_color);
        }}
      >
        <div className="form-group col-md-12 mh-40">
          <label className="font-12">{t("Background Color")}</label>
          <div
            className="input-group mb-3 form-group h-40"
            style={{
              border: "1px solid #b9c0c7",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <input
              className="form-control border-none h-25px pl-0 bg-white"
              value={background_color}
              onClick={() => setShowBackgroundColor(!showBackgroundColor)}
              maxLength={6}
            />
            {showBackgroundColor && <div ref={ref} className="input-group-append" style={{ zIndex: 1 }}>
              <SketchPicker
                color={background_color}
                onChangeComplete={color => setBackgroudColor(color.hex)}
              />
            </div>}
          </div>
        </div>

        <div className="form-group mh-40 col-md-12">
          <label className="font-12">{t("Pay Button Color")}</label>
          <div
            className="input-group mb-3 form-group h-40"
            style={{
              border: "1px solid #b9c0c7",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <input
              className="form-control border-none h-25px pl-0 bg-white"
              value={button_color}
              onClick={() => setShowButtonColor(!showButtonColor)}
              maxLength={6}
            />
            {showButtonColor && <div ref={ref} className="input-group-append" style={{ zIndex: 1 }}>
              <SketchPicker
                color={button_color}
                onChangeComplete={color => setButtonColor(color.hex)}
              />
            </div>}
          </div>
          <div className="form-group ">
            <label className="font-12">{t("Payment Channel Border Color")}</label>
            <div
              className="input-group mb-3 form-group h-40"
              style={{
                border: "1px solid #b9c0c7",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <input
                className="form-control border-none h-25px pl-0 bg-white"
                value={border_color}
                onClick={() => setShowBorderColor(!showBorderColor)}
                maxLength={6}
              />
              {showBorderColor && <div ref={ref} className="input-group-append">
                <SketchPicker
                  color={border_color}
                  onChangeComplete={color => setBorderColor(color.hex)}
                />
              </div>}
            </div>
          </div>

          <div className="form-group mh-40">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"40px"}
              className="brand-btn"
              type="submit"
              disabled={customProcess}
            >
              {customProcess && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              {!customProcess && `Save Changes`}
            </Button>
          </div>
        </div>
      </form>
    </DataWrapper>
  );
};
export { Template, Customizer };

export default Customization;
