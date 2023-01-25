import {
    BUSINESS_USERS_LIST, COUNTRY_KYC,
    LOADING_BUSINESS_USERS,
    LOADING_CHECKOUT_ADS, LOADING_COUNTRY_KYC,
    SET_CHECKOUT_ADS,
    USER_DATA_TEMP,
    BASE_URL,
    UPDATE_SINNGLE_BUSINESS_USER,
    SET_ROLE, SAVE_TWO_FACTOR
} from "./types";
import {get, getRequest, getRequestNoAuth} from "../services/apiService";

export const getCheckoutAdverts = () => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_CHECKOUT_ADS,
            payload:true
        }
    )
        get(`business/checkoutadverts/${getState().data.business_details.number}`)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_CHECKOUT_ADS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:SET_CHECKOUT_ADS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:SET_CHECKOUT_ADS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_CHECKOUT_ADS,
                payload:false
            }
        )
        dispatch(
            {
                type:SET_CHECKOUT_ADS,
                payload:null
            }
        )
    })

};

export const getBusinessUsersList = (from = 0, to = 25, storeName = 'ALL') => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_USERS,
            payload:true
        }
    )
        get(`business/${getState().data.business_details.number}/users`)
        .then(res=>{
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:LOADING_BUSINESS_USERS,
                        payload:false
                    }
                )
                dispatch(
                    {
                        type:BUSINESS_USERS_LIST,
                        payload:res
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_BUSINESS_USERS,
                payload:false
            }
        )
        dispatch(
            {
                type:BUSINESS_USERS_LIST,
                payload:null
            }
        )
    })

};

export const updateSingleBusinessUser = (user,id) => (dispatch, getState) => {
    dispatch(
        {
            type:UPDATE_SINNGLE_BUSINESS_USER,
            payload:{id,user}
        }
    )

};

export const storeTempUserData = (data)=> (dispatch, store) =>{
    dispatch(
        {
            type:USER_DATA_TEMP,
            payload:data
        }
    )
}

export const clearTempUserData = ()=> (dispatch, store) =>{
    dispatch(
        {
            type:USER_DATA_TEMP,
            payload:null
        }
    )
}

export const setUserRole = (role)=> (dispatch, store) =>{
    dispatch(
        {
            type:SET_ROLE,
            payload:role
        }
    )
}

export const getCountryKYc = (countryCode) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_COUNTRY_KYC,
            payload:true
        }
    )
    getRequestNoAuth(`${BASE_URL}auth/countryKycdocuments/${countryCode}`)
        .then(res=>{
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:LOADING_COUNTRY_KYC,
                        payload:false
                    }
                )
                dispatch(
                    {
                        type:COUNTRY_KYC,
                        payload:res
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_COUNTRY_KYC,
                payload:false
            }
        )
        dispatch(
            {
                type:COUNTRY_KYC,
                payload:null
            }
        )
    })

};

export const saveTwoFactorCode = (payload) => (dispatch, getState) => {
    dispatch(
        {
            type: SAVE_TWO_FACTOR,
            payload: payload
        }
    )
}
