/**
 * Login
 *
 * @format
 */

import React, {useState, useEffect, useRef} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { passwordReset } from "../../actions/postActions";
import { Button, Spinner } from "react-bootstrap";
import "./css/reset.scss";
import SeerBitAdverts from "../../components/seerbitAdverts";
import {recoverUserPassword, resetUserPassword} from "../../services/authService";
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {hostChecker} from "../../utils";

import {useTranslation} from "react-i18next";


export function ResetPassword(props) {
  const { history } = props;
  const [password, setPassword] = useState();
  const [password_confirmation, setPasswordConfirmation] = useState();
  const [inProcess, setInProcess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const passInput = useRef();
  const { t } = useTranslation();

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmation = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const send = ( password_confirmation, password)=>{
    const p = {
      password_confirmation,
      password,
      recovery_token: props.match.params.auth
    }
    if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[=+!@#\$%\^&\*\._\-\`\/()])(.{8,})$/.test(
            password
        )
    ) {
      alertError('Password must contain at least 8 characters including: one uppercase, one lowercase and one special character.');
      return false;
    }
    if (!password === password_confirmation){
      alertError('Passwords do not match');
      return false;
    }
    setPasswordVisible(false)
    setPasswordConfirmVisible(false)
    setInProcess(true)
    resetUserPassword(`auth/user/password`, p)
        .then(res=>{
              setInProcess(false);
              if (res.responseCode === '00'){
                alertSuccess(`Password change successful`, 'password_change');
                setTimeout(() => {
                  window.location.href = "/";
                }, 2000);
              }else{
                alertError(res.message ? res.message : 'An unexpected Error Occurred. Kindly try again.', {
                    hideAfter: 10,
                    position: null
                })
              }
            }
        ).catch(e=>{
      setInProcess(false);
      alertExceptionError(e)
    })
  }

  useEffect( ()=>{
    passInput.current.focus();
  }, [])

  return (
      <div className="p-0 d-flex justify-content-between sbt-reset align-items-center" style={{height:'100vh'}}>
          <div className="auth--container">
            <div className='text-center'>
              <img
                  src={`https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                  className="auth-logo mb-5"
              />
            </div>
            <div
                className="auth--section row"
            >
              <div className="col-md-4 col-sm-12">
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                send(password_confirmation, password);
              }}
            >
              <div className="mb-1 py-3 text-center">
                <div className="title" >{t("Create a new password")}</div>
              </div>
              <div className="py-3" >
                <label>{t("New Password")}</label>
                <div className="form-outline mb-3">
                  <input
                    autoComplete="new-password"
                    name="password"
                    autoFocus
                    type={passwordVisible ? 'text' : 'password'}
                    // placeholder="New Password"
                    className={password ? `form-control hasPassword` : `form-control seerbit-login-password`}
                    onChange={(e) => handlePassword(e)}
                    // value={password}
                    required
                    ref={passInput}

                  />
                  <span className="toggle-password-visibility" onClick={()=>setPasswordVisible(!passwordVisible)}
                        style={{position:'absolute', top:42, right:10, cursor:'pointer'}}
                  >
                {passwordVisible ? <i className="fa fa-eye" aria-hidden="true"/> :
                    <i className="fa fa-eye-slash" aria-hidden="true"/>
                }</span>
                </div>

                <div className="form-outline mb-3">
                  <label>{t("Confirm New Password")}</label>
                  <input
                    autoComplete="new-password"
                    name="password_confirmation"
                    // placeholder="Confirm Password"
                    type={passwordConfirmVisible ? 'text' : 'password'}
                    className={password_confirmation ? `form-control hasPassword` : `form-control seerbit-login-password`}
                    onChange={(e) => handlePasswordConfirmation(e)}
                    // value={password}
                    required
                  />
                  <span className="toggle-password-visibility" onClick={()=>setPasswordConfirmVisible(!passwordConfirmVisible)}
                        style={{position:'absolute', top:17, right:10, cursor:'pointer'}}
                  >
    {passwordConfirmVisible ? <i className="fa fa-eye" aria-hidden="true"/> :
        <i className="fa fa-eye-slash" aria-hidden="true"/>
    }</span>
                </div>
              </div>
                <Button
                  block
                  className="brand-btn h-50px"
                  type="submit"
                  disabled={inProcess}
                >
                  {inProcess && (
                    <Spinner animation="border" variant="light" />
                  )}
                  {!inProcess && "Reset Password"}
                </Button>
                <div className="mt-4">
                  <span onClick={(e) =>
                    history.push({
                      pathname: "/auth/login",
                    })} className="brand-color cursor-pointer"
                  >
                    {t("Back to Login")} ?
                </span>
                </div>

            </form>
          </div>
        </div>
        </div>
    </div>
  );
}

ResetPassword.propTypes = {
  passwordReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  password_reset: state.data.password_reset,
  error_details: state.data.error_details,
  location: state.data.location,
  white_label: state.data.white_label,
});

export default connect(mapStateToProps, { passwordReset })(ResetPassword);
