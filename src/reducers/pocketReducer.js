import {
    LOADING_POCKET_PROFILE_DEBIT,
    POCKET_PROFILE_DEBIT,
    POCKET_PROFILE_CREDIT,
    LOADING_POCKET_PROFILE_CREDIT,
    BUSINESS_POCKET_HISTORY,
    LOADING_BUSINESS_POCKET_HISTORY,
    LOADING_BUSINESS_POCKET_BALANCE,
    BUSINESS_POCKET_BALANCE,
    LOADING_BUSINESS_POCKET_TRANSFERS,
    BUSINESS_POCKET_TRANSFERS,
    LOADING_SUB_POCKETS_HISTORY,
    SUB_POCKETS_HISTORY,
    LOADING_BUSINESS_SUB_POCKETS, BUSINESS_SUB_POCKETS
} from "../actions/types";

const initialState = {
    profile: null,
    loading_profile: false,
    loading_profile_credit: false,
    profile_credit: null,
    business_pocket_history: null,
    loading_business_pocket_history: false,
    loading_business_pocket_balance: false,
    business_pocket_balance: null,
    sub_pockets_balance: null,
    loading_pockets_balance: null,
    loading_business_transfers: false,
    business_transfers: null,
    sub_pocket_balance: null,
    loading_sub_pocket_balance: false,
    loading_business_sub_pockets: false,
    business_sub_pockets: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SUB_POCKETS_HISTORY:
            return {
                ...state,
                sub_pocket_balance: action.payload,
            };
            case LOADING_BUSINESS_SUB_POCKETS:
            return {
                ...state,
                loading_business_sub_pockets: action.payload,
            };
        case BUSINESS_SUB_POCKETS:
            return {
                ...state,
                business_sub_pockets: action.payload,
            };
        case LOADING_SUB_POCKETS_HISTORY:
            return {
                ...state,
                loading_sub_pocket_balance: action.payload,
            };
        case POCKET_PROFILE_DEBIT:
            return {
                ...state,
                profile: action.payload,
            };
        case LOADING_POCKET_PROFILE_DEBIT:
            return {
                ...state,
                loading_profile: action.payload,
            };
        case POCKET_PROFILE_CREDIT:
            return {
                ...state,
                profile_credit: action.payload,
            };
        case LOADING_POCKET_PROFILE_CREDIT:
            return {
                ...state,
                loading_profile_credit: action.payload,
            };
            case BUSINESS_POCKET_HISTORY:
            return {
                ...state,
                business_pocket_history: action.payload,
            };
        case LOADING_BUSINESS_POCKET_HISTORY:
            return {
                ...state,
                loading_business_pocket_history: action.payload,
            };
            case LOADING_BUSINESS_POCKET_BALANCE:
            return {
                ...state,
                loading_business_pocket_balance: action.payload,
            };
            case BUSINESS_POCKET_BALANCE:
            return {
                ...state,
                business_pocket_balance: action.payload,
            };
            case LOADING_BUSINESS_POCKET_TRANSFERS:
            return {
                ...state,
                loading_business_transfers: action.payload,
            };
            case BUSINESS_POCKET_TRANSFERS:
            return {
                ...state,
                business_transfers: action.payload,
            };
        default:
            return {
                ...state
            };
    }
}
