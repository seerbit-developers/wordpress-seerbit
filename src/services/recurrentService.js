import { postRequest, putRequest } from "./apiService";
import { BASE_URL } from "../actions/types";

const createPlan = async (data) => {
    const url = `recurrent/plan/create`
    return postRequest(`${BASE_URL}${url}`, data)
}

const editPlan = async (data) => {
    const url = `recurrent/plan/update`
    return postRequest(`${BASE_URL}${url}`, data)
}

const cancelSubscription = async (data) => {
    const url = `recurrent/subscribe`
    return putRequest(`${BASE_URL}${url}`, data)
}


const updateSubscription = async (data) => {
    const url = `recurrent/subscribe`
    return putRequest(`${BASE_URL}${url}`, data)
}

const restoreSubscription = async (data) => {
    const url = `recurrent/subscribe`
    return putRequest(`${BASE_URL}${url}`, data)
}

const retrySubscription = async (data) => {
    const url = `recurrent/charge`
    return postRequest(`${BASE_URL}${url}`, data)
}

export {
    createPlan,
    editPlan,
    cancelSubscription,
    retrySubscription,
    restoreSubscription,
    updateSubscription
}
