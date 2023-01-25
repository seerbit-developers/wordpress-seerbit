import {loadState} from "utils/localStorage";
import { putRequest, postRequest} from "./apiService";
import {BASE_URL} from "actions/types";

const disputeFeedback = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.business_details.number}/disputes/${postData.url.dispute_ref}/${postData.url.action}`
    return putRequest(`${BASE_URL}${url}`, postData.data)
}

const disputeExport = async (postData)=> {
    const state = loadState() && loadState().user.data;
    const url = `transaction/${state.business_details.number}/sendreport/link?transactionType=ALL`
    return postRequest(`${BASE_URL}${url}`, postData)
}

const acceptBulkDispute = async (postData)=> {
    const url = `user/chargeback/approve`
    return postRequest(`${BASE_URL}${url}`, postData)
}


export {
    disputeFeedback,
    disputeExport,
    acceptBulkDispute
}
