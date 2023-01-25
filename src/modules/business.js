/**
 * BankAccount
 *
 * @format
 */

import React, { memo, useState } from "react";

import verify from "utils/strings/verify";
import validate from "utils/strings/validate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { Modal } from 'rsuite';
import styled from "styled-components";
import "./css/module.scss";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

const DataWrapper = styled.div`
  height: auto;
  width: 600px;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Wrap = styled.div`
  margin-bottom: 1.5em;
`;
const bank = [
  {
    bank_name: "First City Monument Bank",
    number: "0000000000",
    name: "Franklyn May May Systems Integration Limited",
  },
];

const AddBusiness = ({
  close,
  industry_list,
  countries,
  addBusiness,
  setProcessBusiness,
  processBusiness,
                       show
}) => {
  const [business_name, setBusinessName] = useState();
  const [business_email, setBusinessEmail] = useState();
  const [support_email, setSupportEmail] = useState();
  const [support_phone, setSupportPhone] = useState();
  const [industryCode, setIndustryCode] = useState(
    industry_list && industry_list[0].industry_code
  );
  const [countryCode, setCountryCode] = useState(
    countries && countries[0].countryCode
  );

  const [businessNamePass, setBusinessNamePass] = useState(false);
  const [businessEmailPass, setBusinessEmailPass] = useState(false);
  const [supportEmailPass, setSupportEmailPass] = useState(false);
  const [supportPhonePass, setSupportPhonePass] = useState(false);
  const [industryCodePass, setIndustryCodePass] = useState(true);
  const [countryCodePass, setCountryCodePass] = useState(true);

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

  const handleSupportPhone = (e) => {
    var thenum = e.target.value.match(RegExp(verify.phone_no, "i"), "");
    if (thenum !== null) {
      setSupportPhone(thenum[0]);
      setSupportPhonePass(RegExp(validate.phone_no, "i").test(thenum[0]));
    }
  };

  const initProcess = async (
    business_email,
    business_name,
    support_email,
    support_phone,
    countryCode,
    industryCode
  ) => {
    setProcessBusiness(true);
    if (!businessNamePass) {
      setBusinessNamePass(false);
      setProcessBusiness(false);
    } else if (!businessEmailPass) {
      setBusinessEmailPass(false);
      setProcessBusiness(false);
    } else if (!supportEmailPass) {
      setSupportEmailPass(false);
      setProcessBusiness(false);
    } else if (!supportPhonePass) {
      setSupportPhonePass(false);
      setProcessBusiness(false);
    } else if (countryCode.length < 2) {
      setCountryCodePass(false);
      setProcessBusiness(false);
    } else if (industryCode.length < 2) {
      setIndustryCodePass(false);
      setProcessBusiness(false);
    } else {
      setBusinessNamePass(true);
      setBusinessEmailPass(true);
      setSupportEmailPass(true);
      setSupportPhonePass(true);
      setCountryCodePass(true);
      setIndustryCodePass(true);
      const params = {
        data: {
          business_email,
          business_name,
          support_email,
          support_phone,
          countryCode,
          industryCode,
        },
        location: "new_business",
      };
      addBusiness(params);
    }
  };

  return (
      <Modal show={show} onHide={() => close()} centered>
        <Modal.Header>
        </Modal.Header>
      <Wrap>
        <div className="font-medium text-black">Add Business</div>
      </Wrap>
      <form
        className="w-100"
        onSubmit={(e) => {
          e.preventDefault();
          initProcess(
            business_email,
            business_name,
            support_email,
            support_phone,
            countryCode,
            industryCode
          );
        }}
      >
        <div className="row">
          <div className="form-group col-md-6 mh-40">
            <label className="font-12">Business name</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="business_name"
              onChange={(e) => handleBusinessName(e)}
              value={business_name}
              required
            />
            {!businessNamePass && business_name && (
              <Error>enter a valid business name</Error>
            )}
          </div>
          <div className="pl-1 form-group mh-40 col-md-6">
            <label className="font-12">Business Email</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="business_email"
              onChange={(e) => handleBusinessEmail(e)}
              value={business_email}
              required
            />
            {!businessEmailPass && business_email && (
              <Error>enter a valid email address </Error>
            )}
          </div>
          <div className=" form-group mh-40 col-md-6">
            <label className="font-12">Support Email</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="support_email"
              onChange={(e) => handleSupportEmail(e)}
              value={support_email}
              required
            />
            {!supportEmailPass && support_email && (
              <Error>enter a valid email address </Error>
            )}
          </div>
          <div className="pl-1 form-group mh-40 col-md-6">
            <label className="font-12">Support Phone number</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="account_number"
              onChange={(e) => handleSupportPhone(e)}
              value={support_phone}
              required
            />
            {!supportPhonePass && support_phone && (
              <Error>enter a valid phone number</Error>
            )}
          </div>

          <div className="form-group mh-40 col-md-6">
            <label className="font-12">Country</label>
            <select
              className="form-control mh-40"
              name="bank"
              onChange={(e) => setCountryCode(e.target.value)}
              value={countryCode}
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
            {!countryCodePass && (
              <Error>select a valid country of your business</Error>
            )}
          </div>

          <div className="pl-1 form-group mh-40 col-md-6">
            <label className="font-12">Business industry</label>
            <select
              className="form-control mh-40"
              name="bank"
              onChange={(e) => setIndustryCode(e.target.value)}
              value={industryCode}
            >
              <option selected>--SELECT INDUSTRY--</option>
              {industry_list &&
                industry_list.map((list, key) => {
                  return (
                    <option key={key} value={list.industry_code}>
                      {list.name}
                    </option>
                  );
                })}
            </select>
            {!industryCodePass && (
              <Error>select the industry category of your business</Error>
            )}
          </div>

          <div className="form-group mh-40 col-12">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"40px"}
              className="brand-btn"
              type="submit"
              disabled={processBusiness}
            >
              {processBusiness && (
                <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
              )}
              {!processBusiness && `Add Business`}
            </Button>
          </div>
        </div>
      </form>

      </Modal>
  );
};

export default AddBusiness;
