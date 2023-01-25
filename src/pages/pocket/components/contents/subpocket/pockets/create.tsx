import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addPocketCustomer, clearState } from "actions/postActions";
import AppModal from "components/app-modal";
import Button from "components/button";
import { Spinner } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import {useTranslation} from "react-i18next";
import {ISubPocket, SubPocket} from 'models';
import {alertExceptionError, alertError, alertSuccess} from 'modules/alert';
import {createSubPocket} from 'services/pocketService';
interface ComponentProps  {
    isOpen: boolean,
    close: ()=>{},
    reload: ()=>{},
}

function CreateSubPocket(props: ComponentProps) {
    const {
        isOpen,
        close,
        reload
    } = props;
    const [newCustomer, setCustomer] = useState({});
    const [processing, setProcessing] = useState(false);
    const { t } = useTranslation();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ISubPocket>();

    const handleValue = (e) => {
        setCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    const save: SubmitHandler<ISubPocket> = (data: ISubPocket)=>{
        const payload  = new SubPocket()
        payload.firstName = data.firstName;
        payload.emailAddress = data.emailAddress;
        payload.lastName = data.lastName;
        payload.phoneNumber = data.phoneNumber;
        payload.customerExternalRef = data.customerExternalRef;

        setProcessing(true);
        createSubPocket(payload)
            .then(res=>{
                setProcessing(false);
                if (res.responseCode === '00'){
                    alertSuccess('Success')
                    reload();
                    reset();
                    close()
                }else{
                    alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                }

            })
            .catch(e=>{
                setProcessing(false)
                alertExceptionError(e)
            })
    }

    return (
        <AppModal
            title={"Create a sub-pocket"}
            isOpen={isOpen}
            close={() => close()}
        >
            <form className="w-100" onSubmit={handleSubmit(save)}>
                <div className="form-group mh-40 ">
                    <label className="font-12">{t('First Name')}</label>
                    <input
                        className="form-control mh-40 "
                        type="text"
                        name="firstName"
                        {...register("firstName", { required: true })}
                    />
                    {errors && errors.firstName && errors.firstName.type === "required" && (
                        <span className="text-danger font-12">{t("First Name is required")}</span>
                    )}
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12">{t('Last Name')}</label>
                    <input
                        className="form-control mh-40 "
                        type="text"
                        name="lastName"
                        {...register("lastName", { required: true })}
                    />
                    {errors && errors.lastName && errors.lastName.type === "required" && (
                        <span className="text-danger font-12">{t("Last Name is required")}</span>
                    )}
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12">{t('Phone Number')}</label>
                    <input
                        className="form-control mh-40 "
                        type="tel"
                        {...register("phoneNumber", { required: true, pattern:/(\+\d{2})?((\(0\)\d{2,3})|\d{2,3})?\d+/i })}
                    />
                    {errors && errors.phoneNumber && errors.phoneNumber.type === "required" && (
                        <span className="text-danger font-12">{t("Phone Number is required")}</span>
                    )}
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12">{t('Email Address')}</label>
                    <input
                        className="form-control mh-40 "
                        type="email"
                        name="emailAddress"
                        {...register("emailAddress", { required: true })}
                    />
                    {errors && errors.emailAddress && errors.emailAddress.type === "required" && (
                        <span className="text-danger font-12">{t("Email Address is required")}</span>
                    )}
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12">{t('ExternalRef(Optional)')}</label>
                    <input
                        className="form-control mh-40"
                        type="text"
                        name="customerExternalRef"
                        onChange={(e) => handleValue(e)}
                        {...register("customerExternalRef")}
                    />

                </div>

                <div className="form-group mh-40">
                    <Button
                        size="lg"
                        full
                        className="brand-btn"
                        buttonType="submit"
                        disabled={processing}
                        text={processing ?
                            <Spinner animation="border" size="sm" variant="light" /> : 'Save'}
                    />
                </div>
            </form>
        </AppModal>
    );
};

const mapStateToProps = (state) => ({
    add_pocket_customer: state.data.add_pocket_customer,
    error_details: state.data.error_details,
    location: state.data.location,
});
export default connect(mapStateToProps, {
    addPocketCustomer,
    clearState,
})(CreateSubPocket);
