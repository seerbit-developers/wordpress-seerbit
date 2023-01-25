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
import {recoverUserPassword, resetUserPassword, changePassword} from "../../services/authService";
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {hostChecker} from "../../utils";
import {useTranslation} from "react-i18next";


export function ChangePassword(props) {
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
            password
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

        setInProcess(true)
        setPasswordVisible(false)
        setPasswordConfirmVisible(false)
        changePassword(`auth/user/merchant/password`, p, props.match.params.auth)
            .then(res=>{
                    setInProcess(false);
                    if (res.responseCode === '00'){
                        alertSuccess(`Password change successful`);
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    }else{
                        alertError(res.message ? res.message : 'An unexpected Error Occurred. Kindly try again.')
                    }
                }
            ).catch(e=>{
            setInProcess(false);
            alertExceptionError(e)
        })
    }

    useEffect( ()=>{
        passInput.current.focus();
    }, []);

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
                                    send(password_confirmation, password);
                                }}
                            >
                                <div className="p-3 mb-1 text-center">
                                    <div className="title" >{t("Create a new password")}</div>
                                    <p>{t("You are required to change your password")}</p>
                                </div>
                                <div className="p-3" >
                                    <label>{t("New Password")}</label>
                                    <div className="form-outline mb-3">
                                        <input
                                            autoComplete="new-password"
                                            name="password"
                                            type={passwordVisible ? 'text' : 'password'}
                                            // placeholder="New Password"
                                            className={password ? `form-control hasPassword` : `form-control seerbit-login-password`}
                                            onChange={(e) => handlePassword(e)}
                                            // value={password}
                                            required
                                            autoFocus
                                            ref={passInput}
                                        />
                                        <span className="toggle-password-visibility" onClick={()=>setPasswordVisible(!passwordVisible)}
                                              style={{position:'absolute', top:17, right:10, cursor:'pointer'}}
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
                                              style={{position:'absolute', top:42, right:10, cursor:'pointer'}}
                                        >
    {passwordConfirmVisible ? <i className="fa fa-eye" aria-hidden="true"/> :
        <i className="fa fa-eye-slash" aria-hidden="true"/>
    }</span>
                                    </div>
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
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </div>
    );
}

ChangePassword.propTypes = {
    passwordReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    password_reset: state.data.password_reset,
    error_details: state.data.error_details,
    location: state.data.location,
    white_label: state.data.white_label,
});

export default connect(mapStateToProps, { passwordReset })(ChangePassword);
