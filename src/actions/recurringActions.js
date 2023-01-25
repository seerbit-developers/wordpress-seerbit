import {
    LOADING_SUBSCRIPTIONS,
    SUBSCRIPTIONS,
    UPDATE_SINGLE_SUBSCRIPTION
} from "./types";
import { get } from "../services/apiService";
import { alertError, alertExceptionError, alertSuccess } from "modules/alert";

export const getSubcriptions = () => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_SUBSCRIPTIONS,
            payload: true
        }
    )
    get(`recurrent/getrecurring/${getState().data.business_details.number}/All/null`)
        .then(res => {
            dispatch(
                {
                    type: LOADING_SUBSCRIPTIONS,
                    payload: false
                }
            )
            if (res.responseCode === '00') {
                dispatch(
                    {
                        type: SUBSCRIPTIONS,
                        payload: res?.payload?.data?.subscriptions || []
                    }
                )
            } else {
                alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                dispatch(
                    {
                        type: SUBSCRIPTIONS,
                        payload: null
                    }
                )
            }
        }).catch(e => {
            alertExceptionError(e)
            dispatch(
                {
                    type: LOADING_SUBSCRIPTIONS,
                    payload: false
                }
            )
            dispatch(
                {
                    type: SUBSCRIPTIONS,
                    payload: null
                }
            )
        })

};

export const dispatchSubcriptions = (res) => (dispatch, getState) => {
    dispatch(
        {
            type: UPDATE_SINGLE_SUBSCRIPTION,
            payload: res
        }
    )
};
