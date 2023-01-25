import {LOADING_COUNTRIES, QUERY} from "./types";
import {getRequestNoAuth} from "../services/apiService";


export const fetchCountries = () => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_COUNTRIES,
            payload:true
        }
    )
    getRequestNoAuth(`auth/countries`)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_COUNTRIES,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:"countries",
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:"countries",
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_COUNTRIES,
                payload:false
            }
        )
        dispatch(
            {
                type:"countries",
                payload:null
            }
        )
    })

}

export const resetBusiness= () => (dispatch) => {
    dispatch(
        {
            type: QUERY,
            name:"bank_list",
            payload:[]
        }
    )

}
