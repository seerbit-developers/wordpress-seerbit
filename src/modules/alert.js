import {hostName} from "../utils";
import i18next from "i18next";
import toast from 'react-hot-toast';

const globalAlert = (message, type, position = 'top-center',id='ct-container', hideAfter=4000)=>{
    let toastId = null;
    const cfg = {
        duration: hideAfter,
        id: id,
        position: position,
      }
    if(type === globalAlertTypes.success){
        toastId = toast.success(message,cfg)
    }
    else if(type === globalAlertTypes.info){
        toastId = toast(message,cfg)
    }
    else if(type === globalAlertTypes.error){
        toastId = toast.error(message,cfg)
    }
    return toastId

}

const alertExceptionError = (e)=>{
    if (e.hasOwnProperty("response")) {
        const msg = e.response
                ? e.response.data.message ?
                e.response.data.message.indexOf('Business is pending approval') !== -1 ?
                    `Your business is pending approval from ${hostName()}` :
                    e.response.data.message : "An unexpected error occurred. Kindly try again"
                : "An Error Occurred. Kindly try again"
        alertError(msg, {position: null, hideAfter: 10});
    } else {
        alertError(e.message ? i18next.t(e.message) : i18next.t("An unexpected error occurred. Kindly try again"));
    }
}

const alertSuccess = (message,id='ct-container',
                      config
    ={hideAfter:4000}
)=>{
    globalAlert(i18next.t(message), globalAlertTypes.success, config.position,id, config.hideAfter)
}

const alertInfo = (message,id='ct-container',config={ hideAfter:4000})=>{
    globalAlert(i18next.t(message), globalAlertTypes.info, config.position,id, config.hideAfter)
}

const alertError = (message, id='ct-container', config = {hideAfter: 4000})=>{
    globalAlert(i18next.t(message), globalAlertTypes.error,config.position,id, config.hideAfter)
}

const alertPromise = (callback, params={
    loading: 'Saving...',
    success: 'Success!',
    error: 'An error occurred.',
}) => {
     toast.promise(
        callback(),
        params
    );
}

const alertLoading = (message='Loading...') => {
    const toastId = toast.loading(message);
    return ()=>toast.dismiss(toastId);
}

const globalAlertTypes = {
    info:'info',
    success:'success',
    error:'error',
}
export {
    globalAlert,
    globalAlertTypes,
    alertExceptionError,
    alertSuccess,
    alertError,
    alertInfo,
    alertPromise,
    alertLoading
}
