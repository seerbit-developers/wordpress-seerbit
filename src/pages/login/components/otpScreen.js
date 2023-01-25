import React, { useRef, useState} from "react";
import { Spinner} from "react-bootstrap";
import {withRouter} from "react-router";
import {useTranslation} from "react-i18next";
import AuthCode from 'react-auth-code-input';
import { useSelector } from "react-redux";
import {validateOtp} from "services/authService";

const OtpScreen = ({back,dispatchUserDetails})=>{
    const AuthInputRef = useRef(null);
    const [hasBackUpCode, setHasBackUpCode] = useState(false);
    const [isValidInput, setIsValidInput] = useState(true);
    const [validatingOtp, setValidatingOtp] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const {t} = useTranslation()
    const {user_data_temp} = useSelector(state=> state.userManagement)

    const validate = (code)=>{
        const p = {
            "email": user_data_temp.email,
            "otp": code,
            "password": user_data_temp.pCode
        }
                validateOtp(p)
                    .then(res=>{
                        console.log('otp response', res)
                        setValidatingOtp(false);
                        if (res.responseCode == '00'){
                            dispatchUserDetails(res)
                        }else{
                            console.log('not 00')
                            AuthInputRef.current?.clear();
                            setError("Invalid OTP. Ensure you are using the code sent to your email")
                            setIsValidInput(false)
                        }})
                    .catch(e=>{
                        console.log('exception', e)
                        AuthInputRef.current?.clear();
                        setIsValidInput(false)
                        setError("Invalid OTP. Ensure you are using the code sent to your email")
                        setValidatingOtp(false);
                    })
    }

    const updateCode = (code)=>{
        setCode(code)
        setError(null)
        setIsValidInput(true)
        if (code && code.length == 6){
            setIsValidInput(true)
            setValidatingOtp(true)
            validate(code);
        }
    }

    return (
        <form
            className="w-100"
            onSubmit={(e) => {
                e.preventDefault();
                validate();
            }}
        >
            <div className="mb-3 text-center">
                {!hasBackUpCode && <div className="sub-heading">{t("Enter the code sent to your email address")}.</div>}
                {hasBackUpCode && <div className="sub-heading">{t("Enter one of your backup codes")}.</div>}
            </div>
            <div className="d-flex justify-content-center align-items-center flex-column">
                {error &&
                    <div className='error-container my-2'>
                        <h5 className="text-danger font-12 font-bold">{error}</h5>
                    </div>
                }
                    <AuthCode
                        allowedCharacters='numeric'
                        ref={AuthInputRef}
                        isPassword={true}
                        autoFocus={true}
                        onChange={ e => updateCode(e)}
                        inputClassName={'otp_input'}
                        loading={validatingOtp}
                        disabled={validatingOtp}
                        containerClassName='otp_input_container my-3'
                    />

                    <div className="mt-4">
                        {
                            validatingOtp ? <Spinner animation="border" variant="light" size='xs' />
                            :
                                <div className="d-flex justify-content-between">
                                    <span onClick={() => back()} className="brand-color cursor-pointer">
                                       {t("Back to Login")}
                                    </span>
                                </div>
                        }

                    </div>
                </div>

        </form>
    )
}

export default withRouter(OtpScreen);
