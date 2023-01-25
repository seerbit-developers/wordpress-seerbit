import {
    BUSINESS_LIST,
    LOADING_SUBSCRIPTIONS,
    SUBSCRIPTIONS,
    USER_AUTHENTICATION,
    GET_ON_BOARDING_STATUS,
    ON_BOARDING
} from "./types";
import {get} from "../services/apiService";
import {alertError, alertExceptionError} from "../modules/alert";


export const dispatchBusinessList = (user_details) => (dispatch, getState) => {
    dispatch({
        type: BUSINESS_LIST,
        payload: {
            user_details: user_details
        }
    });
};

export const dispatchUserAuthentication = (data) => (dispatch, getState) => {
    dispatch({
        type: USER_AUTHENTICATION,
        payload: {
            user_details: data.payload,
            token: data.payload.token
        }
    });
};


export const getOnBoardingStatus = () => (dispatch, getState) => {
    dispatch(
        {
            type: GET_ON_BOARDING_STATUS,
            payload: true
        }
    )
    get(`user/business/${getState().data.business_details.number}/progressstatus`)
        .then(res => {
            dispatch(
                {
                    type: GET_ON_BOARDING_STATUS,
                    payload: false
                }
            )
            if (res.responseCode === '00') {
                dispatch(
                    {
                        type: ON_BOARDING,
                        payload: res
                    }
                )
            } else {
                dispatch(
                    {
                        type: ON_BOARDING,
                        payload: undefined
                    }
                )
            }
        }).catch(e => {
        dispatch(
            {
                type: GET_ON_BOARDING_STATUS,
                payload: false
            }
        )
        dispatch(
            {
                type: ON_BOARDING,
                payload: undefined
            }
        )
    })

};
