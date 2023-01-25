import {
    GET_BUSINESS_STORES,
    LOADING_BUSINESS_STORES,
    NEW_PRODUCT_ID,
    LOADING_STORE_ORDERS,
    STORE_ORDERS,
    LOADING_STORE_PRODUCTS,
    STORE_PRODUCTS,
    BUSINESS_PRODUCT_CATEGORIES,
    PRODUCT_ORDERS, LOADING_ORDERS_BY_PRODUCT,
    PRODUCT_DETAILS
} from "actions/types";

const initialState = {
    business_stores_data: null,
    loading_business_stores: false,
    loading_store_orders: false,
    loading_store_products: false,
    store_products: null,
    store_orders: null,
    new_product_id: null,
    product_details: null,
    product_categories: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BUSINESS_STORES:
            return {
                ...state,
                business_stores_data: action.payload,
            };
        case LOADING_BUSINESS_STORES:
            return {
                ...state,
                loading_business_stores: action.payload,
            };
            case LOADING_STORE_ORDERS:
            return {
                ...state,
                loading_store_orders: action.payload,
            };
            case LOADING_STORE_PRODUCTS:
            return {
                ...state,
                loading_store_products: action.payload,
            };
            case STORE_PRODUCTS:
            return {
                ...state,
                store_products: action.payload,
            };
            case STORE_ORDERS:
            return {
                ...state,
                store_orders: action.payload,
            };
        case NEW_PRODUCT_ID:
            return {
                ...state,
                new_product_id: action.payload,
            };
            case BUSINESS_PRODUCT_CATEGORIES:
            return {
                ...state,
                product_categories: action.payload,
            };
            case PRODUCT_ORDERS:
            return {
                ...state,
                product_orders: action.payload,
            };
        case LOADING_ORDERS_BY_PRODUCT:
            return {
                ...state,
                loading_product_orders: action.payload,
            };
            case PRODUCT_DETAILS:
            return {
                ...state,
                product_details: action.payload,
            };
        default:
            return {
                ...state
            };
    }
}
