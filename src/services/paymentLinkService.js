import {loadState} from "../utils/localStorage";
import { putRequest, postRequest} from "./apiService";
import {BASE_URL} from "../actions/types";

const createPaymentLink = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `paymentlink/addpaymentlink/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, postData)

}

const updatePaymentLink = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `paymentlink/updatepaymentlink/${state.business_details.number}`
    return putRequest(`${BASE_URL}${url}`, postData)
}


export {
    updatePaymentLink,
    createPaymentLink
}
