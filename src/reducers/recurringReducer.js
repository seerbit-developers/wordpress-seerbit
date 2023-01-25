import { LOADING_SUBSCRIPTIONS, SUBSCRIPTIONS, UPDATE_SINGLE_SUBSCRIPTION } from "../actions/types";
import update from 'immutability-helper';
const initialState = {
    subscriptions: null,
    loading_subscriptions: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SUBSCRIPTIONS:
            return {
                ...state,
                subscriptions: action.payload,
            };
        case LOADING_SUBSCRIPTIONS:
            return {
                ...state,
                loading_subscriptions: action.payload,
            };
        case UPDATE_SINGLE_SUBSCRIPTION:
            const index = state.subscriptions.findIndex(item => item.billingId === action.payload.billingId)
            return update(state, { subscriptions: { [index]: { $set: action.payload.subscriptions } } })
        default:
            return {
                ...state
            };
    }
}
