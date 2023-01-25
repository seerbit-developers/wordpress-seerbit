import { loadState } from "../utils/localStorage";
import {postRequest, getRequest, putRequest} from "./apiService";
const BASE_URL = process.env.REACT_APP_BASE_URL_TERMINAL
export interface IRequestTerminalRequest {
    numberOfTerminals: number;
    deliveryAddress: string;
    message: string;
    businessId: string;
    businessName: string;
    businessEmail: string;
}

export const requestTerminal = async (data: IRequestTerminalRequest) => {
    const url = `requests`
    return postRequest(`${BASE_URL}${url}`, data)
}

export const fetchTerminals = async (data: IRequestTerminalRequest) => {
    const state = loadState() && loadState().user.data;
    const url = `terminals/business/${state.business_details.number}`
    return getRequest(`${BASE_URL}${url}`, data)
}
