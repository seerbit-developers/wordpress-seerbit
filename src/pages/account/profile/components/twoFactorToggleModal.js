import React from 'react';
import {Spinner} from 'react-bootstrap';
import Button from "components/button";
import AppModal from "components/app-modal";
import AuthCode from "react-auth-code-input";

const TwoFactorToggleModal = ({isOpen,close,status,save, process})=>{
    const [otp, setOtp] = React.useState('');
    React.useEffect( ()=>{
        setOtp('');
    }, []);
    return (
        <AppModal
            title='Two Factor Authentication configuration'
            description={'Enter the code sent to your email address'}
            isOpen={isOpen}
            close={close}
            centered>
            <div className='pt-0 text-center'>

                <div className="p-3">
                    <AuthCode
                        allowedCharacters='numeric'
                        isPassword={true}
                        autoFocus={true}
                        onChange={ e => setOtp(e)}
                        inputClassName={'otp_input'}
                        loading={ process}
                        disabled={process}
                        containerClassName='otp_input_container my-3'
                    />
                </div>
                <Button
                    onClick={()=>save(otp)}
                    buttonType='button'
                    size='md'
                    full
                >
                    { process ?
                        <Spinner animation="border" size="sm" variant="light"  disabled={process}/> : <span>{status ? 'Disable' : 'Enable'}</span>
                    }
                </Button>
            </div>
        </AppModal>
    );
}

export default TwoFactorToggleModal;
