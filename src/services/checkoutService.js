import {loadState} from "../utils/localStorage";
import {putRequest, getRequest, postRequest} from "./apiService";
import {BASE_URL} from "../actions/types";
import {executeActions} from "../actions";

const  updateCheckoutPaymentOptions = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/${state.business_details.number}/setting`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  updateCheckoutAdvert = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/updatecheckoutadvert/${state.business_details.number}`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  createCheckoutAdvert = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/addcheckoutadvert/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, data)
}

const  updateCheckoutAdvertStatus = async (status)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/checkoutadvert/changestatus/${state.business_details.number}?status=${status}`
    return putRequest(`${BASE_URL}${url}`, {})
}

export {
    updateCheckoutPaymentOptions,
    updateCheckoutAdvert,
    updateCheckoutAdvertStatus,
    createCheckoutAdvert
}
