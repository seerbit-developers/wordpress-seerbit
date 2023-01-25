import React, {useEffect, useRef, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import Button from "components/button";
import AppModal from "components/app-modal";
import AuthCode from "react-auth-code-input";
// import OtpMark from "assets/images/svg/OtpMark";
// import {useCountdown} from "../../../../hooks";

const TwoFactorDetailsModal = ({isOpen=false,close,data,process,authenticating,validate})=>{
    const [otp, setOtp] = useState('');
    const AuthInputRef = useRef(null);
    // const [days, hours, minutes, seconds] = useCountdown(new Date())
    return (
        <AppModal title='Enable 2-Factor Authentication' isOpen={isOpen} close={close} centered
                  description={'Enter the code sent to your email address'}>
            <div className='pt-0 text-center'>

                <div className="p-3 d-flex justify-content-center flex-column">
                    {/*<div className='text-danger font-18'>*/}
                    {/*    <span>{minutes}</span>*/}
                    {/*    <span>{seconds}</span>*/}
                    {/*</div>*/}
                    <div className="p-3">
                        {/*<input*/}
                        {/*    className={`d-block form__control--full`}*/}
                        {/*    type="text"*/}
                        {/*    name="otp"*/}
                        {/*    placeholder="OTP(One Time Password)"*/}
                        {/*    disabled={authenticating || process}*/}
                        {/*    onChange={(e) => setOtp(e.target.value)}*/}
                        {/*    value={otp}*/}
                        {/*/>*/}
                        <AuthCode
                            allowedCharacters='numeric'
                            ref={AuthInputRef}
                            isPassword={true}
                            autoFocus={true}
                            onChange={ e => setOtp(e)}
                            inputClassName={'otp_input'}
                            loading={authenticating || process}
                            disabled={authenticating || process}
                            containerClassName='otp_input_container my-3'
                        />
                    </div>
                </div>
                <div>
                <Button
                    onClick={()=>validate(otp)}
                    buttonType='button'
                    size='md'
                    full
                >
                    { process || authenticating ?
                        <Spinner animation="border" size="sm" variant="light"  disabled={process}/> : <span>Confirm</span>
                    }
                </Button>
                </div>
            </div>
        </AppModal>
    );
}

export default TwoFactorDetailsModal;
