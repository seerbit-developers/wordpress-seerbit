import {
    LOADING_SUBSCRIPTIONS,
    SUBSCRIPTIONS,
    UPDATE_SINGLE_SUBSCRIPTION,
    UPDATE_SINGLE_PLAN,
    LOADING_PLANS,
    LOADING_SUBSCRIBERS,
    SUBSCRIBER_TRANSACTIONS,
    LOADING_PLAN_SUBSCRIBERS,
    PLAN_SUBSCRIBERS,
    SUBSCRIBER_SUBSCRIPTIONS,
    LOADING_SUBSCRIBER_TRANSACTIONS,
    LOADING_SUBSCRIBER_SUBSCRIPTIONS,
    SUBSCRIBERS,
    PLANS,
} from "../actions/types";
import update from 'immutability-helper';
const initialState = {
    subscriptions: null,
    subscribers: null,
    plan_subscribers: null,
    subscriber_subscriptions: null,
    subscriber_transactions: null,
    plans: null,
    loading_subscriptions: false,
    loading_plans: false,
    Loading_plan_subscribers: false,
    loading_subscribers: false,
    loading_subscriber_transactions: false,
    loading_subscriber_subscriptions: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_SUBSCRIPTIONS:
            return {
                ...state,
                loading_subscriptions: action.payload,
            };
        case LOADING_PLANS:
            return {
                ...state,
                loading_plans: action.payload,
            };
        case LOADING_SUBSCRIBERS:
            return {
                ...state,
                loading_subscribers: action.payload,
            };
        case LOADING_SUBSCRIBER_TRANSACTIONS:
            return {
                ...state,
                loading_subscriber_transactions: action.payload,
            };
        case LOADING_SUBSCRIBER_SUBSCRIPTIONS:
            return {
                ...state,
                loading_subscriber_subscriptions: action.payload,
            };
        case LOADING_PLAN_SUBSCRIBERS:
            return {
                ...state,
                loading_plan_subscribers: action.payload,
            };
        case PLANS:
            return {
                ...state,
                plans: action.payload,
            };
        case SUBSCRIBERS:
            return {
                ...state,
                subscribers: action.payload,
            };
        case SUBSCRIBER_TRANSACTIONS:
            return {
                ...state,
                subscriber_transactions: action.payload,
            };
        case PLAN_SUBSCRIBERS:
            return {
                ...state,
                plan_subscribers: action.payload,
            };
        case SUBSCRIBER_SUBSCRIPTIONS:
            return {
                ...state,
                subscriber_subscriptions: action.payload,
            }
        // case UPDATE_SINGLE_PLAN:
        //     const index = state?.plans?.payload.findIndex(item => item?.details?.planId === action.payload.planId)
        //     return update(state, { plans: { payload: { [index]: { $set: action.payload.plan } } } })
        default:
            return {
                ...state
            };
    }
}
