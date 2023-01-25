import {loadState} from "../utils/localStorage";
import { getRequest, postRequest, putRequest} from "./apiService";
import {BASE_URL} from "../actions/types";


export const createSubPocket = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/pocketprofile/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, postData)
}

export const generatePocketAccount = async (pocketReference)=> {
    const state = loadState() && loadState().user.data;
    const url = `pockets/profile/${state.business_details.live_public_key}/requestaccountnumber/${pocketReference}`
    return getRequest(`${BASE_URL}${url}`)
}

// https://merchant.seerbitapi.com/springmerchants/api/v1/pockets/profile/{{publickey}}/requestaccountnumber/{{pocketreference}}
export const nameEnquiry = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/pocketprofile/${state.business_details.number}/transfer/nameenquiry`
    return putRequest(`${BASE_URL}${url}`, postData)
}

export const validatePayoutToBank = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/pocketprofile/${state.business_details.number}/transfer`
    return putRequest(`${BASE_URL}${url}`, postData)
}

export const payoutToBank = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/pocketprofile/${state.business_details.number}/transfer/validate`
    return putRequest(`${BASE_URL}${url}`, postData)
}


