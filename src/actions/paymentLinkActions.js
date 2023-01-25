import {
    LOADING_PAYMENT_LINKS,
    PAYMENT_LINKS,
    PAYMENT_LINK_DELETE,
    LOADING_PAYMENT_LINK_DELETE,
    LOADING_PAYMENT_LINK_TRANSACTIONS, PAYMENT_LINK_TRANSACTIONS
} from "./types";
import { alertError, alertExceptionError } from "modules/alert";
import { get, deleteRequest } from "../services/apiService";

export const fetchPaymentLinks = (postData) => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_PAYMENT_LINKS,
            payload: true
        }
    )
    const search = !!postData.param
    const url = `paymentlink/getpaylink/${getState().data.business_details.number}${!postData.param ? /ByBusinessId/ + getState().data.business_details.number : ''}${postData.param ? '/PaymentLinkName/' + postData.param : ''}?page=${postData ? postData.start - 1 : 0}&size=${postData ? postData.size : 25}`
    get(url)
        .then(res => {
            dispatch(
                {
                    type: LOADING_PAYMENT_LINKS,
                    payload: false
                }
            )
            if (res.responseCode === '00') {
                if (search) {
                    const r = {
                        payload: res.payload.data.paymentLinks,
                        currentPage: 0,
                        rowCount: 0,
                        responseCode: '00',
                        responseMessage: 'Success',
                    }
                    dispatch(
                        {
                            type: PAYMENT_LINKS,
                            payload: r
                        }
                    )
                } else {
                    dispatch(
                        {
                            type: PAYMENT_LINKS,
                            payload: res.payload
                        }
                    )
                }

            } else {
                dispatch(
                    {
                        type: PAYMENT_LINKS,
                        payload: null
                    }
                )
            }
        }).catch(e => {
            dispatch(
                {
                    type: LOADING_PAYMENT_LINKS,
                    payload: false
                }
            )
            dispatch(
                {
                    type: PAYMENT_LINKS,
                    payload: null
                }
            )
        })

};

export const fetchPaymentLinkTransactions = (from=0, to=25, id='') => (dispatch, getState) => {
    dispatch(
        {
            type: LOADING_PAYMENT_LINK_TRANSACTIONS,
            payload: true
        }
    )
    dispatch(
        {
            type: PAYMENT_LINK_TRANSACTIONS,
            payload: null
        }
    )
    const url = `paymentlink/transaction/${id}?page=${from}&size=${to}`
    get(url)
        .then(res => {
            dispatch(
                {
                    type: LOADING_PAYMENT_LINK_TRANSACTIONS,
                    payload: false
                }
            )
            if (res.responseCode === '00') {
                    dispatch(
                        {
                            type: PAYMENT_LINK_TRANSACTIONS,
                            payload: res
                        }
                    )
            } else {
                dispatch(
                    {
                        type: PAYMENT_LINK_TRANSACTIONS,
                        payload: null
                    }
                )
            }
        }).catch(e => {
        dispatch(
            {
                type: LOADING_PAYMENT_LINK_TRANSACTIONS,
                payload: false
            }
        )
        dispatch(
            {
                type: PAYMENT_LINK_TRANSACTIONS,
                payload: null
            }
        )
    })

};

export const deletePaymentLink = ({ id, index }) => (dispatch, getState) => {

    dispatch({ type: LOADING_PAYMENT_LINK_DELETE, payload: true })

    const url = `paymentlink/${getState().data.business_details.number}/deleteLink/${id}`
    deleteRequest(url)
        .then(res => {
            dispatch({ type: LOADING_PAYMENT_LINK_DELETE, payload: false })
            if (res.responseCode === '00') {
                dispatch({ type: PAYMENT_LINK_DELETE, payload: index })
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
            dispatch({ type: LOADING_PAYMENT_LINK_DELETE, payload: false })
            dispatch({ type: PAYMENT_LINK_DELETE, payload: null })
            alertExceptionError(e)
        })
};
