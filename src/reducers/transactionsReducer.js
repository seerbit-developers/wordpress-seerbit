import {
    RECENT_TRANSACTIONS,
    LOADING_RECENT_TRANSACTIONS,
    LOADING_DASHBOARD_ANALYTICS,
    DASHBOARD_ANALYTICS,
    LOADING_TRANSACTIONS,
    TRANSACTION_CUSTOM_FIELD_NAMES,
} from "../actions/types";

const initialState = {
    recent_transactions: null,
    loading_recent_transactions: false,
    loading_transactions: false,
    loading_dashboard_analytics: false,
    dashboard_analytics: null,
    custom_field_names: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case RECENT_TRANSACTIONS:
            return {
                ...state,
                recent_transactions: action.payload,
            };
            case LOADING_RECENT_TRANSACTIONS:
            return {
                ...state,
                loading_recent_transactions: action.payload,
            };
            case LOADING_TRANSACTIONS:
            return {
                ...state,
                loading_transactions: action.payload,
            };
            case TRANSACTION_CUSTOM_FIELD_NAMES:
            return {
                ...state,
                custom_field_names: action.payload,
            };
            case DASHBOARD_ANALYTICS:
            return {
                ...state,
                dashboard_analytics: action.payload,
            };
            case LOADING_DASHBOARD_ANALYTICS:
            return {
                ...state,
                loading_dashboard_analytics: action.payload,
            };
        default:
            return {
                ...state
            };
    }
}
