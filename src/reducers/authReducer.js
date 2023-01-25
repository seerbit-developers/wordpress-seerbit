import {BUSINESS_LIST, USER_PERMISSIONS} from "../actions/types";
const initialState = {
    business_list:null,
    permissions:[],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case BUSINESS_LIST:
            return {
                ...state,
                business_list: action.payload,
            };
            case USER_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload,
            };
        default:
            return {
                ...state
            };
    }
}
