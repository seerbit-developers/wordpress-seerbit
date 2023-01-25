import {
    LOADING_PAYMENT_LINKS,
    PAYMENT_LINKS,
    PAYMENT_LINK_DELETE,
    LOADING_PAYMENT_LINK_DELETE,
    LOADING_PAYMENT_LINK_TRANSACTIONS,
    PAYMENT_LINK_TRANSACTIONS
} from "../actions/types";
import update from 'immutability-helper';

const initialState = {
    payment_links: null,
    payment_link_transactions: null,
    loading_payment_link_transactions: false,
    loading_payment_links: false,
    loading_payment_links_delete: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_PAYMENT_LINKS:
            return {
                ...state,
                loading_payment_links: action.payload,
            };
        case LOADING_PAYMENT_LINK_DELETE:
            return {
                ...state,
                loading_payment_links_delete: action.payload,
            };
        case PAYMENT_LINKS:
            return {
                ...state,
                payment_links: action.payload,
            };
            case LOADING_PAYMENT_LINK_TRANSACTIONS:
            return {
                ...state,
                loading_payment_link_transactions: action.payload,
            };
            case PAYMENT_LINK_TRANSACTIONS:
            return {
                ...state,
                payment_link_transactions: action.payload,
            };
        case PAYMENT_LINK_DELETE: {
            return update(state, { payment_links: { payload: { $splice: [[action.payload, 1]] } } });
        };
        default:
            return {
                ...state
            };
    }
}
