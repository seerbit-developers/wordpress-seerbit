import {
    LOADING_SUBSCRIPTIONS,
    SUBSCRIPTIONS,
    UPDATE_SINGLE_PLAN,
    UPDATE_SINGLE_SUBSCRIPTION,
    LOADING_PLANS,
    LOADING_SUBSCRIBERS,
    SUBSCRIBERS,
    PLANS,
    PLAN_SUBSCRIBERS,
    LOADING_PLAN_SUBSCRIBERS,
    SUBSCRIBER_TRANSACTIONS,
    SUBSCRIBER_SUBSCRIPTIONS,
    LOADING_SUBSCRIBER_TRANSACTIONS,
    LOADING_SUBSCRIBER_SUBSCRIPTIONS
} from "./types";
import { get } from "../services/apiService";
import { loadState } from "../utils/localStorage";
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

export const getPlans = (from = 0, to = 25, interval = "", status = "") => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_PLANS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/plan/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}/all?page=${from}&size=${to}&interval=${interval}&status=${status}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_PLANS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                {
                    type: PLANS,
                    payload: res
                }
            )
        } else {
            dispatch(
                {
                    type: LOADING_PLANS,
                    payload: false
                }
            )
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while fetching the plans. Kindly try again");
        }
    }).catch((e) => {
        dispatch(
            {
                type: LOADING_PLANS,
                payload: false
            }
        )
        alertExceptionError(e)
    });
}

export const searchPlan = (from = 0, to = 25, interval = "", status = "", planCode) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_PLANS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/plan/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}/search?plan=${planCode}&productId=&page=${from}&size=${to}&interval=${interval}&status=${status}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_PLANS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                {
                    type: PLANS,
                    payload: res
                }
            )
        } else {
            dispatch(
                {
                    type: LOADING_PLANS,
                    payload: false
                }
            )
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while searching. Kindly try again");
        }
    }).catch((e) => {
        dispatch(
            {
                type: LOADING_PLANS,
                payload: false
            }
        )
        alertExceptionError(e)
    });
}

export const getPlanSubscribers = (planId) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_PLAN_SUBSCRIBERS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/subscriptions/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}/plan/${planId}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_PLAN_SUBSCRIBERS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                {
                    type: PLAN_SUBSCRIBERS,
                    payload: res
                }
            )
        } else {
            dispatch(
                {
                    type: LOADING_PLAN_SUBSCRIBERS,
                    payload: false
                }
            )
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while creating the plan. Kindly try again");
        }
    }).catch((e) => {
        dispatch(
            {
                type: LOADING_PLAN_SUBSCRIBERS,
                payload: false
            }
        )
        alertExceptionError(e)
    });
}

export const getSubscriberTransaction = (customerId, planId, from = 0, perPage = 25, startDate = "", stopDate = "", billingId=null) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_SUBSCRIBER_TRANSACTIONS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/plan/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}/get/${planId}/transactions/${customerId}?billingId=${billingId}&page=${from}&size=${perPage}&startdate=${startDate}&stopdate=${stopDate}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_SUBSCRIBER_TRANSACTIONS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                { type: SUBSCRIBER_TRANSACTIONS, payload: res }
            )
        } else {
            dispatch({ type: LOADING_SUBSCRIBER_TRANSACTIONS, payload: false })
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while creating the plan. Kindly try again");
        }
    }).catch((e) => {
        dispatch({ type: LOADING_SUBSCRIBER_TRANSACTIONS, payload: false })
        alertExceptionError(e)
    });
}

export const getSubscribers = (from, size) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_SUBSCRIBERS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/subscribers/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}?page=${from}&size=${size}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_SUBSCRIBERS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                {
                    type: SUBSCRIBERS,
                    payload: res
                }
            )
        } else {
            dispatch(
                {
                    type: LOADING_SUBSCRIBERS,
                    payload: false
                }
            )
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while creating the plan. Kindly try again");
        }
    }).catch((e) => {
        dispatch(
            {
                type: LOADING_SUBSCRIBERS,
                payload: false
            }
        )
        alertExceptionError(e)
    });
}

export const searchSubscriber = (subscribername) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_SUBSCRIBERS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/subscribers/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}/search?name=${subscribername}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_SUBSCRIBERS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                {
                    type: SUBSCRIBERS,
                    payload: res
                }
            )
        } else {
            dispatch(
                {
                    type: LOADING_SUBSCRIBERS,
                    payload: false
                }
            )
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while creating the plan. Kindly try again");
        }
    }).catch((e) => {
        dispatch(
            {
                type: LOADING_SUBSCRIBERS,
                payload: false
            }
        )
        alertExceptionError(e)
    });
}

export const getPlanSubscriberPlans = (customerid) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_SUBSCRIBER_SUBSCRIPTIONS,
            payload: true
        }
    )
    const state = loadState()?.user?.data?.business_details;
    const url = `recurrent/subscriptions/${state?.setting?.mode === "TEST" ? state?.test_public_key : state?.live_public_key}/customer/${customerid}`
    get(url).then(res => {
        dispatch(
            {
                type: LOADING_SUBSCRIBER_SUBSCRIPTIONS,
                payload: false
            }
        )
        if (res.responseCode === '00') {
            dispatch(
                {
                    type: SUBSCRIBER_SUBSCRIPTIONS,
                    payload: res
                }
            )
        } else {
            dispatch(
                {
                    type: LOADING_SUBSCRIBER_SUBSCRIPTIONS,
                    payload: false
                }
            )
            alertError(res.message
                ? res.message || res.responseMessage
                : "An error occurred while creating the plan. Kindly try again");
        }
    }).catch((e) => {
        dispatch(
            {
                type: LOADING_SUBSCRIBER_SUBSCRIPTIONS,
                payload: false
            }
        )
        alertExceptionError(e)
    });
}

export const dispatchUpdatePlan = (res) => (dispatch, getState) => {
    dispatch(
        {
            type: UPDATE_SINGLE_PLAN,
            payload: res
        }
    )
};


