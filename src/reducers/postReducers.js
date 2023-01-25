/** @format */

import {
  ERROR_DATA,
  QUERY,
  LOGIN,
  UPDATE,
  WHITE_LABEL,
  UPDATE_USER_PROFILE,
  UPDATE_SINGLE_BUSINESS,
  UPDATE_SINGLE_CHECKOUT_AD,
  SET_CHECKOUT_ADS,
  LOADING_CHECKOUT_ADS,
  LOADING_SETTLEMENTS,
  BLOCK_UI,
  USER_AUTHENTICATION,
  LOADING_BUSINESS_PRODUCTS,
  BUSINESS_PRODUCTS,
  SET_ROLE,
  LOADING_COUNTRIES,
  LOADING_POCKET_CUSTOMERS,
  SET_POCKET_CUSTOMERS,
  ON_BOARDING,
  GET_ON_BOARDING_STATUS,
  LANGUAGE
} from "../actions/types";
import update from 'immutability-helper';

// import roles_data from "./roles.json"
const initialState = {
  user_details: {},
  user_permissions: [],
  countries: null,
  loading_countries: false,
  business_details: {},
  bank_details: {},
  bank_list: [],
  customers: [],
  all_transactions: [],
  transactions: [],
  branch_transactions: [],
  sample_transactions: [],
  single_search: [],
  transactions_params: [],
  loading_trans: true,
  refunds: [],
  loggedin: undefined,
  payouts: [],
  internation_payout: [],
  disputes: [],
  permissions: [],
  industry_list: [],
  role: null,
  business_analytics: {},
  users: [],
  user: {},
  transaction_range: {},
  transaction_range_date_format: "D/MMM/yy",
  branches: [],
  branch: {},
  business_users: [],
  invite_user: {},
  products: null,
  loading_products: false,
  roles: [],
  product_categories: [],
  settlement_transactions: [],
  payouts_search_result: [],
  refunds_search_result: [],
  disputes_search_result: [],
  searching_transactions: false,
  customers_transactions: [],
  release_notes: [],
  business: {},
  new_business: {},
  kyc: null,
  currency: {},
  business_key: 0,
  payment_link: {},
  transaction_overview: {},
  branch_settlements: [],
  branch_payout: {},
  settlement_details: [],
  wallets: [],
  wallet_payouts: [],
  pocket_customers: [],
  loading_pocket_customers: false,
  business_advert: null,
  checkout_adverts: null,
  onboarding: undefined,
  loading_onboarding_status: false,
  loading_checkout_adverts: false,
  block_ui: { status: false, message: '' },
  language:'en'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE:
      if (action.clear) {
        return { ...state, ...action.field };
      } {
        return {
          ...state,
          [action.name]: action.payload && action.payload.data,
          location: action.payload && action.payload.location,
        };
      }
    case WHITE_LABEL:
      return {
        ...state,
        white_label: action.payload,
      };
    case LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
      case SET_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    case BLOCK_UI:
      return {
        ...state,
        block_ui: action.payload,
      };
      case LOADING_BUSINESS_PRODUCTS:
      return {
        ...state,
        loading_products: action.payload,
      };
      case LOADING_POCKET_CUSTOMERS:
      return {
        ...state,
        loading_pocket_customers: action.payload,
      };
    case SET_POCKET_CUSTOMERS:
      return {
        ...state,
        pocket_customers: action.payload,
      };
      case BUSINESS_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case LOADING_COUNTRIES:
      return {
        ...state,
        loading_countries: action.payload
      };
    case 'countries':
      return {
        ...state,
        countries: action.payload
      };
      case ON_BOARDING:
      return {
        ...state,
        onboarding: action.payload
      };
        case GET_ON_BOARDING_STATUS:
          return {
            ...state,
            loading_onboarding_status: action.payload
          };
    case SET_CHECKOUT_ADS:
      return {
        ...state,
        checkout_adverts: action.payload
      };
    case LOADING_CHECKOUT_ADS:
      return {
        ...state,
        loading_checkout_adverts: action.payload
      };
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        user_details: action.payload
      };
      case LOADING_SETTLEMENTS:
      return {
        ...state,
        loading_settlements: action.payload
      };
    case UPDATE_SINGLE_BUSINESS:
      return update(state, { business_details: { $set: action.payload } })
    case UPDATE_SINGLE_CHECKOUT_AD:
      const index = state.checkout_adverts.payload.findIndex(item => item.id === action.payload.id)
      return update(state, { checkout_adverts: { payload: { [index]: { $set: action.payload } } } });
    case QUERY:
      return action.parent_value
        ? {
          ...state,
          [action.name]: action.payload,
          location: action.location,
        }
        : action.spread
          ? {
            ...state,
            ...action.payload,
            location: action.location,
          }
          : {
            ...state,
            [action.name]: action.payload,
            location: action.location,
          };

    case USER_AUTHENTICATION:
      return {
        ...state,
        user_details: action.payload && action.payload.user_details,
        loggedin: action.payload.token && action.payload.token,
      };

      case LOGIN:
      return {
        ...state,
        user_details: action.payload && action.payload.user_details,
        business_details: action.payload && action.payload.business_details,
        loggedin:
          action.payload.user_details && action.payload.user_details.token,
        user_permissions: action.payload && action.payload.user_permissions,
        permissions: action.payload.permissions,
        location: action.payload.location,
      };

    case ERROR_DATA:
    //   sendLog({
    //     action,
    //     user_id: state.user_details ? state.user_details.id : "",
    //     email: state.user_details ? state.user_details.email : "",
    //     business_id: state.business_details
    //       ? state.business_details.number
    //       : "",
    //     business_name: state.business_details
    //       ? state.business_details.business_name
    //       : "",
    //   });
      return {
        ...state,
        error_details: action.payload,
        location:
          action.payload && action.payload.error_source
            ? action.payload.error_source
            : action.name,
      };
    default:
      return {
        ...state,
        error_details: "",
        location: "",
      };
  }
}

// const sendLog = (postData) => {
//   let instance = new LogglyTracker();
//   instance.push({
//     logglyKey: process.env.REACT_APP_LOGGLY_CUSTOMER_TOKEN,
//     sendConsoleErrors: true,
//     tag: process.env.REACT_APP_LOGGLY_TAG,
//     useDomainProxy: false,
//     level: "error",
//   });
//   instance.track(postData);
// };
