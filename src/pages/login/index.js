
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {userLogin, setErrorLog, dispatchUserDetails} from "actions/postActions";
import "./css/index.scss";
import OtpScreen from "./components/otpScreen";
import {login} from "services/authService";
import {globalAlert, globalAlertTypes} from "modules/alert";
import {clearTempUserData, storeTempUserData} from "actions/userManagementActions";
import Loader from 'components/loader'
import {dispatchUserAuthentication} from "../../actions/authActions";
import {hostChecker} from "../../utils";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import { useForm } from "react-hook-form";
import Button from "components/button";
import {PARTNER_ID} from "../../actions/types"

export function Login(props) {
    const { history } = props;
    const host = hostChecker()
    const [email, setEmail] = useState();
    const [authSuccess, setAuthSuccess] = useState(false);
    const [validatingCredentials, setValidatingCredentials] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({reValidateMode: 'onChange',});
    const location = useHistory();
    const { t } = useTranslation();

    const triggerLogin = ({email, password})=>{
        const p = {email, password }
        setValidatingCredentials(true)
        login(p)
            .then(res=>{
                    setValidatingCredentials(false);
                    if (res.changePassword){
                        return location.push('/auth/password/change/'+res.token)
                    }
                    if (res.responseCode === '00'){    
                        if(host === "seerbit" && res?.payload?.partnerId !== Number(PARTNER_ID)){
                            setValidatingCredentials(false)
                            globalAlert('Invalid Credentials', globalAlertTypes.error)
                            return
                        }
                        else if(host === "budpay" && res?.payload?.partnerId !== Number(PARTNER_ID)){
                            setValidatingCredentials(false)
                            globalAlert('Invalid Credentials', globalAlertTypes.error)
                            return
                        }
                        else if(host === "sabi" && res?.payload?.partnerId !== Number(PARTNER_ID)){
                            setValidatingCredentials(false)
                            globalAlert('Invalid Credentials', globalAlertTypes.error)
                            return
                        }
                        else if(host === "parallex" && res?.payload?.partnerId !== Number(PARTNER_ID)){
                            setValidatingCredentials(false)
                            globalAlert('Invalid Credentials', globalAlertTypes.error)
                            return
                        }


                        if (res.payload.hasOwnProperty('changePassword') && res.payload.changePassword){
                            return history.push('/auth/password/change/'+res.payload.token)
                        }
                        if (res.payload.hasOwnProperty('mfa')){
                            if (res.payload.mfa === "Y"){
                                props.storeTempUserData({...res.payload, pCode:password})
                                setAuthSuccess(true)
                            }else{
                                props.dispatchUserAuthentication(res)
                            }
                        }else{
                            props.dispatchUserAuthentication(res)
                        }
                    }else{
                        globalAlert(res.message ? res.message : 'An Error Occurred while Authenticating your account. Kindly try again', globalAlertTypes.error)
                    }
                }
            ).catch(e=>{


            setValidatingCredentials(false);
            if (e.hasOwnProperty('response')){
                globalAlert(e.response ? e.response.data.message :
                    'An Error Occurred while Authenticating your account. Kindly try again', globalAlertTypes.error)
            }else{
                globalAlert(e.message ? e.message : 'An Error Occurred while Authenticating your account. Kindly try again', globalAlertTypes.error)
            }

        })
    }

    const togglePasswordVisibility = ()=>{
        setPasswordVisible(!passwordVisible)
    }

    useEffect( ()=>{
        //  emailInput.current.focus();
    }, [])

    const onSubmit = data => triggerLogin(data);

    return (
        <div className="d-flex justify-content-between sbt-login pt-5">
            <div className="auth--container pt-5">
                <div className="text-center">
                    <img
                        src={hostChecker() === 'seerbit' ? 'https://assets.seerbitapi.com/images/seerbit_logo_type.png' : `https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                        as="a"
                        href="https://seerbit.com/"
                        target="_blank"
                        className="auth-logo"
                    />
                </div>
                <div
                    className="auth--section row"
                >
                    <div
                        className="col-sm-12 col-md-3"
                    >
                        {
                            !authSuccess ?
                                <form
                                    className="w-100"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <div className="py-3 mb-1 text-center">
                                        <div id="welcome" className="title">{t("Welcome back")}!</div>
                                        <div className="sub-heading">{t("Login to your account")}.</div>
                                    </div>
                                    <div className="py-3">
                                        <input
                                            autoComplete="on"
                                            style={{ display: "none" }}
                                            id="fake-hidden-input-to-stop-google-address-lookup"
                                        />
                                        <div className={"form-outline mb-3"}>
                                            <label htmlFor="email">{t("Email")}</label>
                                            {errors.email?.type === 'required' && <span className="err-txt mb-3 ml-2">A valid Email is required</span>}
                                            <input
                                                autoComplete="off"
                                                id="email"
                                                name="email"
                                                type="email"
                                                disabled={validatingCredentials}
                                                className={
                                                    email
                                                        ? `form-control py-0 hasEmail ${errors.email ? 'notTrue' : ''}`
                                                        : `form-control py-0 seerbit-login-email ${errors.email ? 'notTrue' : ''}`
                                                }
                                                {...register("email", { required: true, pattern: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/ })}

                                                // autoFocus
                                                // ref={emailInput}
                                            />
                                        </div>

                                        <div className={"form-outline mb-3"}>
                                            <label className="password-label" htmlFor="password">{t("Password")}</label>
                                            {errors.password?.type === 'required' && <span className="err-txt mb-3 ml-2">Password  is required</span>}
                                            <input
                                                autoComplete="new-password"
                                                name="password"
                                                id="password"
                                                type={passwordVisible ? 'text' : 'password'}
                                                disabled={validatingCredentials}
                                                className={`form-control py-0 seerbit-login-password ${errors.password ? 'notTrue': ''}`}
                                                {...register("password", { required: true } )}

                                            />

                                            <span className="toggle-password-visibility" onClick={()=>togglePasswordVisibility()}>
                      {passwordVisible ? <i className="fa fa-eye" aria-hidden="true"/> :
                          <i className="fa fa-eye-slash" aria-hidden="true"/>
                      }</span>
                                        </div>
                                        <div className="mt-4">
                   <span>
                     <a href="/#/auth/recover-password" className="brand-color">
                       {t("Forgot Password?")}
                     </a>
                   </span>
                                        </div>
                                    </div>
                                    <Button
                                        full
                                        size='lg'
                                        type="submit"
                                        disabled={validatingCredentials}
                                    >
                                        {validatingCredentials && <Loader type={'login'} />}
                                        {!validatingCredentials && t("Login")}
                                    </Button>
                                    <div className="">
                                        <div className="mt-3">
                   <span className="" style={{ color: "#000" }}>
                    {t("Don't have an account")}?
                     <span
                         className="link cursor-pointer brand-color"
                         onClick={(e) =>
                             !validatingCredentials && history.push({
                                 pathname: "register",
                             })
                         }
                     > {' '}
                         {t("Sign up")}
                     </span>
                   </span>
                                        </div>
                                    </div>
                                </form>
                                : <OtpScreen
                                    back={ ()=> setAuthSuccess(false)}
                                    userDataTemp={props.user_data_temp}
                                    dispatchUserDetails={props.dispatchUserAuthentication}
                                />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    userLogin: PropTypes.func.isRequired,
    setErrorLog: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    error_details: state.data.error_details,
    location: state.data.location,
    white_label: state.data.white_label,
    user_data_temp: state.userManagement.user_data_temp,
});

export default connect(mapStateToProps, { userLogin, setErrorLog,dispatchUserDetails,storeTempUserData,clearTempUserData,dispatchUserAuthentication })(Login);
