/**
 * Pin Code
 *
 * @format
 */

import React, { useState } from "react";
import { connect } from "react-redux";
import { userLogin, setErrorLog } from "../../actions/postActions";
import Email from "../../assets/images/svg/email.svg";
import "./css/index.scss";
import styled from "styled-components";
import BrandsThatTrustUs from "../../components/brandsTrust";
import {useParams} from "react-router";
import {hostChecker} from "utils";
import {useTranslation} from "react-i18next";
import PinCodeCode  from 'react-auth-code-input';
import {verifyAccount} from "../../services/authService";
import {alertError, alertExceptionError} from "modules/alert";
import {appBusy} from "../../actions/appActions";
import Loader from "components/loader";
import Button from "components/button";

const Container = styled.div`
  margin: 80px 60px;
`;




export function ConfirmEmail(props) {
  const { email } = useParams()
  const { t } = useTranslation();
  const [result, setResult] = useState();
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const handleOnChange = (res) => {
    setResult(res);
    res.length === 6 ? setIsDisabled(false) : setIsDisabled(true);
  };


  const verifyPinCode =  async () => {
    appBusy(true, 'We are Verifying your account.');
    setVerifying(true)
    await verifyAccount(result)
        .then(res => {
          appBusy();
          setStatus(res.responseCode)
          if (res.responseCode === '00') {
            setTimeout(() => {
              window.location.href = localizer.path_url + "#/auth/login"
            }, 3000)
          } else {
            setMessage(res.message ? res.message : 'An Error Occurred verifying your account. Kindly try again by reloading this page.')
            alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
          }
          setVerifying(false)
        })
        .catch(e => {
          appBusy()
          setVerifying(false)
          alertExceptionError(e)
        })
  }

  return (
    <Container>
      <div className="container">
        <div className="">
          <div className="text-center">
            <div style={{ marginBottom: "190px" }}>
              <img src={`https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`} alt="logo" width="121" />
            </div>
            <div>
              <img src={Email} alt="email" />
            </div>
            <div style={{ color: "#323131", fontSize:"25px", fontWeight:"500" }}>
              {t('Confirm Your Email')}
          </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="font-18 text-center" style={{ width: "600px", fontSize: "48px", color: "#323131", marginBottom: 200, marginTop: 30 }}>
                {t('Please take a moment to verify your email address. We sent an email with a verification OTP to')} <span className="seerbit-color">{email ? email : t('your email box')}</span> <br/> <br/>

                <PinCodeCode
                    allowedCharacters='numeric'
                    containerClassName='p-3'
                    inputClassName='pin-code-input'
                    isPassword={true}
                    disabled={verifying}
                    onChange={handleOnChange}
                />
                <br/>
                  <button
                      className='btn btn-lg btn-dark'
                      onClick={verifyPinCode}
                      disabled={isDisabled}
                  >
                    Verify
                  </button>
                <br/> <br/>
                {t('If you did not receive the email, kindly check your spam folder')}
          </div>
            </div>
        <BrandsThatTrustUs/>
          </div>
        </div>
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  signup: state.data.signup,
});

export default connect(mapStateToProps, { userLogin, setErrorLog })(ConfirmEmail);
