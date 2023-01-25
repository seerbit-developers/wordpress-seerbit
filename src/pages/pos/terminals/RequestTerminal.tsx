/** @format */
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { requestTerminal,IRequestTerminalRequest } from "services/tmsService";
import AppModal from "components/app-modal";
import { alertExceptionError, alertSuccess, alertError } from "modules/alert";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";

const RequestTerminal = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        isOpen,
        close,
        refresh
    } = props;


    const [processing, setProcessing] = useState(false);


    const send = (data: IRequestTerminalRequest) => {
        setProcessing(true)
        requestTerminal(data).then(res => {
            if (res.responseCode == '00') {
                setProcessing(false);
                close();
                refresh();
                alertSuccess('Successful.')
            } else {
                setProcessing(false)
                alertError(
                    res.message
                        ? res.message || res.responseMessage
                        : "An error occurred while creating the plan. Kindly try again",
                    'plan_error'
                );
            }
        }).catch((e) => {
            setProcessing(false)
            alertExceptionError(e)
        });
    }


    return (
        <AppModal title={"Request POS Terminal"} isOpen={isOpen} close={() => close()}>
            <form className="w-100" onSubmit={handleSubmit(send)}>

                <div className="form-group mh-40 mb-3">
                    <label className="font-12 font-medium">Quantity</label>
                    {errors.quantity?.type === 'required' && <span className="text-danger pl-2">Quantity is required</span>}
                    {errors.quantity?.type === 'min' && <span className="text-danger pl-2">Minmum quantity is 1</span>}
                    <input
                        className="form-control mh-40 "
                        type="number"
                        {...register('quantity',{
                            required: true, min:1
                        })}
                    />
                </div>

                <div className="form-group mh-40 mb-3">
                    <label className="font-12 font-medium">Delivery Address</label>
                    {errors.address?.type === 'required' && <span className="text-danger pl-2">Address is required</span>}
                    {errors.address?.type === 'minLength' && <span className="text-danger pl-2">Address length too short</span>}
                    {errors.address?.type === 'maxLength' && <span className="text-danger pl-2">Address length too long</span>}
                    <textarea
                        type="text"
                        name="address"
                        className="form-control"
                        minLength={2}
                        maxLength={100}
                        {...register('address',{
                            required: true, minLength:5,
                            maxLength:100
                        })}
                        rows="3"
                        style={{ resize: "none" }}
                    />
                </div>
                <div className="form-group mh-40 mb-3">
                    <label className="font-12 font-medium">Extra note</label>
                    {errors.message?.type === 'required' && <span className="text-danger pl-2">Message is required</span>}
                    {errors.message?.type === 'minLength' && <span className="text-danger pl-2">Message length too short</span>}
                    {errors.message?.type === 'maxLength' && <span className="text-danger pl-2">Message length too long</span>}
                    <textarea
                        type="text"
                        className="form-control"
                        {...register('message',{
                            required: true, minLength:2,
                            maxLength:100
                        })}
                        rows="2"
                        style={{ resize: "none" }}
                    />
                </div>

                <div className="form-group mh-40 mt-4 mb-3">
                    <Button
                        variant="xdh"
                        size="lg"
                        block
                        height={"50px"}
                        className="brand-btn"
                        type="submit"
                        disabled={processing}
                    >
                        {processing && (
                            <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                        )}{" "}
                        {"Send Request"}
                    </Button>
                </div>

            </form>
        </AppModal>
    );
}

const mapStateToProps = (state) => ({
    currencies: state.data.get_allowed_currencies,
    business_details: state.data.business_details,
    error_details: state.data.error_details,
    location: state.data.location,
    loading_plans: state.data.loading_plans
});
export default connect(mapStateToProps, {

})(RequestTerminal);
