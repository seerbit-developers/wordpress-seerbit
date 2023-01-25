import React, {useEffect, useState} from "react";
import verify from "utils/strings/verify";
import validate from "utils/strings/validate";
import {Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import styled from "styled-components";
import {
    dispatchUpdateProfile,
    recoverPassword,
    setErrorLog,
    updateUser
} from "../../../actions/postActions";
import {
    saveTwoFactorCode
} from "../../../actions/userManagementActions";
import Button from "components/button";
import AppToggle from "components/toggle";
import {
    generateTwoFactorAuthBarCode,
    requestPasswordReset,
    validateMfa,
    generateOtpForApproval,
    updateTwoFactorAuth
} from "../../../services/userManagementService";
import TwoFactorDetailsModal from "./components/twoFactorDetailsModal";
import TwoFactorToggleModal from "./components/twoFactorToggleModal";
import {alertSuccess, alertError, alertExceptionError} from "modules/alert";
import {useTranslation} from "react-i18next";
const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1;
  font-weight: normal;
  margin-top: .2em;
`;


export function PersonalDetails({saveTwoFactorCode, ...props}) {
    const [personalProcess, setPersonalProcess] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (props.user_details && props.location === "personal_information") {
            alertSuccess("Success");
            setPersonalProcess(false);
            props.setErrorLog();
            // if (history.goBack) history.goBack();
        }
        if (
            props.error_details &&
            props.error_details.error_source === "personal_information"
        ) {
            alertError(props.error_details.message);
            setPersonalProcess(false);
            props.setErrorLog();
        }
        if (
            props.error_details &&
            props.error_details.error_source === "emailnotification"
        ) {
            alertError(props.error_details.message);
        }
        if (props.location === "emailnotification" && props.recover_password) {
            alertSuccess(`An email has been sent to ${props.user_details.email}`);
        }
    }, [
        props.location,
        props.error_details,
        props.recover_password,
        props.user_details,
        props.recover_password,
    ]);

    const [is_developer, setIsDeveloper] = useState(props.user_details.is_developer);
    const [first_name, setFirstName] = useState(props.user_details.first_name);
    const [last_name, setLastName] = useState(props.user_details.last_name);
    const [phone_number, setPhoneNumber] = useState(props.user_details.phone_number);
    const [firstNamePass, setFirstNamePass] = useState(true);
    const [lastNamePass, setLastNamePass] = useState(true);
    const [phoneNumberPass, setPhoneNumberPass] = useState(true);
    const [editMode, setEitMode] = useState(false);
    const [requestNewPassword, setRequestNewPassword] = useState(false);
    const [generatingTwoFactorAuthBarCode, setGeneratingTwoFactorAuthBarCode] = useState(false);
    const [showTwoFactorDetailsModal, setShowTwoFactorDetailsModal] = useState(false);
    const [showTwoFactorToggleModal, setShowTwoFactorToggleModal] = useState(false);
    const [validatingTwoFactor, setValidatingTwoFactor] = useState(false);
    const [twoFactorDetails, setTwoFactorDetails] = useState(null);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorConfigured, setTwoFactorConfigured] = useState(false);
    const [generatingOtp, setGeneratingOtp] = useState(false);
    const handleFirstName = (e) => {
        var thenum = e.target.value.match(RegExp(verify.name, "i"), "");
        if (thenum !== null) {
            setFirstName(thenum[0]);
            setFirstNamePass(RegExp(validate.name, "i").test(thenum[0]));
        }
    };

    const handleLastName = (e) => {
        var thenum = e.target.value.match(RegExp(verify.name, "i"), "");
        if (thenum !== null) {
            setLastName(thenum[0]);
            setLastNamePass(RegExp(validate.name, "i").test(thenum[0]));
        }
    };

    const handlePhoneNumber = (e) => {
        var thenum = e.target.value.match(RegExp(verify.number), "");
        if (thenum !== null) {
            setPhoneNumber(thenum[0]);
            setPhoneNumberPass(RegExp(validate.number).test(thenum[0]));
        }
    };

    const initProcess = (
        phone_number,
        first_name,
        last_name,
        is_developer
    ) => {
        setPersonalProcess(false);
        if (!firstNamePass) {
            setFirstNamePass(false);
        } else if (!lastNamePass) {
            setLastNamePass(false);
        } else if (!phoneNumberPass) {
            setPhoneNumberPass(false);
        } else {
            setFirstNamePass(true);
            setLastNamePass(true);
            setPhoneNumberPass(true);
            const params = {
                data: {
                    first_name,
                    last_name,
                    phone_number,
                    is_developer,
                },
                location: "personal_information",
            };
            setPersonalProcess(true)
            props.updateUser(params)
            // setProcessProfileUpdate(true);
            // updateProfile(params.data).then(res=>{
            //     dispatchUpdateProfile(res.payload)
            //     setProcessProfileUpdate(false);
            //     if(res.responseCode == '00'){
            //         globalAlert('Your profile has been updated successfully', globalAlertTypes.success)
            //     }else{
            //         globalAlert(res.message ? res.message : 'An Error Occurred while updating your profile. Kindly try again', globalAlertTypes.error)
            //     }
            // }).catch(e=>{
            //     globalAlert(e.message ? e.message : 'An Error Occurred while updating your profile. Kindly try again', globalAlertTypes.error)
            //     setProcessProfileUpdate(false);
            // })
        }
    };

    const getNewPassword = ()=>{
        setRequestNewPassword(true)
        const p ={email:props.user_details.email}
        requestPasswordReset(props.user_details.email,p).then(res=>{
            setRequestNewPassword(false)
            if (res.responseCode === '00'){
                alertSuccess('Request Successfully Sent. You will receive an email with further instructions')
            }else{
                alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
            }
        }).catch(e=>{
            alertExceptionError(e)
            setRequestNewPassword(false)
        })
    }

    const resetTwoFactorAuthBarCode = ()=>{
            setGeneratingTwoFactorAuthBarCode(true)
            generateTwoFactorAuthBarCode({"email": props.user_details.email}).then(res=>{
                setGeneratingTwoFactorAuthBarCode(false)
                if (res.responseCode === 201){
                    setShowTwoFactorDetailsModal(true)
                }else{
                    alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                }
            }).catch(e=>{
                alertExceptionError(e)
                setGeneratingTwoFactorAuthBarCode(false)
            })
    }

    const onValidateTwoFactorAuth = (otp)=>{
        setValidatingTwoFactor(true)
        validateMfa(
            {
                "email": props.user_details.email,
                "otp": otp
            }).then(res=>{
            setValidatingTwoFactor(false)
            const copyUser = JSON.parse(JSON.stringify(props.user_details))
            copyUser.mfa = twoFactorEnabled ? "N" : "Y"
            if (res.responseCode == 200 && res.responseMessage == "true" ){
                props.dispatchUpdateProfile(copyUser)
                setShowTwoFactorDetailsModal(false)
                alertSuccess(`Two Factor Authentication has been ${twoFactorEnabled ? 'Disabled' : 'Enabled'}`)
            }else{
                alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
            }
        }).catch(e=>{
            setValidatingTwoFactor(false);
            alertExceptionError(e)
        })
    }

    const editTwoFactorAuth = (otp)=>{
        setValidatingTwoFactor(true)
        updateTwoFactorAuth(
            {
                "email": props.user_details.email,
                "otp": otp,
                "mfa": twoFactorEnabled ? "N" : "Y"
            }).then(res=>{
            setValidatingTwoFactor(false)
            const copyUser = JSON.parse(JSON.stringify(props.user_details))
            copyUser.mfa = twoFactorEnabled ? "N" : "Y"
            if (res.responseCode == 201){
                props.dispatchUpdateProfile(copyUser)
                setShowTwoFactorToggleModal(false)
                alertSuccess(`Two Factor Authentication has been ${twoFactorEnabled ? 'Disabled' : 'Enabled'}`)
            }else{
                alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
            }
        }).catch(e=>{
            setValidatingTwoFactor(false);
            alertExceptionError(e)
        })
    }

    const toggleTwoAuthFactorStatus = ()=>{
        setGeneratingOtp(true);
        generateOtpForApproval({
            email: props.user_details.email
        }).then(res=>{
            console.log('res', res)
            setGeneratingOtp(false);
            setShowTwoFactorToggleModal(true);
        }).catch(e=>{
            setGeneratingOtp(false);
            alertError(e.message)
        })

    }
    useEffect( ()=>{
        if (props.user_details){
            if (props.user_details.hasOwnProperty('mfa')){
                if(props.user_details.mfa === "Y"){
                    setTwoFactorConfigured(true);
                    setTwoFactorEnabled(true);
                }
                else if (props.user_details.mfa === "N"){
                    setTwoFactorConfigured(true);
                    setTwoFactorEnabled(false);
                }
                else if (!props.user_details.mfa){
                    setTwoFactorConfigured(false);
                    setTwoFactorEnabled(false);
                }
            }else{
                setTwoFactorEnabled(false)
            }
        }
    }, [props.user_details]);

    return (
        <div className="configuration__container mt-5">
            {/*<ChangePasswordModal isOpen={editPassword} close={ () => setEditPassword(false)}/>*/}
            <TwoFactorDetailsModal
                isOpen={showTwoFactorDetailsModal}
                close={ ()=> setShowTwoFactorDetailsModal(false)}
                status={true}
                process={generatingTwoFactorAuthBarCode || validatingTwoFactor}
                data={twoFactorDetails}
                validate={onValidateTwoFactorAuth}
            />

            <TwoFactorToggleModal
                isOpen={showTwoFactorToggleModal}
                close={ ()=> setShowTwoFactorToggleModal(false)}
                process={validatingTwoFactor}
                save={editTwoFactorAuth}
                status={twoFactorEnabled}
            />

            <div className="d-flex justify-content-end">
                <Button text={editMode ? 'Done' : 'Edit'}
                        type={editMode ? 'white' : 'secondary'}
                        size="sm"
                        as="button" onClick={ ()=> setEitMode(!editMode)}/>
            </div>
            <form
                className="w-100"
                onSubmit={(e) => {
                    e.preventDefault();
                    initProcess(phone_number, first_name, last_name, is_developer);
                }}
            >
                <div className={`col-md-12 configuration__item`}>
                    <label className="form__control--label--lg">{t('First Name')}</label>
                    <input
                        className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                        type="text"
                        name="first_name"
                        placeholder={t('Enter Your First Name')}
                        onChange={(e) => handleFirstName(e)}
                        value={first_name}
                    />
                    {!firstNamePass && first_name && <Error>{t('enter a valid name')}</Error>}
                    <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`}/>
                </div>
                <div className={`col-md-12 configuration__item`}>
                    <label className="form__control--label--lg">{t('Last Name')}</label>
                    <input
                        className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                        type="text"
                        name="last_name"
                        placeholder={t('Enter your Last Name')}
                        onChange={(e) => handleLastName(e)}
                        value={last_name}
                    />
                    {!lastNamePass && last_name && <Error>{t('enter a valid name')}</Error>}
                    <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`}/>
                </div>
                <div className={`col-md-12 configuration__item`}>
                    <label className="form__control--label--lg">{t('Email')}</label>
                    <div><span>{props.user_details ? props.user_details.email : ""}</span></div>
                    <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`}/>
                </div>
                <div className={`col-md-12 configuration__item`}>
                    <label className="form__control--label--lg">{t('Phone Number')}</label>
                    <input
                        className={`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}
                        type="text"
                        name="phone_number"
                        placeholder={t('Enter Phone Number')}
                        onChange={(e) => handlePhoneNumber(e)}
                        value={phone_number}
                    />
                    {!phoneNumberPass && phone_number && (
                        <Error>{t('enter a valid phone number')}</Error>
                    )}
                    <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`}/>
                </div>
                <div className={`col-md-12 configuration__item`}>
                    <label className="form__control--label--lg">{t('Password')}</label>
                    <div className="float-right">
                        <Button
                            onClick={ ()=>getNewPassword()}
                            size='sm'
                            disabled={personalProcess || requestNewPassword}
                            text={requestNewPassword ?
                                <Spinner animation="border" size="sm" />: t('Request Password Reset')}
                            as="button"
                            type="secondary"
                        />
                    </div>
                    <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`}/>
                </div>
                <div className={`col-md-12 configuration__item`}>
                    <div className="d-flex justify-content-between w-100">
                        <div>
                            <label className="form__control--label--lg">2 Factor Authentication</label>
                            {twoFactorConfigured &&
                                (generatingOtp ?
                                <Spinner animation="border" size="sm"
                                         variant="secondary"/>
                             : <AppToggle active={twoFactorEnabled} onChange={toggleTwoAuthFactorStatus}/>)
                            }
                        </div>
                        {
                            !twoFactorConfigured &&
                            <div className="d-flex justify-content-between flex-column">
                                <div>
                                    <Button
                                        onClick={() => resetTwoFactorAuthBarCode()}
                                        size='sm'
                                        disabled={personalProcess || generatingTwoFactorAuthBarCode}
                                        text={generatingTwoFactorAuthBarCode ?
                                            <Spinner animation="border" size="sm"
                                                     variant="light"/> : 'Configure Two Factor Authentication'}
                                        as="button" buttonType='submit' type="secondary"/>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={`input__border--bottom ${editMode ? 'no-border' : ''}`}/>
                </div>
                <div className={`col-md-12 configuration__item`}>
                    <div className="form-inline">
                        <label className="form__control--label--lg">{t('Are you a developer')}?</label>
                        <input
                            type="checkbox"
                            className="font-32 ml-2"
                            onChange={(e) => setIsDeveloper(e.target.checked)}
                            checked={is_developer}
                        />
                    </div>

                </div>
                <div className="float-right">
                    <Button
                        disabled={personalProcess}
                        size='md'
                        text={personalProcess ?
                            <Spinner animation="border" size="sm"/>: t('Save')}
                        as="button"/>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    error_details: state.data.error_details,
    location: state.data.location,
    recover_password: state.data.recover_password,
    two_factor_code: state.userManagement.two_factor_code,
});

export default connect(mapStateToProps, {
    updateUser,
    recoverPassword,
    setErrorLog,
    dispatchUpdateProfile,
    saveTwoFactorCode
})(PersonalDetails);
