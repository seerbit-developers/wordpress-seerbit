/**
 * BusinessInformation
 *
 * @format
 */

import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  updateBusiness,
  getKYC,
  getIndustries,
  getCountries,
  getBusiness,
  setErrorLog,
} from "../../actions/postActions";
import { Can } from "../../modules/Can";
import { ProgressBar } from "react-bootstrap";
import cogoToast from "cogo-toast";
import LeftChevron from "../../assets/images/svg/leftChevron";
import { Button } from "react-bootstrap";
import { Loader } from 'semantic-ui-react'
import verify from "utils/strings/verify";
import validate from "utils/strings/validate";
import { KYCDocument, KYCText, KYCNotSet } from "../../modules/fileUpload";

import Upload from "../../assets/images/svg/upload.svg";

import "./css/setup.scss";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

const Wrapper = styled.div`
  background: F8FAFF;
  padding-left: 3em;
  margin-top: 1em;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
`;

const Center = styled.div`
  text-align: center;
  margin: auto;
  justify-content: center;
  line-height: 1.2;
`;
const WrapSection = styled.div`
  width: 900px;
  display: flex;
`;

const CloseTag = styled.div`
  font-size: 0.9em;
  color: #c2c2c2 !important;
  display: flex;
  cursor: pointer;
  & svg {
    font-size: 1.3em;
  }
`;

const DataWrapper = styled.div`
  height: auto;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Wrap = styled.div`
  margin-bottom: 1.5em;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  color: #676767;
`;

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

export function BusinessDetails(props) {
  const { history } = props;
  const [addressProcess, setAddressProcess] = useState(false);
  const [informationProcess, setInformationProcess] = useState(false);
  const [contactProcess, setContactProcess] = useState(false);
  const [kycProcess, setKycProcess] = useState(false);
  const [logoProcess, setLogoProcess] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();


  useEffect(() => {
    if (props.business_details && props.location === "business_information") {
      cogoToast.success("Update successful", { position: "top-right" });
      if (!props.progress) {
        props.getBusiness();
      }
      setAddressProcess(false);
      setInformationProcess(false);
      setContactProcess(false);
      setKycProcess(false);
      // if (history.goBack) history.goBack();
    }
  }, [props.business_details]);

  useEffect(() => {
    if (
      props.error_details &&
      props.error_details.error_source === "business_information"
    ) {
      cogoToast.error(props.error_details.message || "action not completed", {
        position: "top-right",
      });
      setAddressProcess(false);
      setInformationProcess(false);
      setContactProcess(false);
      setKycProcess(false);
      props.setErrorLog();
    }
  }, [props.error_details]);

  useEffect(() => {
    props.getIndustries();
    props.getKYC();
    props.getCountries();
  }, []);

  return (
    <Wrapper className="sbt-setup mt-3">
      <div className="font-medium pb-3 text-black">
        {t("Quick Setup")}
        <div className="mt-5">
          <CloseTag
            onClick={(e) => {
              if (history.goBack) history.goBack(e);
              else history.push("quick-setup");
            }}
          >
            <LeftChevron/>
            <span className="ml-1 mt-1">{t("return to quick setup")}</span>
          </CloseTag>
        </div>
      </div>
      <Centered className="py-4">
        <div>
          <Template
            updateBusiness={props.updateBusiness}
            business_details={props.business_details}
            industry_list={props.industry_list && props.industry_list.payload}
            kyc={props.kyc && props.kyc.payload}
            countries={props.countries && props.countries.payload}
            addressProcess={addressProcess}
            setAddressProcess={setAddressProcess}
            contactProcess={contactProcess}
            setContactProcess={setContactProcess}
            kycProcess={kycProcess}
            setKycProcess={setKycProcess}
            informationProcess={informationProcess}
            setInformationProcess={setInformationProcess}
            progress={progress}
            setLogoProcess={setLogoProcess}
            logoProcess={logoProcess}
            setProgress={setProgress}
          />
        </div>
      </Centered>
    </Wrapper>
  );
}

const Template = ({
  updateBusiness,
  business_details,
  industry_list,
  kyc,
  countries,
  addressProcess,
  setAddressProcess,
  contactProcess,
  setContactProcess,
  kycProcess,
  setKycProcess,
  informationProcess,
  setInformationProcess,
  setLogoProcess,
  logoProcess,
  progress,
  setProgress,
}) => {
  const { address } = business_details;
  const fix_data = {
    fieldName: "cac",
    identifier: "00000010",
    countryKycNumber: "000001",
    description: "CAC is Required",
    countryIdentifier: "000001",
    kycDocumentName: "CAC",
    documentType: "PDF",
    category: "LOW",
    status: business_details.status,
  };

  const [business_name, setBusinessName] = useState(
    business_details.business_name
  );
  const [business_email, setBusinessEmail] = useState(
    business_details.business_email
  );
  const [support_email, setSupportEmail] = useState(
    business_details.support_email
  );
  const [chargeback_email, setChargebackEmail] = useState(
    business_details.chargeback_email
  );
  const [website_url, setWebsiteURL] = useState(business_details.website_url);
  const [phone_number, setPhoneNumber] = useState(
    business_details.phone_number
  );
  const [business_industry, setBusinessIndustry] = useState(
    business_details.business_industry
  );
  const [street, setStreet] = useState(address && address.street);
  const [city, setCity] = useState(address && address.city);
  const [state, setState] = useState(address && address.state);
  const [country, setCountry] = useState(address && address.country);
  const { t } = useTranslation();


  const [logo, setLogo] = useState(business_details.logo);
  const [upload_logo, setUploadLogo] = useState(null);
  const [kycDocuments, setKYCDocuments] = useState(
    business_details.kycDocuments || []
  );
  const [kycUpdate, setKYCUpdate] = useState();
  const [business_certificate, setBusinessCertificate] = useState(
    business_details.business_certificate
  );
  const [rc_number, setRCNumber] = useState(business_details.rc_number);

  const [businessNamePass, setBusinessNamePass] = useState(true);
  const [businessEmailPass, setBusinessEmailPass] = useState(true);
  const [chargebackEmailPass, setChargebackEmailPass] = useState(true);
  const [supportEmailPass, setSupportEmailPass] = useState(true);
  const [websiteURLPass, setWebsiteURLPass] = useState(true);
  const [phoneNumberPass, setPhoneNumberPass] = useState(true);
  const [businessIndustryPass, setBusinessIndustryPass] = useState(true);
  const [streetPass, setStreetPass] = useState(true);
  const [cityPass, setCityPass] = useState(true);
  const [statePass, setStatePass] = useState(true);
  const [countryPass, setCountryPass] = useState(true);
  const [RCNumberPass, setRCNumberPass] = useState(true);
  const [items, setItems] = useState({});
  const [values, setValues] = useState({});

  let uplaodElement = null;
  var reader = new FileReader();
  const image = new Image();

  const handleBusinessName = (e) => {
    var thenum = e.target.value.match(RegExp(verify.business_name, "i"), "");
    if (thenum !== null) {
      setBusinessName(thenum[0]);
      setBusinessNamePass(RegExp(validate.business_name, "i").test(thenum[0]));
    }
  };

  const handleBusinessEmail = (e) => {
    var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
    if (thenum !== null) {
      setBusinessEmail(thenum[0]);
      setBusinessEmailPass(RegExp(validate.email, "i").test(thenum[0]));
    }
  };

  const handleSupportEmail = (e) => {
    var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
    if (thenum !== null) {
      setSupportEmail(thenum[0]);
      setSupportEmailPass(RegExp(validate.email, "i").test(thenum[0]));
    }
  };

  const handleChargebackEmail = (e) => {
    var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
    if (thenum !== null) {
      setChargebackEmail(thenum[0]);
      setChargebackEmailPass(RegExp(validate.email, "i").test(thenum[0]));
    }
  };

  const handlePhoneNumber = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setPhoneNumber(thenum[0]);
      setPhoneNumberPass(RegExp(validate.number).test(thenum[0]));
    }
  };

  const handleWebsiteURL = (e) => {
    setWebsiteURL(e.target.value);
    setWebsiteURLPass(RegExp(validate.web, "i").test(e.target.value));
  };

  const handleRCNumber = (e) => {
    var thenum = e.target.value.match(RegExp(verify.rc_number), "");
    if (thenum !== null) {
      setRCNumber(thenum[0]);
      setRCNumberPass(RegExp(validate.rc_number).test(thenum[0]));
    }
  };

  const initContact = async (support_email, chargeback_email, phone_number) => {
    if (!supportEmailPass) {
      setSupportEmailPass(false);
      setContactProcess(false);
    } else if (!chargebackEmailPass) {
      setChargebackEmailPass(false);
      setContactProcess(false);
    } else if (!phoneNumberPass) {
      setPhoneNumberPass(false);
      setContactProcess(false);
    } else {
      setSupportEmailPass(true);
      setChargebackEmailPass(true);
      setPhoneNumberPass(true);
      const params = {
        data: {
          support_email,
          chargeback_email,
          phone_number,
        },
        location: "business_information",
      };

      updateBusiness(params);
    }
  };

  const initAddress = async (street, city, state, country) => {
    if (street !== null && street.length < 2) {
      setStreetPass(false);
      setAddressProcess(false);
    } else if (city !== null && city.length < 2) {
      setCityPass(false);
      setAddressProcess(false);
    } else if (state !== null && state.length < 2) {
      setStatePass(false);
      setAddressProcess(false);
    } else if (country !== null && country.length < 2) {
      setCountryPass(false);
      setAddressProcess(false);
    } else {
      setCountryPass(true);
      setStatePass(true);
      setCityPass(true);
      setStreetPass(true);
      const params = {
        data: {
          address: {
            street,
            city,
            state,
            country,
          },
        },
        location: "business_information",
      };

      updateBusiness(params);
    }
  };

  const initProcess = async (
    business_name,
    business_email,
    phone_number,
    website_url,
    business_industry
  ) => {
    if (!businessNamePass) {
      setBusinessNamePass(false);
      setInformationProcess(false);
    } else if (!businessEmailPass) {
      setBusinessEmailPass(false);
      setInformationProcess(false);
    } else if (!websiteURLPass) {
      setWebsiteURLPass(false);
      setInformationProcess(false);
    } else if (!phoneNumberPass) {
      setPhoneNumberPass(false);
      setInformationProcess(false);
    } else if (!business_industry || business_industry.length < 5) {
      setBusinessIndustryPass(false);
      setInformationProcess(false);
    } else {
      setBusinessNamePass(true);
      setBusinessEmailPass(true);
      setWebsiteURLPass(true);
      setPhoneNumberPass(true);
      setBusinessIndustryPass(true);
      const params = {
        data: {
          business_name,
          business_email,
          phone_number,
          website_url,
          business_industry,
        },
        location: "business_information",
      };

      updateBusiness(params);
    }
  };

  const onUploadProgress = (progressEvent) => {
    let percentCompleted = 0;
    percentCompleted = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(percentCompleted);
  };

  const initUpload = async (logo) => {
    if (!upload_logo || upload_logo === null) {
      cogoToast.error("Click logo box to upload new logo");
    } else {
      setLogoProcess(true);
      const params = {
        data: {
          logo,
        },
        location: "business_information",
        onUploadProgress,
      };

      updateBusiness(params);
    }
  };

  const initKYCUpload = async (kycDocuments) => {
    setKycProcess(true);
    const params = {
      data: {
        kycDocuments,
      },
      location: "business_information",
      onUploadProgress,
    };
    updateBusiness(params);
  };

  const initDefaultKYC = async (rc_number, business_certificate) => {
    if (!RCNumberPass) {
      setRCNumberPass(false);
      setKycProcess(false);
      return;
    }
    const params = {
      data: {
        business_certificate,
        rc_number,
      },
      location: "business_information",
    };
    updateBusiness(params);
  };

  useEffect(() => {
    if (upload_logo) {
      if (upload_logo.size > 512 * 1024) {
        cogoToast.error("Maximum of 150 kilobyte is allow");
        return;
      }

      reader.readAsDataURL(upload_logo);

      reader.onload = () => {
        image.src = reader.result;
        image.onload = () => {
          if ((image.width < 50) || (image.width > 100)) {
            cogoToast.error("Please, upload a file with a width and a height not lesser than 50px and greater than 100px");
            return;
          }
          if ((image.height < 50) || (image.height > 100)) {
            cogoToast.error("Please, upload a file with a width and a height not lesser than 50px and greater than 100px");
            return;
          }
          setLogo(reader.result);
        }
      }
    }
  }, [upload_logo])

  useEffect(() => {
    if (upload_logo) initUpload(logo);
  }, [logo]);

  return (
    <WrapSection>
      <div className="col-md-7">
        <DataWrapper className="bg-white px-4 pb-3 pt-4 mb-3">
          <Wrap>
            <div className="font-medium text-black">{t("Business Information")}</div>
          </Wrap>
          <form
            className="w-100"
            onSubmit={(e) => {
              e.preventDefault();
              setInformationProcess(true);
              initProcess(
                business_name,
                business_email,
                phone_number,
                website_url,
                business_industry
              );
            }}
          >
            <div className="row">
              <div className="form-group col-12">
                <label className="font-12">{t("Business Name")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="business_name"
                  onChange={(e) => handleBusinessName(e)}
                  value={business_name}
                />
                {!businessNamePass && business_name !== undefined && (
                  <Error>{t("enter a valid business name")}</Error>
                )}
              </div>
              <div className="form-group col-md-6 pr-md-1">
                <label className="font-12">{t("Business Phone Number")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="phone_number"
                  onChange={(e) => handlePhoneNumber(e)}
                  value={phone_number}
                />
                {!phoneNumberPass && phone_number !== undefined && (
                  <Error>{t("enter a valid business name")}</Error>
                )}
              </div>
              <div className="form-group col-md-6 ">
                <label className="font-12">{t("Contact Email")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="contact_email"
                  onChange={(e) => handleBusinessEmail(e)}
                  value={business_email}
                />
                {!businessEmailPass && business_email !== undefined && (
                  <Error>{t("enter a valid email address")}</Error>
                )}
              </div>

              <div className="form-group col-12">
                <label className="font-12">{t("Industry")}</label>
                <select
                  className="form-control mh-40"
                  name="industry"
                  onChange={(e) => {
                    setBusinessIndustry(e.target.value);
                    setBusinessIndustryPass(true);
                  }}
                  value={business_industry}
                >
                  <option selected disabled>
                    --{t("SELECT INDUSTRY")}--
                  </option>
                  {industry_list &&
                    industry_list.map((list, key) => {
                      return (
                        <option key={key} value={list.industry_code}>
                          {list.name}
                        </option>
                      );
                    })}
                </select>
                {!businessIndustryPass && (
                  <Error>{t("select business industry category")}</Error>
                )}
              </div>
              <div className="form-group col-12  mh-40">
                <label className="font-12">{t("Website Address")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="website_address"
                  onChange={(e) => handleWebsiteURL(e)}
                  value={website_url}
                />
                {!websiteURLPass && website_url !== undefined && (
                  <Error>{t("enter a valid web address")}</Error>
                )}
              </div>
              <Can access="MANAGE_MERCHANT_PROFILE">
                <div className="col-12">
                  <Button
                    variant="xdh"
                    size="lg"
                    block
                    height={"40px"}
                    className="brand-btn"
                    type="submit"
                    disabled={informationProcess}
                  >
                    {informationProcess && (
                        <Loader active inline='centered' />
                    )}
                    {!informationProcess && `Save Changes`}
                  </Button>
                </div>
              </Can>
            </div>
          </form>
        </DataWrapper>

        <DataWrapper className="bg-white px-4 pb-5 pt-4 mb-3">
          <Wrap>
            <div className="font-medium pb-3 text-black ">{t("Business Support")}</div>
          </Wrap>
          <form
            className="w-100"
            onSubmit={(e) => {
              e.preventDefault();
              setContactProcess(true);
              initContact(support_email, chargeback_email, phone_number);
            }}
          >
            <div className="row ">
              <div className="form-group col-md-6 ">
                <label className="font-12">{t("Support Email")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="support_email"
                  onChange={(e) => handleSupportEmail(e)}
                  value={support_email}
                />
                {!supportEmailPass && support_email !== undefined && (
                  <Error>{t("enter a valid email address")}</Error>
                )}
              </div>
              <div className="form-group col-md-6 ">
                <label className="font-12">{t("Chargeback Email")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="chargeback_email"
                  onChange={(e) => handleChargebackEmail(e)}
                  value={chargeback_email}
                />
                {!chargebackEmailPass && chargeback_email !== undefined && (
                    <Error>{t("enter a valid email address")}</Error>
                )}
              </div>
              <div className="form-group col-12">
                <label className="font-12">{t("Phone Number")}</label>
                <input
                  className="form-control mh-40 "
                  type="text"
                  name="phone_number"
                  onChange={(e) => handlePhoneNumber(e)}
                  value={phone_number}
                />
                {!phoneNumberPass && phone_number !== undefined && (
                  <Error>{t("enter a valid phone number")}</Error>
                )}
              </div>

              <Can access="MANAGE_MERCHANT_PROFILE">
                <div className="col-12">
                  <Button
                    variant="xdh"
                    size="lg"
                    block
                    height={"40px"}
                    className="brand-btn"
                    type="submit"
                    disabled={contactProcess}
                  >
                    {contactProcess && (
                        <Loader active inline='centered' />
                    )}
                    {!contactProcess && `Save Changes`}
                  </Button>
                </div>
              </Can>
            </div>
          </form>
        </DataWrapper>

        <DataWrapper className="bg-white px-4 pb-5 pt-4 mb-3">
          <Wrap>
            <div size="medium" className="font-medium text-black">
              {t("Business Address")}
            </div>
          </Wrap>
          <form
            className="w-100"
            onSubmit={(e) => {
              e.preventDefault();
              setAddressProcess(true);
              initAddress(street, city, state, country);
            }}
          >
            <div className="row">
              <div className="form-group col-12  mh-40">
                <label className="font-12">{t("Business Address")}</label>
                <input
                  className="form-control mh-40"
                  type="text"
                  name="business_address"
                  onChange={(e) => setStreet(e.target.value)}
                  value={street}
                />
                {!streetPass && street !== undefined && (
                  <Error>{t("enter a valid street address")}</Error>
                )}
              </div>
              <div className="form-group col-12  mh-40">
                <label className="font-12">{t("Business City")}</label>
                <input
                  className="form-control mh-40"
                  type="text"
                  name="business_city"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
                {!cityPass && city !== undefined && (
                  <Error>{t("enter a valid city address")}</Error>
                )}
              </div>
              <div className="form-group col-12  mh-40">
                <label className="font-12">{t("Business State")}</label>
                <input
                  className="form-control mh-40"
                  type="text"
                  name="business_state"
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
                {!statePass && state !== undefined && (
                  <Error>{t("enter a valid country state")}</Error>
                )}
              </div>
              <div className="form-group col-12 mh-40">
                <label className="font-12">{t("Business Country")}</label>
                <input
                  className="form-control mh-40"
                  type="text"
                  name="country"
                  value={
                    business_details &&
                    business_details.country &&
                    business_details.country.name.charAt(0).toUpperCase() + business_details.country.name.slice(1).toLowerCase()
                  }
                  disabled
                />
                {/* <select
                  className="form-control mh-40"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  name="country"
                  disabled
                >
                  <option selected>--SELECT COUNTRY--</option>
                  {countries &&
                    countries.map((list, key) => {
                      return (
                        <option key={key} value={list.countryCode}>
                          {list.name}
                        </option>
                      );
                    })}
                </select>
                {!countryPass && country !== undefined && (
                  <Error>select your business country</Error>
                )} */}
              </div>

              <Can access="MANAGE_MERCHANT_PROFILE">
                <div className="col-12">
                  <Button
                    variant="xdh"
                    size="lg"
                    block
                    height={"40px"}
                    className="brand-btn"
                    type="submit"
                    disabled={addressProcess}
                  >
                    {addressProcess && (
                        <Loader active inline='centered' />
                    )}
                    {!addressProcess && `Save Changes`}
                  </Button>
                </div>
              </Can>
            </div>
          </form>
        </DataWrapper>
      </div>

      <div className="col-md-4">
        <DataWrapper className="bg-white px-4 pt-4">
          <Wrap>
            <div className="font-medium pb-2 text-black text-center">{t("Business Logo")}</div>
            <Centered>
              <img
                src={logo || Upload}
                onClick={(e) => uplaodElement.click()}
                height="64"
                width="64"
                title="click to update business logo"
              />
            </Centered>
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/png, image/jpeg, image/ico"
              placeholder="image"
              ref={(e) => (uplaodElement = e)}
              onChange={(e) => {
                setUploadLogo();
                setUploadLogo(e.target.files[0])

              }}
            />
            <Center className="py-3">
              <Tag>
                {t("Upload a logo with dimensions ranging from 50px to 100px")}.
              </Tag>
            </Center>
            <Can access="MANAGE_MERCHANT_PROFILE">
              <Center>
                {logoProcess && progress > 0 && (
                  <ProgressBar
                    animated
                    now={progress}
                    label={`${progress}%`}
                    className="mb-2"
                  />
                )}
                <Button
                  style={{
                    background: "transparent",
                    border: "1px solid #DFE0EB",
                    boxSizing: "border-box",
                    borderRadius: "5px",
                  }}
                  variant="xdh"
                  block
                  className="btn-outline font-14"
                  onClick={() => {
                    uplaodElement.click();
                  }}
                >
                  {logoProcess && (
                      <Loader active inline='centered' />
                  )}{" "}
                  {logoProcess
                    ? `Uploading`
                    : logo
                      ? "Change Logo"
                      : "Upload Logo"}
                </Button>
              </Center>
            </Can>
          </Wrap>
        </DataWrapper>
        {kyc &&
          kyc.length > 0 &&
          kyc.map((data, key) => {
            if (data.documentType === "TEXT") {
              return (
                <KYCText
                  data={data}
                  kycDocuments={kycDocuments}
                  setKYCDocuments={(kyc) => setKYCDocuments(kyc)}
                  setKYCUpdate={(update) => setKYCUpdate(update)}
                  setValues={(val) => setValues(val)}
                  values={values}
                />
              );
            } else if (["IMAGE", "PDF"].indexOf(data.documentType) > -1) {
              return (
                <KYCDocument
                  data={data}
                  key={key}
                  setItems={(item) => setItems(item)}
                  items={items}
                  kycDocuments={kycDocuments}
                  setKYCDocuments={(kyc) => setKYCDocuments(kyc)}
                  setKYCUpdate={() => setKYCUpdate(true)}
                />
              );
            }
          })}
        {kyc && kyc.message === "KYC not listed under business!!" && (
          <KYCNotSet
            data={fix_data}
            handleRCNumber={(e) => handleRCNumber(e)}
            rc_number={rc_number}
            setBusinessCertificate={(data) => setBusinessCertificate(data)}
            business_certificate={business_certificate}
            setItems={(item) => setItems(item)}
            items={items}
            setKYCUpdate={() => setKYCUpdate(true)}
          />
        )}
        {/* {progress > 0 && (
          <ProgressBar
            animated
            now={progress}
            label={`${progress}%`}
            className="mb-2"
          />
        )} */}
        {kycUpdate && (
          <Can access="MANAGE_MERCHANT_PROFILE">
            <Button
              style={{
                background: "transparent",
                border: "1px solid #DFE0EB",
                boxSizing: "border-box",
                borderRadius: "5px",
              }}
              variant="xdh"
              block
              className="btn-outline font-14"
              onClick={() => {
                if (kyc && kyc.message === "KYC not listed under business!!")
                  initDefaultKYC(rc_number, business_certificate);
                else initKYCUpload(kycDocuments);
              }}
              disabled={kycProcess}
            >
              {kycProcess && (
                  <Loader active inline='centered' />
              )}
              {!kycProcess && `Submit Documents`}
            </Button>
          </Can>
        )}
      </div>
    </WrapSection>
  );
};

export { Template };

BusinessDetails.propTypes = {
  updateBusiness: PropTypes.func.isRequired,
  getKYC: PropTypes.func.isRequired,
  getIndustries: PropTypes.func.isRequired,
  getCountries: PropTypes.func.isRequired,
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
  getKYC,
  updateBusiness,
  getBusiness,
  getIndustries,
  getCountries,
  setErrorLog,
})(BusinessDetails);

