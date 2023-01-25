import { loadState } from "../utils/localStorage";
import {postRequest, getRequest, putRequest} from "./apiService";
import { BASE_URL_STORE as BASE_URL } from "../actions/types";

const createStore = async (p) => {
    const state = loadState() && loadState().user.data;
    const url = `store/addstore/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, p)
}

const updateStore = async (p, storeId) => {
    const state = loadState() && loadState().user.data;
    const url = `store/updatestore/${state.business_details.number}/${storeId}`
    return putRequest(`${BASE_URL}${url}`, p)
}

const updateProductsCategory = async (p, id) => {
    const state = loadState() && loadState().user.data;
    const url = `products/business/categories/business/${state.business_details.number}/cat/${id}`
    return putRequest(`${BASE_URL}${url}`, p)
}

const createProductsCategory = async (p) => {
    const state = loadState() && loadState().user.data;
    const url = `products/business/categories/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, p)
}

const createStoreProduct = async (p) => {
    const state = loadState() && loadState().user.data;
    const url = `products/add/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, p)
}

const addStoreProducts = async (p) => {
    const state = loadState() && loadState().user.data;
    const url = `store/addproducttostore/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, p)
}

const validateNewStoreName = async (name) => {
    const url = `store/validatestorename/${name}`
    return getRequest(`${BASE_URL}${url}`)
}

const getOrderDetails = async (storeId,orderId) => {
    const state = loadState() && loadState().user.data;
    const url = `store/loadordersitems/${state.business_details.number}/${storeId}?orderId=${orderId}`
    return getRequest(`${BASE_URL}${url}`)
}

const completeOrder = async (storeId,orderId, p) => {
    const state = loadState() && loadState().user.data;
    const url = `store/updateorderstatus/${state.business_details.number}/${storeId}/${orderId}`
    return putRequest(`${BASE_URL}${url}`, p)
}

const saveStoreSettings = async (storeId, p) => {
    const state = loadState() && loadState().user.data;
    const url = `store/updategeneralconfig/${state.business_details.number}/${storeId}`
    return putRequest(`${BASE_URL}${url}`, p)
}


const uploadProductImages = async (postData, onUploadProgress) => {
    const state = loadState() && loadState().user.data;
    // const url = !postData.imageId ?
    //     postData.multiple ? `products/business/${state.business_details.number}/product/${postData.id}/uploadmultipleimages`
    //         : `products/business/${state.business_details.number}/product/${postData.id}/uploadimage`
    //     : `products/business/${state.business_details.number}/product/${postData.id}/uploadimage/${postData.imageId}`

    const url = `products/business/${state.business_details.number}/product/${postData.id}/uploadmultipleimages`
    return putRequest(`${BASE_URL}${url}`, postData.data, onUploadProgress)
}

export {
    createStore,
    getOrderDetails,
    completeOrder,
    saveStoreSettings,
    uploadProductImages,
    createStoreProduct,
    validateNewStoreName,
    updateStore,
    addStoreProducts,
    updateProductsCategory,
    createProductsCategory
}
