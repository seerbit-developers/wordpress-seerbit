import {
    get,
    postRequestNoAuth,
    putRequestNoAuth,
    getRequestOpen,
    putRequestWithToken
} from "./apiService";
import {BASE_URL_AUTH_SERVICE} from "../actions/types";

const login = async (payload)=> {
    const url = `auth/login`
    return postRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const  updateTwoFactorAuthStatus = async (status, otp)=> {
    // const state = loadState() && loadState().user.data;
    // const path = `${status ? 'disable2fa' : 'enable2fa'}`
    // const url = `user/${state.user_details.id}/${path}/${otp}`
    // return getRequest(`${BASE_URL}${url}`)
}

const registerNewMerchant = async (payload)=> {
    const url = `auth/register`
    return postRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const verifyAccount = async (token)=> {
    const url = `auth/validateemail/${token}`
    return getRequestOpen(`${BASE_URL_AUTH_SERVICE}${url}`)
}

const recoverUserPassword = async (url,payload)=> {
    return postRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const completeInvite = async (url,payload)=> {
    return postRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const resetUserPassword = async (url,payload)=> {
    return putRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const changePassword = async (url,payload,token)=> {
    return putRequestWithToken(`${BASE_URL_AUTH_SERVICE}${url}`, payload, token)
}

const fetchBusinessDetails = async (id)=> {
    const url = `business/fetchBusinessDetails/${id}`
    return get(`${BASE_URL_AUTH_SERVICE}${url}`)
}

const validateOtp = async (payload)=> {
    const url = `2fa/validate`
    return postRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}



export {
    login,
    registerNewMerchant,
    fetchBusinessDetails,
    updateTwoFactorAuthStatus,
    recoverUserPassword,
    resetUserPassword,
    verifyAccount,
    completeInvite,
    changePassword,
    validateOtp,
}
