
import {
    LOADING_RECENT_TRANSACTIONS,
    RECENT_TRANSACTIONS,
    LOADING_DASHBOARD_ANALYTICS,
    DASHBOARD_ANALYTICS, TRANSACTION_CUSTOM_FIELD_NAMES
} from "../actions/types";
import {get, getRequestWithToken} from "../services/apiService";
const CustomToken = '277ed3ca-d727-3998-a524-9e5c00a9f219';
export const getRecentTransactions = () => (dispatch,getState) => {
    dispatch({
      type: LOADING_RECENT_TRANSACTIONS,
      payload: true,
    });
    const url = `user/${getState().data.business_details.number}/transactions/landingtransactions`

        get(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_RECENT_TRANSACTIONS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:RECENT_TRANSACTIONS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:RECENT_TRANSACTIONS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_RECENT_TRANSACTIONS,
                payload:false
            }
        )
        dispatch(
            {
                type:RECENT_TRANSACTIONS,
                payload:null
            }
        )
    })

  };

export const getDashboardAnalytics = () => (dispatch,getState) => {
    dispatch({
      type: LOADING_DASHBOARD_ANALYTICS,
      payload: true,
    });
    const cur = getState().data.business_details.default_currency
    const url = `business/${getState().data.business_details.number}/analytics?cur=${cur}`

        get(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_DASHBOARD_ANALYTICS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:DASHBOARD_ANALYTICS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:DASHBOARD_ANALYTICS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_DASHBOARD_ANALYTICS,
                payload:false
            }
        )
        dispatch(
            {
                type:DASHBOARD_ANALYTICS,
                payload:null
            }
        )
    })

  };

export const getCustomReportFieldNames = () => (dispatch,getState) => {
    dispatch({
        type: TRANSACTION_CUSTOM_FIELD_NAMES,
        payload: null
    })
    const url = `https://seerbitapi.com/mchvalidation/custom/report/${getState().data.business_details.number}`
    getRequestWithToken(`${url}`, CustomToken).then( res =>{
        dispatch({
            type: TRANSACTION_CUSTOM_FIELD_NAMES,
            payload: res.payload.fieldNames
        })
    }).catch(e=>{

    })
}
