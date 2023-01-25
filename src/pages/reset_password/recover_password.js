/**
 * Login
 *
 * @format
 */

import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "./css/reset.scss";
import SeerBitAdverts from "../../components/seerbitAdverts";
import Loader from 'components/loader'
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {recoverUserPassword} from "../../services/authService";
import {hostChecker} from "../../utils";
import {useTranslation} from "react-i18next";

export function RecoverPassword(props) {
  const { history } = props;
  const [email, setEmail] = useState();
  const [inProcess, setInProcess] = useState(false);
  const { t } = useTranslation();


  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // const initAuthorization = async (e, email) => {
  //   e.preventDefault();
  //   const params = {
  //     data: {
  //       email,
  //     },
  //     location: "emailnotification",
  //   };
  //   props.recoverPassword(params);
  // };
  const send = (e, email)=>{
    e.preventDefault();
    const p = {email}
    setInProcess(true)
    recoverUserPassword(`auth/user/recoverpassword/${email}`, p)
        .then(res=>{
          setInProcess(false);
              if (res.responseCode === '00'){
                setEmail('')
                alertSuccess(`An email has been send to ${email}. Kindly follow the Instructions in the email.`);
              }else{
                alertError(res.message ? res.message : 'An Error Occurred. Kindly try again.')
              }
            }
        ).catch(e=>{
      setInProcess(false);
      alertExceptionError(e)
    })
  }

  // useEffect(() => {
  //   if (
  //     props.error_details &&
  //     props.error_details.error_source === "emailnotification"
  //   ) {
  //     setInProcess(false);
  //     cogoToast.error(props.error_details.message, { position: "top-right" });
  //   }
  //   else if (props.location === "emailnotification" && props.recover_password) {
  //     setInProcess(false);
  //     cogoToast.success(`An email has been sent to ${email}`, {
  //       position: "top-right",
  //     });
  //   }
  // }, [
  //   props.user_details,
  //   props.error_details,
  //   props.recover_password,
  //   props.location,
  // ]);

  return (
      <div className="p-0 d-flex sbt-login align-items-center justify-content-between" style={{height:'100vh'}}>
          <div className="auth--container">
            <div className='text-center'>
              <img
                  src={`https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                  className="auth-logo mb-5"
              />
            </div>
            <div className="auth--section">
              <div className="auth--section__content">
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                setInProcess(true);
                send(e, email);
              }}
            >
              <div className="py-3 mb-1 text-center">
                <div className="title mb-1" >{t("Forgot your password?")}</div>
                <div className="sub-heading">{t("No worries! Enter your email below and we’ll \n send you a link with instructions to reset your password")}.</div>
              </div>
              <div className="py-3">
                <label>{t("Email")}</label>
                <div className="form-outline mb-3">
                  <input
                    autoComplete="new-password"
                    name="email"
                    type="email"
                    className={email ? `form-control hasPassword` : `form-control seerbit-login-password`}
                    onChange={(e) => handleEmail(e)}
                    value={email}
                    required

                  />

                </div>
              </div>
              <Button
                block
                className="brand-btn h-50px"
                type="submit"
                disabled={inProcess}
              >

                {inProcess && <Loader type={'login'} />}
                {!inProcess && "Reset Password"}

              </Button>
              <div className="container">
                <div className="row">
                  <div className="col-12 p-0">
                    <div className="mt-4">
                      <span onClick={(e) =>
                        history.push({
                          pathname: "login",
                        })} className="brand-color cursor-pointer"
                      >
                        {t("Back to Login")}?
                </span>
                    </div>
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

RecoverPassword.propTypes = {
  recoverPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  recover_password: state.data.recover_password,
  error_details: state.data.error_details,
  location: state.data.location,
  white_label: state.data.white_label,
});

export default connect(mapStateToProps, { })(RecoverPassword);
