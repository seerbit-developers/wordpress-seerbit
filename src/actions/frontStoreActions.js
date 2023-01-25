import {
    GET_BUSINESS_STORES,
    LOADING_BUSINESS_STORES,
    LOADING_BUSINESS_PRODUCTS,
    BUSINESS_PRODUCTS,
    NEW_PRODUCT_ID,
    LOADING_STORE_ORDERS,
    STORE_ORDERS,
    LOADING_STORE_PRODUCTS,
    STORE_PRODUCTS,
    BASE_URL_STORE,
    BUSINESS_PRODUCT_CATEGORIES, LOADING_ORDERS_BY_PRODUCT, PRODUCT_ORDERS,
    PRODUCT_DETAILS
} from "./types";
import {getRequest, get} from "../services/apiService";

export const getBusinessStores = (from = 0, to = 25, storeName = null) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_STORES,
            payload:true
        }
    )
        get(`store/getstore/${getState().data.business_details.number}?page=${ from }&size=${ to }${ storeName ? '&storeName='+storeName : '' }`)
    //     get(`https://mocki.io/v1/a2efff00-583d-463a-856b-f0f465dc0d2d`)
            .then(res=>{
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:LOADING_BUSINESS_STORES,
                        payload:false
                    }
                )
                dispatch(
                    {
                        type:GET_BUSINESS_STORES,
                        payload:res
                    }
                )
            }
        }).catch(e=>{
            dispatch(
                {
                    type:LOADING_BUSINESS_STORES,
                    payload:false
                }
            )
            dispatch(
                {
                    type:GET_BUSINESS_STORES,
                    payload:null
                }
            )
        })

};

export const getProductList = (from = 0, to = 25, type = false, search_term='') => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_BUSINESS_PRODUCTS,
            payload:true
        }
    )
    getRequest(`${BASE_URL_STORE}products/business/${getState().data.business_details.number}/?q=${search_term}&page=${ from }&size=${ to }&type=${type}`)
    .then(res=>{
        dispatch(
            {
                type:LOADING_BUSINESS_PRODUCTS,
                payload:false
            }
        )
        if (res.responseCode === '00'){
            dispatch(
                {
                    type:BUSINESS_PRODUCTS,
                    payload:res
                }
            )
        }else{
            dispatch(
                {
                    type:BUSINESS_PRODUCTS,
                    payload:null
                }
            )
        }
    }).catch(e=>{
        console.log(e)
        dispatch(
            {
                type:LOADING_BUSINESS_PRODUCTS,
                payload:false
            }
        )
        dispatch(
            {
                type:BUSINESS_PRODUCTS,
                payload:null
            }
        )
    })
  };

export const getProductOrders = (from = 0, to = 25, storeId='') => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_STORE_ORDERS,
            payload:true
        }
    )
    const url = `${BASE_URL_STORE}loadorders/${getState().data.business_details.number}/${storeId}?size=${to}&page=${from}&q=ALL&startDate=&endDate=`
    getRequest(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_STORE_ORDERS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:STORE_ORDERS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:STORE_ORDERS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_STORE_ORDERS,
                payload:false
            }
        )
        dispatch(
            {
                type:STORE_ORDERS,
                payload:null
            }
        )
    })
};

export const getOrdersByProduct = (from = 0, to = 25, id='') => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_ORDERS_BY_PRODUCT,
            payload:true
        }
    )
    // eslint-disable-next-line max-len
    const url = `${BASE_URL_STORE}products/business/${getState().data.business_details.number}/orders?q=${id}&page=${from}&size=${to}`
    getRequest(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_ORDERS_BY_PRODUCT,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:PRODUCT_ORDERS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:PRODUCT_ORDERS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_ORDERS_BY_PRODUCT,
                payload:false
            }
        )
        dispatch(
            {
                type:PRODUCT_ORDERS,
                payload:null
            }
        )
    })
};

export const getStoreProducts = (from = 0, to = 25, storeId = null) => (dispatch, getState) => {
    dispatch(
        {
            type:LOADING_STORE_PRODUCTS,
            payload:true
        }
    )
    const url = `store/loadproducts/${getState().data.business_details.number}/${storeId}?size=${to}&page=${from}&productName=&status=&startDate=&endDate`;
    get(url)
        .then(res=>{
            dispatch(
                {
                    type:LOADING_STORE_PRODUCTS,
                    payload:false
                }
            )
            if (res.responseCode === '00'){
                dispatch(
                    {
                        type:STORE_PRODUCTS,
                        payload:res
                    }
                )
            }else{
                dispatch(
                    {
                        type:STORE_PRODUCTS,
                        payload:null
                    }
                )
            }
        }).catch(e=>{
        dispatch(
            {
                type:LOADING_STORE_PRODUCTS,
                payload:false
            }
        )
        dispatch(
            {
                type:STORE_PRODUCTS,
                payload:null
            }
        )
    })
};


export const getProductCategories = (from = 0, to = 25) => (dispatch, getState) => {
    getRequest(`${BASE_URL_STORE}products/business/categories/${getState().data.business_details.number}/?qpage=${ from }&size=${ to }`)
    .then(res=>{
        if (res.responseCode === '00'){
            dispatch(
                {
                    type:BUSINESS_PRODUCT_CATEGORIES,
                    payload:res
                }
            )
        }else{
            dispatch(
                {
                    type:BUSINESS_PRODUCT_CATEGORIES,
                    payload:null
                }
            )
        }
    }).catch(e=>{
        dispatch(
            {
                type:BUSINESS_PRODUCT_CATEGORIES,
                payload:null
            }
        )
    })
  };


export const dispatchNewProductId = (id)=> (dispatch, getState)=>{
    dispatch(
        {
            type:NEW_PRODUCT_ID,
            payload:id
        }
    )
}

export const dispatchProductDetails = (p)=> (dispatch)=>{
    dispatch(
        {
            type:PRODUCT_DETAILS,
            payload:p
        }
    )
}
