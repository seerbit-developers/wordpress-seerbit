import {loadState} from "../utils/localStorage";
import { postRequest, getRequestWithToken, postRequestWithToken} from "./apiService";
import {BASE_URL} from "../actions/types";

const CustomToken = '277ed3ca-d727-3998-a524-9e5c00a9f219';

const emailTransactionReportLink = async (data,t)=> {
    const state = loadState() && loadState().user.data;
    const url = `transaction/${state.business_details.number}/sendreport/link?startDate=${data.startDate}&endDate=${data.endDate}&transactionType=${t}`
    return postRequest(`${BASE_URL}${url}`, data)
}

const emailTransactionReportCsv = async (data,t)=> {
    const state = loadState() && loadState().user.data;
    const url = `transaction/${state.business_details.number}/sendreport?startDate=${data.startDate}&endDate=${data.endDate}&type=${t}`
    return postRequest(`${BASE_URL}${url}`, data)
}

const refundPayment = async (data,t)=> {
    const state = loadState() && loadState().user.data;
    const url = `user/${state.business_details.number}/refunds`
    return postRequest(`${BASE_URL}${url}`, data)
}

const sendCustomReport = async (p)=> {
    const state = loadState() && loadState().user.data;
    p.businessId = state.business_details.number;
    p.type = undefined;
    p.mode = state.user_details.mode;
    const url = `https://seerbitapi.com/mchvalidation/custom/report/${state.business_details.number}/send?startDate=${p.startDate}&stopDate=${p.endDate}`
    return postRequestWithToken(`${url}`, p, CustomToken)
}

export {
    emailTransactionReportLink,
    emailTransactionReportCsv,
    refundPayment,
    sendCustomReport
}
