import {LOADING_TERMINALS,FETCH_POS_TERMINALS } from "./types";
import { get } from "../services/apiService";

export const fetchTerminals = (
    from = 0,
    to = 25,
    search=null
) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_TERMINALS,
            payload:true
        }
    )
    const url = `business/${getState().data.business_details.number
    }/customerprofiles${search ? '/search?' : '?'}page=${from
    }&size=${to}`
    const r = search ? post(url, search) : get(url)
    r
        .then(res=>{
            dispatch(
                {
                    type:LOADING_TERMINALS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:FETCH_POS_TERMINALS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:FETCH_POS_TERMINALS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_TERMINALS,
                payload:false
            }
        )
        dispatch(
            {
                type:FETCH_POS_TERMINALS,
                payload:null
            }
        )
    })
};
