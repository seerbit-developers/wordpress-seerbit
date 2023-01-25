import {loadState} from "../utils/localStorage";
import { postRequest, getRequest} from "./apiService";
import {BASE_URL_INVOICE} from "../actions/types";


export const createCustomer = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `${BASE_URL_INVOICE}customer/${state.business_details.number}`
    return postRequest(`${url}`, postData)
}

export const downloadInvoice = async (idDocument)=> {
    const url = `${BASE_URL_INVOICE}invoice/downloadpdf/${idDocument}`
    return getRequest(`${url}`)
}

export const sendInvoice = async (idDocument)=> {
    const url = `${BASE_URL_INVOICE}invoice/send/${idDocument}`
    return getRequest(`${url}`)
}

export const makeInvoice = async (customer_id, p)=> {
    const url = `${BASE_URL_INVOICE}invoice/${customer_id}`
    return postRequest(`${url}`, p)
}


