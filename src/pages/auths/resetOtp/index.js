import React, {useState} from "react";
import ReactCodeInput from "react-verification-code-input";
import {Button, Spinner} from "react-bootstrap";
import styled from "styled-components";
import {resetTwoFactorAuth, validateOtp} from "services/userManagementService";
import {connect} from "react-redux";
import {dispatchUserDetails, userLogin} from "../../../actions/postActions";
import SeerBitAdverts from "../../../components/seerbitAdverts";
import {hostChecker} from "../../../utils";

const Title = styled.div`
   font-size: 30px;
   font-family: HelveticaNeue;
   color: #000;
 `;

const SubHeading = styled.div`
   font-family: Helvetica Neue;
   font-style: normal;
   font-weight: normal;
   font-size: 15px;
   line-height: 18px;
   color: #000;
 `;
const ResetTwoFactorOtp = ({back,userDataTemp,dispatchUserDetails,user_data_temp,history})=>{
    const [isValidInput, setIsValidInput] = useState(true);
    const [validatingOtp, setValidatingOtp] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [resettingOtp, setResettingOtp] = useState(false);
    const [data, setData] = useState(false);

    const validate = (code)=>{
        // validateOtp(code,
        //     userDataTemp ? userDataTemp.id : "")
        //     .then(res=>{
        //         setValidatingOtp(false);
        //         if (res.responseCode === '00'){
        //             dispatchUserDetails(res)
        //         }else{
        //             setError("Invalid OTP")
        //             setIsValidInput(false)
        //         }})
        //     .catch(e=>{
        //         setIsValidInput(false)
        //         setError("Invalid OTP")
        //         setValidatingOtp(false);
        //     })

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
    const resetOTp = ()=>{
        setResettingOtp(true)
        resetTwoFactorAuth(user_data_temp ? user_data_temp.id : "")
            .then(res=>{
                setResettingOtp(false)
                if (res.responseCode === '00'){
                    setData(res)
                }else{
                    setResettingOtp(false)
                }})
            .catch(e=>{
                setResettingOtp(false)
            })
    }
    React.useEffect( ()=>{
        resetOTp()
        return null;
    }, [])

    return (
        <div className="p-0">
            <div className="d-flex justify-content-between">
                <div className="auth--container">
                    <img
                        src={`https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                        as="a"
                        href="https://seerbit.com/"
                        target="_blank"
                        className="auth-logo"
                        alt="seerbit_logo" width="121"
                    />
                    <div
                        className="auth--section"
                    >
                        <div>
                            <form
                                className="w-100"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validate();
                                }}
                            >
                                <div className="mb-1">
                                    <div className="title">Reset OTP!</div>
                                    <div className="sub-heading mb-5">{t("Scan the QR Code with your Authentication Application or use the Secret Key")}</div>
                                </div>
                                <div>
                                    <img src={data ? data.barCodeUrl ? data.barCodeUrl : "" : ""}
                                         alt="two_factor_authentication_barcode"
                                         className="img-responsive"
                                    />
                                    <div className="p-3">
                                        <h5>{data ? data.secretKey ? data.secretKey : "" : ""}</h5>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-danger text-danger pb-4">{error ? error : ""}</h4>
                                    { !resettingOtp && <div className="sub-heading mb-2">Enter the new OTP generated</div>}
                                    { !resettingOtp && <ReactCodeInput
                                        type='password'
                                        fields={6}
                                        onChange={ e => updateCode(e)}
                                        isValid={isValidInput}
                                        loading={validatingOtp ? true : false}
                                        className="otp__input"
                                    />
                                    }

                                    <div className="mt-4">
                                        {
                                            validatingOtp ? <Spinner animation="border" variant="light" />
                                                :
                                                <div className="d-flex justify-content-between">
                                    <span onClick={() => history.push('/auth/login')} className="brand-color cursor-pointer">
                                        Back to Login
                                    </span>
                                                </div>
                                        }

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
               <SeerBitAdverts/>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    error_details: state.data.error_details,
    location: state.data.location,
    white_label: state.data.white_label,
    user_data_temp: state.userManagement.user_data_temp,
});

export default connect(mapStateToProps, { userLogin,dispatchUserDetails })(ResetTwoFactorOtp);

