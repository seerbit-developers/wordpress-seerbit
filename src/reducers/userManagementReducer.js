import {
    BUSINESS_USERS_LIST,
    COUNTRY_KYC,
    LOADING_BUSINESS_USERS,
    LOADING_COUNTRY_KYC,
    USER_DATA_TEMP,
    UPDATE_SINNGLE_BUSINESS_USER,
    SAVE_TWO_FACTOR
} from "actions/types";
import update from 'immutability-helper';

const initialState = {
    business_users: null,
    user_data_temp: null,
    loading_business_users: false,
    loading_country_kyc: false,
    country_kyc: null,
    two_factor_code: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case BUSINESS_USERS_LIST:
            return {
                ...state,
                business_users: action.payload,
            };
            case UPDATE_SINNGLE_BUSINESS_USER:
                const index = state.business_users.payload.findIndex(item => item.number === action.payload.id)
                return update(state, { business_users: { payload: { [index]: { $merge: {user: action.payload.user}} } } } )
            case USER_DATA_TEMP:
            return {
                ...state,
                user_data_temp: action.payload,
            };
        case LOADING_BUSINESS_USERS:
            return {
                ...state,
                loading_business_users: action.payload,
            };
        case LOADING_COUNTRY_KYC:
            return {
                ...state,
                loading_country_kyc: action.payload,
            };
        case COUNTRY_KYC:
            return {
                ...state,
                country_kyc: action.payload,
            };
            case SAVE_TWO_FACTOR:
            return {
                ...state,
                two_factor_code: action.payload,
            };
        default:
            return {
                ...state
            };
    }
}
