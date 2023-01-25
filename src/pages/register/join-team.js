/**
 * Register
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { completeRegistration } from "../../actions/postActions";
import { Button, OverlayTrigger, Spinner } from "react-bootstrap";
import { popover } from "../../modules/password_guide";
import "./css/index.scss";
import SeerBitAdverts from "../../components/seerbitAdverts";
import {completeInvite} from "../../services/authService";
import {alertError, alertExceptionError} from "../../modules/alert";
import {useTranslation} from "react-i18next";
import {hostChecker} from "../../utils";

export function Register(props) {
  const { history } = props;
  const [inProcess, setInProcess] = useState(false);
  const [value, setValue] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation();

  const handleValue = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const initAuthorization =  (e) => {
    e.preventDefault();
    completeInvite(
        'auth/completeregistration/'+props.match.params.link,
        {
      ...value,
      password_confirmation: value.password,
      is_developer: false
    })
        .then((res) => {
          setInProcess(false);
          if (res.responseCode === "00") {
            window.location.href = '/'
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
      <div className="p-0 d-flex justify-content-between sbt-reset align-items-center" style={{height:'100vh'}}>
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
                  initAuthorization(e);
                }}
              >
                <input autoComplete="on" style={{ display: 'none' }}
                  id="fake-hidden-input-to-stop-google-address-lookup" />
                <div className="p-3 mb-1 text-center">
                  <div className="title" >{t("Join your team")}</div>
                  <div className="sub-heading">{t("You are a minute away from joining your team on SeerBit")}.</div>
                </div>
                <div className="p-3">
                  <div className="form-outline mb-3">
                    <input
                      name="first_name"
                      type="text"
                      autoComplete="off"
                      className={value && value.first_name ? `form-control has-first` : `form-control seerbit-first`}
                      onChange={(e) => handleValue(e)}
                      value={value && value.first_name}
                      required
                    />
                    <label className="form-label">{t("First Name")}</label>
                  </div>
                  <div className="form-outline mb-3">
                    <input
                      name="last_name"
                      type="text"
                      autoComplete="off"
                      className={value && value.last_name ? `form-control has-last` : `form-control seerbit-last`}
                      onChange={(e) => handleValue(e)}
                      value={value && value.last_name}
                      required
                    />
                    <label className="form-label">{t("Last Name")}</label>
                  </div>
                  <div className="form-outline mb-3">
                    <input
                      name="email"
                      type="email"
                      autoComplete="off"
                      className={value && value.email ? `form-control has-email` : `form-control seerbit-email`}
                      onChange={(e) => handleValue(e)}
                      value={value && value.email}
                      required
                    />
                    <label className="form-label">{t("Email")}</label>
                  </div>
                  <OverlayTrigger
                    trigger="focus"
                    placement="right"
                    overlay={popover(value && value.password)}
                  >
                    <div className="form-outline mb-3">
                      <input
                        autoComplete="new-password"
                        name="password"
                        type={passwordVisible ? 'text' : 'password'}
                        className={value && value.password ? `form-control has-password` : `form-control seerbit-login-password`}
                        onChange={(e) => handleValue(e)}
                        value={value && value.password}
                        required
                      />
                      <label className="form-label">{t("Password")}</label>
                      <span className="toggle-password-visibility" onClick={()=>togglePasswordVisibility()}
                            style={{position:'absolute', top:17, right:10, cursor:'pointer'}}
                      >
    {passwordVisible ? <i className="fa fa-eye" aria-hidden="true"/> :
        <i className="fa fa-eye-slash" aria-hidden="true"/>
    }</span>
                    </div>
                  </OverlayTrigger>
                </div>
                <div className="col-12">
                  <Button
                    block
                    className="brand-btn h-50px"
                    type="submit"
                    disabled={inProcess}
                  >
                    {inProcess && (
                      <Spinner animation="border" variant="light" />
                    )}
                    {!inProcess && t("Join Team")}
                  </Button>
                  <div className="mt-3">
                    <div className="mb-3 font-13">
                      <span>
                        {t("By clicking 'Get started', I agree to the Merchant Service Agreement")}, <a
                          href='https://seerbit.com/terms.html'
                          target='_blank'
                          className='seerbit-color'
                        >{t("Terms of service")}	</a> {t("and")}  <a
                          href="https://seerbit.com/privacy.html"
                          target="_blank"
                          className="seerbit-color"
                        >{t("Privacy Policy")}.
                        </a>
                      </span>
                    </div>
                    <span>
                      {t("Already have an account?")}{" "}
                      <span
                        className="link cursor-pointer brand-color"
                        onClick={(e) =>
                          history.push({
                            pathname: "/auth/login",
                          })
                        }
                      >
                        {t("Login")}
                      </span>
                    </span>
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
  completeRegistration: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  error_details: state.data.error_details,
  location: state.data.location,
  white_label: state.data.white_label,
});

export default connect(mapStateToProps, { completeRegistration })(Register);
