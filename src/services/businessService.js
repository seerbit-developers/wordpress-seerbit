import {loadState} from "../utils/localStorage";
import {postRequest, putRequest, getRequest} from "./apiService";
import {BASE_URL} from "../actions/types";

const  updateBusinessSettings = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.user_details.id}/business/${state.business_details.number}`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  updateBusinessDetails = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/updatebusinessdetails/${state.business_details.number}/${state.user_details.id}`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  updateBusinessSupportDetails = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/updatebusinesssupport/${state.business_details.number}/${state.user_details.id}`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  updateBusinessSettlementDetails = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.user_details.id}/business/${state.business_details.number}`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  createBusinessRole = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.user_details.id}/roles`
    return postRequest(`${BASE_URL}${url}`, data)
}

const  updateBusinessRole = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.user_details.id}/roles/${data.id}`
    delete data.id
    return putRequest(`${BASE_URL}${url}`, data)
}

const  updateBusinessCertificate = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/updatebusinesscertificate/${state.business_details.number}/${data.userId}`
    return putRequest(`${BASE_URL}${url}`, data)
}

const  resetBusinessKeys = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/${state.business_details.number}/resetkeys`
    return getRequest(`${BASE_URL}${url}`, data)
}

const  nameEnquiry = async (data)=> {
    const url = `business/account/nameenquiry`
    return postRequest(`${BASE_URL}${url}`, data)
}
//
// const  updateBusinessKyc = async (data)=> {
//     const state = loadState() && loadState().user.data;
//     const url =  `user/updatebusinesscertificate/${state.business_details.number}/${state.user_details.id}`
//     return putRequest(`${BASE_URL}${url}`, data)
// }


export {
    updateBusinessSettings,
    nameEnquiry,
    createBusinessRole,
    updateBusinessRole,
    resetBusinessKeys,
    updateBusinessCertificate,
    updateBusinessDetails,
    updateBusinessSupportDetails,
    updateBusinessSettlementDetails
}
