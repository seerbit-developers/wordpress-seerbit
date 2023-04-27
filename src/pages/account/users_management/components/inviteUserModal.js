import React from "react";
import AppModal from "components/app-modal";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import Button from "components/button";
import { useForm, Controller } from "react-hook-form";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {Spinner} from "reactstrap";
const InviteUserModal = ({ isOpen, close, businessRoles, onInvite, processInvite, onSuccess, setOnSuccess }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, control,reset, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        if (data) {
                // const r = businessRoles.find(item => item.value == role)
                const p = {
                    invitee_email: data.email,
                    invitee_firstname: data.fullName,
                    role: data.role.name,
                }
                onInvite(p)
        }
    }

   React.useEffect( ()=>{
       if (onSuccess){
           reset();
           setOnSuccess(false)
       }
   }, [onSuccess])
    return (
        <AppModal title="Invite a Team Member" isOpen={isOpen} close={() => close(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="fullName">{t('Name')}</label>
                    {errors.fullName && <span className="text-danger pl-2">{errors.fullName?.message}</span>}
                    <input className="form__control--full"
                        type="text"
                           name='fullName'
                        disabled={processInvite}
                        {...register('fullName',{
                            required: t('Invitee Full Name field is required'),
                            maxLength: {
                                value: 90,
                                message: t('Maximum character input is 90')
                            },
                            minLength: {
                                value: 2,
                                message: t('Minimum character input is 2')
                            }
                        })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fullName">{t('Email')}</label>
                    {errors.email && <span className="text-danger pl-2">{errors.email?.message}</span>}
                    <input className="form__control--full"
                        type="email"
                           name='email'
                        disabled={processInvite}
                        {...register('email', {
                            required: t("Invitee Email field is required"),
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,20}$/,
                                message: t('The entered email address is Invalid')
                            }
                        })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="role">{t('Role')}</label>
                    {/*{!role && <span className="text-danger pl-2">{ t('A role is required')}</span>}*/}
                    {errors.role && <span className="text-danger pl-2">{errors.role?.message}</span>}
                    <Controller
                        control={control}
                        rules={{ required: t('A role is required')}}
                        name='role'
                        render={({
                                     field: { onChange, onBlur, value, name, ref },
                                     fieldState: { invalid, isTouched, isDirty, error },
                                     formState,
                                 }) => (
                            <DropdownSelect containerClass="form__control--full"
                                data={businessRoles}
                                id="role"
                                value={value}
                                defaultValue={{ label: t('Select'), value: null, name:t('Select') }}
                                as={'div'}
                                onChange={onChange}
                            />
                            )}
                        />
                </div>
                <Button text={processInvite ?
                    <Spinner size='sm' color='white'/> : 'Invite'}
                    full as="button" buttonType='submit' onClick={() => onSubmit()} size='md'/>

            </form>
        </AppModal>
    )
}

InviteUserModal.propTypes = {
    isOpen: PropTypes.bool,
    processInvite: PropTypes.bool,
    close: PropTypes.func.isRequired,
    onInvite: PropTypes.func.isRequired,
    businessRoles: PropTypes.any.isRequired,
    onSuccess: PropTypes.bool.isRequired,
    setOnSuccess: PropTypes.any.isRequired,
}
export default InviteUserModal;
