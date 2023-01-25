import {
    LOADING_POCKET_CUSTOMERS,
    SET_POCKET_CUSTOMERS,
    POCKET_PROFILE_DEBIT,
    LOADING_POCKET_PROFILE_DEBIT,
    POCKET_PROFILE_CREDIT,
    LOADING_POCKET_PROFILE_CREDIT,
    LOADING_BUSINESS_POCKET_HISTORY,
    BUSINESS_POCKET_HISTORY,
    LOADING_BUSINESS_POCKET_BALANCE,
    BUSINESS_POCKET_BALANCE,
    LOADING_BUSINESS_POCKET_TRANSFERS,
    BUSINESS_POCKET_TRANSFERS,
    LOADING_SUB_POCKETS_HISTORY,
    SUB_POCKETS_HISTORY, LOADING_BUSINESS_SUB_POCKETS, BUSINESS_SUB_POCKETS
} from "./types";
import {get, post} from "../services/apiService";


export const fetchPocketCustomers = (
    from = 0,
    to = 25,
    search=null
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_POCKET_CUSTOMERS,
            payload:true
        }
    )
    const url = `business/pocketprofile/${getState().data.business_details.number
    }/customerprofiles${search ? '/search?' : '?'}page=${from
    }&size=${to}`
    const r = search ? post(url, search) : get(url)
    r
        .then(res=>{
            dispatch(
                {
                    type:LOADING_POCKET_CUSTOMERS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:SET_POCKET_CUSTOMERS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:SET_POCKET_CUSTOMERS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_POCKET_CUSTOMERS,
                payload:false
            }
        )
        dispatch(
            {
                type:SET_POCKET_CUSTOMERS,
                payload:null
            }
        )
    })
};

export const fetchPocketProfileDebit = (
    from = 0,
    to = 25,
    type='DEBIT'
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_POCKET_PROFILE_DEBIT,
            payload:true
        }
    )
    const url = `business/pocketprofile/${getState().data.business_details.number}/merchantpocket?type=${type}page=${from}&size=${to}`
    get(url)
        .then(res=>{

            dispatch(
                {
                    type:LOADING_POCKET_PROFILE_DEBIT,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:POCKET_PROFILE_DEBIT,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:POCKET_PROFILE_DEBIT,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_POCKET_PROFILE_DEBIT,
                payload:false
            }
        )
        dispatch(
            {
                type:POCKET_PROFILE_DEBIT,
                payload:null
            }
        )
    })
};

export const fetchPocketProfileCredit = (
    from = 0,
    to = 25,
    type='CREDIT'
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_POCKET_PROFILE_CREDIT,
            payload:true
        }
    )
    const url = `business/pocketprofile/${getState().data.business_details.number}/merchantpocket?type=${type}page=${from}&size=${to}`
    get(url)
        .then(res=>{

            dispatch(
                {
                    type:LOADING_POCKET_PROFILE_CREDIT,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:POCKET_PROFILE_CREDIT,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:POCKET_PROFILE_CREDIT,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_POCKET_PROFILE_CREDIT,
                payload:false
            }
        )
        dispatch(
            {
                type:POCKET_PROFILE_CREDIT,
                payload:null
            }
        )
    })
};

export const fetchBusinessPocketHistory = (
    from = 0,
    to = 25,
    search
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_POCKET_HISTORY,
            payload:true
        }
    )
    const url = `pockets/profile/${getState().data.business_details.number}/searchBusinessPocketTransactions?page=${from}&size=${to}`
    post(url, search)
        .then(res=>{

            dispatch(
                {
                    type:LOADING_BUSINESS_POCKET_HISTORY,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:BUSINESS_POCKET_HISTORY,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:BUSINESS_POCKET_HISTORY,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_BUSINESS_POCKET_HISTORY,
                payload:false
            }
        )
        dispatch(
            {
                type:BUSINESS_POCKET_HISTORY,
                payload:null
            }
        )
    })
};

export const fetchSubPocketHistory = (
    from = 0,
    to = 25,
    search
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_SUB_POCKETS_HISTORY,
            payload:true
        }
    )
    const url = `pockets/getBusinessSubPocketHistory/${getState().data.business_details.number}/search?page=${from}&size=${to}`
    post(url, search)
        .then(res=>{

            dispatch(
                {
                    type:LOADING_SUB_POCKETS_HISTORY,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:SUB_POCKETS_HISTORY,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:SUB_POCKETS_HISTORY,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_SUB_POCKETS_HISTORY,
                payload:false
            }
        )
        dispatch(
            {
                type:SUB_POCKETS_HISTORY,
                payload:null
            }
        )
    })
};

export const fetchBusinessPocketTransfers = (
    from = 0,
    to = 25,
    search
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_POCKET_TRANSFERS,
            payload:true
        }
    )
    const url = `pockets/profile/${getState().data.business_details.number}/searchBusinessPocketTransactions?page=${from}&size=${to}`
    post(url, search)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_BUSINESS_POCKET_TRANSFERS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:BUSINESS_POCKET_TRANSFERS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:BUSINESS_POCKET_TRANSFERS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_BUSINESS_POCKET_TRANSFERS,
                payload:false
            }
        )
        dispatch(
            {
                type:BUSINESS_POCKET_TRANSFERS,
                payload:null
            }
        )
    })
};

export const fetchBusinessPocketBalance = (
    type = 'TODAY',
    startDate='',
    endDate='',
    filter=false
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_POCKET_BALANCE,
            payload:true
        }
    )
    const url = `pockets/getGlobalSubPocketBalance/${getState().data.business_details.number}`
    const urlTransfer = `pockets/profile/${getState().data.business_details.number}/transfer?type=${type}&startDate=${startDate}&endDate=${endDate}`
    const pocket = get(url)
    const transfers = get(urlTransfer)
    let reqs = [];
    // if (filter){
    //     reqs = [transfers]
    // }else{
    //     reqs = [pocket, transfers]
    // }
    Promise.all([pocket, transfers]).then((values) => {
        dispatch(
            {
                type:LOADING_BUSINESS_POCKET_BALANCE,
                payload:true
            }
        )
                if (values[1] && values[1].responseCode === '00'){
                    dispatch(
                        {
                            type:BUSINESS_POCKET_BALANCE,
                            payload:{
                                fundsTransferred: values[1] ? values[1].payload?.amount : 0,
                                feesCharged: values[1] ? values[1].payload?.charge : 0
                            }
                        }
                    )
                }
        if (values[0] && values[0].responseCode === '00'){
            dispatch(
                {
                    type:BUSINESS_POCKET_BALANCE,
                    payload:{
                        globalSubPocketBalance: values[0] ? values[0].payload?.globalSubPocketBalance : 0,
                        totalSubPocketVolume: values[0] ? values[0].payload.totalSubPocketVolume : 0,
                        pocketAccount: values[0] ? values[0].payload?.businessPocketDetails?.account : 0,
                    }
                }
            )
        }
    }).catch(e=>{
        console.error(e)
        dispatch(
            {
                type:BUSINESS_POCKET_BALANCE,
                payload:null
            }
        )
        dispatch(
            {
                type:LOADING_BUSINESS_POCKET_BALANCE,
                payload:true
            }
        )
    })
};

export const fetchBusinessSubPockets = (
    from = 0,
    to = 25,
    search = {
        "firstName": ""
    }
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_SUB_POCKETS,
            payload:true
        }
    )
    const url = `pockets/profile/${getState().data.business_details.number}/subpockets/search?page=${from}&size=${to}`
    post(url, search)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_BUSINESS_SUB_POCKETS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:BUSINESS_SUB_POCKETS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:BUSINESS_SUB_POCKETS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_BUSINESS_SUB_POCKETS,
                payload:false
            }
        )
        dispatch(
            {
                type:BUSINESS_SUB_POCKETS,
                payload:null
            }
        )
    })
};
