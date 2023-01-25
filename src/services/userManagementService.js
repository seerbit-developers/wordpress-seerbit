import {loadState} from "../utils/localStorage";
import {putRequest, postRequest, getRequest, postRequestNoAuth} from "./apiService";
import {BASE_URL, BASE_URL_AUTH_SERVICE} from "../actions/types";

const  switchUserDataMode = async (userId, type)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/switchaccountmode/${state.business_details.number}/user/${userId}?${type}`
    return putRequest(`${BASE_URL}${url}`)
}

const  switchBusinessDataMode = async ()=> {
    const state = loadState() && loadState().user.data;
    const url = `user/switchmode/${state.user_details.id}/business/${state.business_details.number}`
    return putRequest(`${BASE_URL}${url}`)
}

const  switchUserRole = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `business/${state.business_details.number}/users/switchrole`
    return putRequest(`${BASE_URL}${url}`, data)
}

const inviteUserToBusiness = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.user_details.id}/invite`
    return postRequest(`${BASE_URL}${url}`, data)
}

const requestPasswordReset = async (email,payload)=> {
    const url = `auth/user/recoverpassword/${email}`
    return postRequest(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const login = async (payload)=> {
    const url = `auth/login`
    return postRequest(`${BASE_URL}${url}`, payload)
}

const  generateTwoFactorAuthBarCode = async (payload)=> {
    const url = `2fa/generateOTPFirstsetup`
    return postRequest(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const  generateOtpForApproval = async (payload)=> {
    const url = `2fa/generate2fOTP`
    return postRequest(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}

const  updateTwoFactorAuth = async (payload)=> {
    const url = `2fa/update`
    return postRequest(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}


const  resetTwoFactorAuth = async (id)=> {
    const url = `user/${id}/generate2fabarcode`
    return getRequest(`${BASE_URL}${url}`)
}

const  updateTwoFactorAuthStatus = async (status, otp)=> {
    const state = loadState() && loadState().user.data;
    const path = `${status ? 'disable2fa' : 'enable2fa'}`
    const url = `user/${state.user_details.id}/${path}/${otp}`
    return getRequest(`${BASE_URL}${url}`)
}

const  updateProfile = async (data)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.user_details.id}`
    return putRequest(`${BASE_URL}${url}`, data)
}


const  updateUserAccountStatus = async (s,id)=> {
    const status = s !== 'ACTIVE' ? 'activate': 'deactivate'
    return putRequest(`${BASE_URL}user/${id}/${status}`, {})
}

const validateMfa = async (payload)=> {
    const url = `2fa/validate`
    return postRequestNoAuth(`${BASE_URL_AUTH_SERVICE}${url}`, payload)
}


export {
    switchUserDataMode,
    switchUserRole,
    inviteUserToBusiness,
    updateProfile,
    requestPasswordReset,
    generateTwoFactorAuthBarCode,
    updateTwoFactorAuthStatus,
    login,
    resetTwoFactorAuth,
    updateUserAccountStatus,
    switchBusinessDataMode,
    updateTwoFactorAuth,
    validateMfa,
    generateOtpForApproval
}
