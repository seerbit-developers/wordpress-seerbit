import {
    LOADING_SETTLEMENTS, SETTLEMENTS,
} from "./types";
import {get} from "../services/apiService";

export const getSettlements = (postData) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_SETTLEMENTS,
            payload:true
        }
    )
    const url = `user/${getState().data.business_details.number}/settlement?page=${postData ? postData.start - 1 : 0
    }&size=${postData ? postData.size : 25}${postData && postData.cur ? `&cur=${postData.cur}` : ""
    }`
        get(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_SETTLEMENTS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:SETTLEMENTS,
                        payload:res
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_SETTLEMENTS,
                payload:false
            }
        )
        dispatch(
            {
                type:SETTLEMENTS,
                payload:null
            }
        )
    })

};

export const getInternationalSettlements = (postData) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_SETTLEMENTS,
            payload:true
        }
    )

    const url = `business/${getState().data.business_details.number
    }/settlement/international?page=${postData ? postData.start - 1 : 0
    }&size=${postData ? postData.size : 25}${postData ? postData.cur ? "&cur="+postData.cur : "" : ""}`
    get(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_SETTLEMENTS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:SETTLEMENTS,
                        payload:res
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_SETTLEMENTS,
                payload:false
            }
        )
        dispatch(
            {
                type:SETTLEMENTS,
                payload:null
            }
        )
    })

};

export const searchSettlements = (postData) => (dispatch, getState) => {
  
    dispatch(
        {
            type:LOADING_SETTLEMENTS,
            payload:true
        }
    )
    const region = postData.type ? 'international' : 'search'
    const url = `business/${getState().data.business_details.number}/settlement/${region}?q=${postData.search_term ? postData.search_term : ""
    }${postData.start_date ? '&start_date='+postData.start_date : ''}${postData.stop_date ? '&stop_date='+postData.stop_date : ''
    }&type=${postData.type}&page=${postData.page - 1 || 0}&size=${postData.size || 25
    }`
        get(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_SETTLEMENTS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                if (res.rowCount > 0){
                    dispatch(
                        {
                            type:SETTLEMENTS,
                            payload:res
                        }
                    )
                }else{
                    dispatch(
                        {
                            type:SETTLEMENTS,
                            payload:null
                        }
                    )
                }
               
            }else{
                dispatch(
                    {
                        type:SETTLEMENTS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_SETTLEMENTS,
                payload:false
            }
        )
        dispatch(
            {
                type:SETTLEMENTS,
                payload:null
            }
        )
    })

};
