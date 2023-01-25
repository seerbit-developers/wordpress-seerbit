import React, {useState} from "react";
import Button from "components/button";
import {Spinner} from "react-bootstrap";
import AppModal from "components/app-modal";
import {useForm} from "react-hook-form";

const ChangePasswordModal = ({isOpen,close})=>{
    const [process, setProcess] = useState(false);
    const { register, handleSubmit, control,setError,trigger, formState: { errors } } = useForm();
    const onSubmit = (data)=>{
        // if (data){
        //     if (!role){
        //         setError("role", {
        //             type: "manual",
        //             message: "A role is required for the Invitee"
        //         });
        //     }else{
        //         const r = businessRoles.find(item => item.value == role)
        //         const p = {
        //             invitee_email: data.email,
        //             invitee_firstname: data.fullName,
        //             role:r.label,
        //         }
        //         onInvite(p)
        //     }
        // }

    }

    const validatePassword = (password)=>{
        console.log(password)
        if (/^(?=.*[A-Za-z])$/.test(password) === false){
            return "Must contain at least one character"
        } else if (/^(?=.*[@$!%*#?&])$/.test(password) === false){
            return "Must contain at least one special character"
        }else if (!/^(?=.*\d)$/.test(password) === false){
            return "Must contain at least one number"
        }else if (!/^(?=.*\d)$/.test(password) === false){
            return "Must contain at least one number"
        }else if (!/^[A-Za-z\d@$!%*#?&]{8,}$/.test(password === false)){
            return "Must contain a minimum of 8 characters"
        }
        else{
            return false
        }
    }

    return (
        <AppModal title="Change Password" isOpen={isOpen} close={ ()=> close()}>
            <form
                className="w-100"
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="d-flex flex-column justify-content-between ">
                    <div className={`mb-3 mt-5`}>
                        <label htmlFor="current_password">Current Password</label>
                        {errors.current_password && <span className="text-danger pl-2">{errors.current_password.message}</span>}
                        <input
                            className={`d-block form__control--full`}
                            type="password"
                            name="current_password"
                            autoComplete="off"
                            ref={register({
                                required: "Your current password is required"})}
                        />
                    </div>
                    <div className={`mb-3`}>
                        <label htmlFor="new_password">New Password</label>
                        {errors.new_password && <span className="text-danger pl-2">{errors.new_password.message}</span>}
                        <input
                            className={`d-block form__control--full`}
                            type="password"
                            name="new_password"
                            autoComplete="off"
                            ref={register({
                                // required: "A New password is required",
                                validate: (v)=>validatePassword(v)
                            })}
                        />
                    </div>
                    <div className={`mb-3`}>
                        <label htmlFor="password_confirmation">Repeat New Password</label>
                        {errors.password_confirmation && <span className="text-danger pl-2">{errors.password_confirmation.message}</span>}
                        <input
                            className={`d-block form__control--full`}
                            type="password"
                            name="password_confirmation"
                            autoComplete="off"
                            ref={register({
                                required: "Password confirmation is required",
                                pattern: {
                                    value:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                    message:"A Minimum of eight characters, at least one letter, number and one special character"
                                }
                            })}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <Button text={process ?
                        <Spinner animation="border" size="sm" variant="light"  disabled={process}/>: 'Save Password'}
                            as="button" buttonType='submit'/>
                </div>
            </form>
        </AppModal>
    )
}

export default ChangePasswordModal
