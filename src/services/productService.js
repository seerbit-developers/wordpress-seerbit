import { loadState } from "../utils/localStorage";
import {postRequest, deleteRequest, putRequest} from "./apiService";
import { BASE_URL_STORE as BASE_URL } from "../actions/types";

const updateProduct = async (data) => {
    const state = loadState() && loadState().user.data;
    const url = `products/business/${state.business_details.number}/product/${data.id}`
    return putRequest(`${BASE_URL}${url}`, data.data)
}

const createProduct = async (data) => {
    const state = loadState() && loadState().user.data;
    const url = `products/add/${state.business_details.number}`
    return postRequest(`${BASE_URL}${url}`, data.data)
}

const updateProductImage = async (postData) => {
    const state = loadState() && loadState().user.data;
    // const url = `products/business/${state.business_details.number}/product/${data.id}`
    const url = !postData.imageId ?
        postData.multiple ? `products/business/${state.business_details.number}/product/${postData.id}/uploadmultipleimages`
            : `products/business/${state.business_details.number}/product/${postData.id}/uploadimage`
        : `products/business/${state.business_details.number}/product/${postData.id}/uploadimage/${postData.imageId}`

    return putRequest(`${BASE_URL}${url}`, postData.data, postData.onUploadProgress)
}

const deleteProduct = async (id) => {
    const state = loadState() && loadState().user.data;
    const url = `products/business/${state.business_details.number}/product/${id}`
    return deleteRequest(`${BASE_URL}${url}`)
}

const deleteCategory = async (id) => {
    const state = loadState() && loadState().user.data;
    const url = `products/business/categories/business/${state.business_details.number}/cat/${id}`
    return deleteRequest(`${BASE_URL}${url}`)
}

export {
    updateProduct,
    updateProductImage,
    createProduct,
    deleteProduct,
    deleteCategory
}
