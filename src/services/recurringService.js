import { loadState } from "../utils/localStorage";
import { putRequest } from "./apiService";
import { BASE_URL } from "../actions/types";
import { executeActions } from "../actions";

const updateSubscriptionStatus = async (p) => {
    const state = loadState() && loadState().user.data;
    const url = `recurrent/updaterecurring/${state.business_details.number}`
    return putRequest(`${BASE_URL}${url}`, p)
}
export {
    updateSubscriptionStatus,
}
