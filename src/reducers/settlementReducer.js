import {LOADING_SETTLEMENTS, SETTLEMENTS} from "../actions/types";


const initialState = {
    settlements: null,
    loading_settlements: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SETTLEMENTS:
            return {
                ...state,
                settlements: action.payload,
            };
        case LOADING_SETTLEMENTS:
            return {
                ...state,
                loading_settlements: action.payload,
            };
        default:
            return {
                ...state
            };
    }
}
