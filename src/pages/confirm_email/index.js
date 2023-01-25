/**
 * Pin Code
 *
 * @format
 */

import React from "react";
import { connect } from "react-redux";
import { userLogin, setErrorLog } from "../../actions/postActions";
import Email from "../../assets/images/svg/email.svg";
import "./css/index.scss";
import styled from "styled-components";
import BrandsThatTrustUs from "../../components/brandsTrust";
import {useParams} from "react-router";
import {hostChecker} from "utils";
import {useTranslation} from "react-i18next";

const Container = styled.div`
  margin: 80px 60px;
`;

export function ConfirmEmail(props) {
  // const email  = props.signup ? props.signup.email ? props.signup.email : "" : ""
  const { email } = useParams()
  const { t } = useTranslation();
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
                {t('Please take a moment to verify your email address. We sent an email with a verification link to')} <span className="seerbit-color">{email ? email : t('your email box')}</span> <br/> <br/>
                {t('If you did not receive the email, kindly check your spam folder')}
                {/*<span className="seerbit-color">click here to resend</span>*/}
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
