/** @format */

import {
    BASE_URL,
    ERROR_DATA,
    WHITE_LABEL,
    UPDATE,
    QUERY,
    USER_PROFILE,
    LOGIN,
    UPDATE_USER_PROFILE,
    FEEDBACK, LOADING_TRANSACTIONS, UPDATE_SINGLE_BUSINESS, UPDATE_SINGLE_CHECKOUT_AD, USER_PERMISSIONS
} from "./types";
import { loadState } from "../utils/localStorage";
import { } from "moment";
import axios from "axios";
import { auth, query, executeActions } from ".";
import moment from 'moment';
import { isEmpty } from "lodash";


export const recoverPassword = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `auth/user/recoverpassword/${postData.data.email}`,
      data: postData.data,
      location: postData.location,
      name: "recover_password",
      type: "POST",
    },
    dispatch
  );
};

export const passwordReset = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `auth/user/password`,
      data: postData.data,
      location: postData.location,
      name: "password_reset",
      type: "PUT",
    },
    dispatch
  );
};

export const createPaymentLink = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `paymentlink/addpaymentlink/${getState().data.business_details.number}`,
      data: postData.data,
      name: "create_payment_link",
      location: "create_payment_link",
      type: "POST",
    },
    dispatch
  );
};

export const updatePaymentLink = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `paymentlink/updatepaymentlink/${getState().data.business_details.number}`,
      data: postData.data,
      // location: postData.location,
      name: "update_payment_link",
      location: "update_payment_link",
      type: "PUT",
    },
    dispatch
  );
};


export const walletTopUp = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/generate/walletpaymentlink/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "wallet",
      type: "POST",
    },
    dispatch
  );
};

export const transferFund = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL:
        postData.data && postData.data.transReference
          ? `business/pocketprofile/${getState().data.business_details.number}/transfer/validate`
          : `business/pocketprofile/${getState().data.business_details.number}/transfer`,
      data: postData.data,
      location: postData.location,
      name: postData.location,
      type: "PUT",
    },
    dispatch
  );
};

export const refundTransfer = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/pocketprofile/${getState().data.business_details.number}/transfer/reverse/${postData.transRef}`,
      data: postData.data,
      location: postData.location,
      name: "refund_transfer",
      type: "PUT",
    },
    dispatch
  );
};

export const transferSettlementFund = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/${getState().data.business_details.number}/settlements/${postData.data.cycleRef}/pushtobank`,
      data: postData.data,
      location: postData.location,
      name: "transfer_settlement_fund",
      type: "PUT",
    },
    dispatch
  );
};

export const searchPocketCustomer = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: !postData.size
        ? `business/pocketprofile/${getState().data.business_details.number}/customerprofiles/search`
        : `business/pocketprofile/${getState().data.business_details.number
        }/customerprofiles/search?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      data: postData.data,
      location: postData.location,
      parent_value: true,
      name: "search_pocket_customer",
      type: "POST",
    },
    dispatch
  );
};

export const searchPocketTransaction = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/customerprofiles/search?q=${postData.search_term
        }&start_date=${postData.start_date}&stop_date=${postData.stop_date
        }&page=${(postData.page - 1) * postData.size || 0}&size=${postData.size || 25
        }`,
      name: "wallet_payouts",
    },
    dispatch
  );
};

export const addPocketCustomer = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/pocketprofile/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "add_pocket_customer",
      type: "POST",
    },
    dispatch
  );
};

export const addProduct = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `products/add/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "product",
      type: "POST",
    },
    dispatch
  );
};

export const updateProduct = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `products/business/${getState().data.business_details.number}/product/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "product",
      type: "PUT",
    },
    dispatch
  );
};

export const uploadProductImage = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: !postData.imageId ?
        postData.multiple ? `products/business/${getState().data.business_details.number}/product/${postData.id}/uploadmultipleimages`
          : `products/business/${getState().data.business_details.number}/product/${postData.id}/uploadimage`
        : `products/business/${getState().data.business_details.number}/product/${postData.id}/uploadimage/${postData.imageId}`,
      data: postData.data,
      location: postData.location,
      name: "product_image_upload",
      type: "PUT",
      onUploadProgress: postData.onUploadProgress,
    },
    dispatch
  );
};



export const deleteProduct = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `products/business/${getState().data.business_details.number}/product/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "product",
      type: "DELETE",
    },
    dispatch
  );
};

export const updateCategory = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `products/business/categories/business/${getState().data.business_details.number}/cat/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "product_category",
      type: "PUT",
    },
    dispatch
  );
};

export const addCategory = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `products/business/categories/${getState().data.business_details.number}`,
      data: postData.data,
      location: "new_category",
      name: "new_category",
      type: "POST",
    },
    dispatch
  );
};

export const deleteCategory = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `products/business/categories/business/${getState().data.business_details.number}/cat/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "product_category",
      type: "DELETE",
    },
    dispatch
  );
};

export const addMerchantBank = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.business_details.number}/payout`,
      data: postData.data,
      location: postData.location,
      name: "bank_details",
      type: "POST",
    },
    dispatch
  );
};

export const addBusiness = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/addbusiness/${getState().data.user_details.id}/newbusiness/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "new_business",
      type: "POST",
    },
    dispatch
  );
};

export const paymentLink = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/branch/${getState().data.business_details.number}/sendaccount/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "payment_link",
      type: "POST",
    },
    dispatch
  );
};

export const addBranch = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/addbranch/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "branch",
      type: "POST",
    },
    dispatch
  );
};

export const assignStaticAccNumber = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/branch/${getState().data.business_details.number}/assignaccount/${postData.branchId}`,
      data: postData.data,
      location: postData.location,
      name: "branch_account_number",
      type: "POST",
    },
    dispatch
  );
};

export const updateBranch = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/branch/${getState().data.business_details.number}/branch/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "branch",
      type: "PUT",
    },
    dispatch
  );
};

export const addBusinessAdvert = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/addcheckoutadvert/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "add_advert",
      type: "POST",
    },
    dispatch
  );
};

export const setCheckoutAdsStatus = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/checkoutadvert/changestatus/${getState().data.business_details.number}?status=${postData.status}`,
      data: postData.data,
      location: postData.location,
      name: "update_ads_status",
      type: "PUT",
    },
    dispatch
  );
};

export const createFrontStore = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/addstore/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "create_front_store",
      type: "POST",
    },
    dispatch
  );
};

export const updateFrontStore = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/updatestore/${getState().data.business_details.number}/${postData.storeId}`,
      data: postData.data,
      location: postData.location,
      name: "update_front_store",
      type: "PUT",
    },
    dispatch
  );
}

export const updateOrderStatus = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/updateorderstatus/${getState().data.business_details.number}/${postData.storeId}/${postData.transactionRef}`,
      data: postData.data,
      location: postData.location,
      name: "update_order_status",
      type: "PUT",
    },
    dispatch
  );
};

export const updateTheme = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/updatetheme/${getState().data.business_details.number}/${postData.storeId}`,
      data: postData.data,
      location: "update_theme",
      name: "update_theme",
      type: "PUT",
    },
    dispatch
  );
};

export const updateSingleAdsStatus = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/checkoutadvert/${getState().data.business_details.number}/advert/${postData.id}?status=${postData.status}`,
      location: "update_single_advert_status",
      name: "update_single_advert_status",
      type: "PUT",
    },
    dispatch
  );
};

export const updateBusinessAdvert = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/updatecheckoutadvert/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "update_advert",
      type: "PUT",
    },
    dispatch
  );
};

export const dispatchBusinessAdvert = (postData) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_SINGLE_CHECKOUT_AD,
    payload: postData
  })
};

export const addRefund = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.business_details.number}/refunds`,
      data: postData.data,
      location: postData.location,
      name: "refund",
      type: "POST",
    },
    dispatch
  );
};

export const nameInquiry = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/account/nameenquiry`,
      data: postData.data,
      location: postData.location,
      name: "name_inquiry",
      type: "POST",
    },
    dispatch
  );
};

export const transferNameInquiry = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/pocketprofile/${getState().data.business_details.number}/transfer/nameenquiry`,
      data: postData.data,
      location: postData.location,
      name: "transfer_name_inquiry",
      type: "PUT",
    },
    dispatch
  );
};

export const replyDispute = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.business_details.number}/disputes/${postData.url.dispute_ref}/${postData.url.action}`,
      data: postData.data,
      location: postData.location,
      name: "dispute",
      type: "PUT",
    },
    dispatch
  );
};

export const addRole = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}/roles`,
      data: postData.data,
      location: postData.location,
      name: "role",
      type: "POST",
    },
    dispatch
  );
};

export const deleteRole = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}/roles/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "role",
      type: "DELETE",
    },
    dispatch
  );
};

export const emailReport = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `transaction/${getState().data.business_details.number}/sendreport?startDate=${postData.start_date}&endDate=${postData.stop_date}&type=${postData.type}`,
      data: postData.data,
      location: postData.location,
      name: "email_report",
      type: "POST",
    },
    dispatch
  );
};

export const createDeliveryZone = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/adddeliveryregion/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "create_delivery_zone",
      type: "POST",
    },
    dispatch
  );
}

export const loadProductOrders = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/loadorders/${getState().data.business_details.number}/${postData.storeId}?size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}&q=ALL&startDate=&endDate=`,
      name: "store_orders",
    },
    dispatch
  );
};

export const loadProductOrdersDetails = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/loadordersitems/${getState().data.business_details.number}/${postData.storeId}?transactionRef=${postData.transactionRef}`,
      name: "get_order_details",
    },
    dispatch
  );
};

export const generateCoupon = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/generatecouponcode/${getState().data.business_details.number}/${postData.storeId}`,
      name: "generate_coupon",
      location: "generate_coupon"
    },
    dispatch
  );
};

export const getDeliveryZone = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/getdeliveryregion/${getState().data.business_details.number}/${postData.storeId}?size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}`,
      name: "get_delivery_zone",
    },
    dispatch
  );
};

export const getCountries = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `auth/countries`,
      name: "countries",
    },
    dispatch
  );
};

export const validateCustomUrl = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `paymentlink/validatecustomurl/${getState().data.business_details.number}/${postData.data}`,
      name: "validatecustomurl",
    },
    dispatch
  );
};

export const validateStoreName = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/validatestorename/storeName=${postData.data}`,
      name: "validatestorename",
    },
    dispatch
  );
};

export const getStoreDetails = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/getstore/${getState().data.business_details.number}?size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}&storeName=${postData.storeName || "ALL"}`
      ,
      name: "store_details",
    },
    dispatch
  );
};

export const getPaymentLinks = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `paymentlink/getpaylink/${getState().data.business_details.number}/ByBusinessId/${getState().data.business_details.number}?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      name: "get_payment_links",
    },
    dispatch
  );
};

export const createCoupon = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/addcoupon/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "create_coupon",
      type: "POST",
    },
    dispatch
  );
};

export const createStoreSettings = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/updateadvancedconfig/${getState().data.business_details.number}/${postData.storeId}`,
      data: postData.data,
      location: postData.location,
      name: "create_store_settings",
      type: "PUT",
    },
    dispatch
  );
};

export const addStoreProduct = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/addproducttostore/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "add_product_store",
      type: "POST",
    },
    dispatch
  );
};

export const createGeneralStoreSettings = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `store/updategeneralconfig/${getState().data.business_details.number}/${postData.storeId}`,
      data: postData.data,
      location: postData.location,
      name: "create_general_store_settings",
      type: "PUT",
    },
    dispatch
  );
};


export const getTheme = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/gettheme?size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}`,
      name: "store_theme",
    },
    dispatch
  );
};


export const loadStoreProducts = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/loadproducts/${getState().data.business_details.number}/${postData.storeId}?size=${postData && postData.size ? postData.size : 25}&page=${postData && postData.size && postData.start ? (postData.start - 1) * postData.size : 0}&productName=&status=&startDate=&endDate`,
      name: "store_products",
    },
    dispatch
  );
};



export const getCoupon = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/getcoupon/${getState().data.business_details.number}/${postData.storeId}?size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}&couponCode=all&couponType=all&startDate=&endDate=`,
      name: "get_coupon",
    },
    dispatch
  );
};


export const loadAllStoreDetails = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `store/getstorebyid/${getState().data.business_details.number}/${postData.storeId}`,
      name: "all_store_details",
    },
    dispatch
  );
};

export const getAllowedCurrencies = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/loadbusinessallowedcurrencies`,
      name: "get_allowed_currencies",
    },
    dispatch
  );
};

export const searchPaymentLink = (postData) => (dispatch, getState) => {
  // URL: `paymentlink/getpaylink/${getState().data.business_details.number}/ByBusinessId/${getState().data.business_details.number}?page=${postData ? (postData.start - 1) * postData.size : 0
  // }&size=${postData ? postData.size : 25}`,
  query(
    {
      URL: `paymentlink/getpaylink/${getState().data.business_details.number}/ByBusinessId/${getState().data.business_details.number}${postData.param ? '/PaymentLinkName/' + postData.param : ''}?page=${postData ? postData.start : 0}&size=${postData ? postData.size : 25}`,
      name: "search_payment_links",
    },
    dispatch
  );
}

export const getKYC = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/kycdocuments/${getState().data.business_details.number}`,
      name: "kyc",
    },
    dispatch
  );
};

export const getUsers = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `users/${getState().data.user_details.id}/invitedusers`,
      name: "users",
    },
    dispatch
  );
};
export const getBusinessUsers = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/users`,
      name: "business_users",
    },
    dispatch
  );
};

export const getProgressStatus = () => (dispatch, getState) => {
  query(
    {
      URL: `user/business/${getState().data.business_details.number}/progressstatus`,
      name: "onboarding",
    },
    dispatch
  );
};

export const getPermissions = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.user_details.id}/permissions`,
      name: "permissions",
    },
    dispatch
  );
};

export const getBusinessAdvert = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/checkoutadverts/${getState().data.business_details.number}`,
      name: "business_advert",
    },
    dispatch
  );
};

export const getDispute = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/disputes/ref/${postData.ref}`,
      name: "single_dispute",
      parent_value: true,
    },
    dispatch
  );
};

export const getPocketCustomers = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/pocketprofile/${getState().data.business_details.number
        }/customerprofiles?page=${postData ? (postData.start - 1) : 0
        }&size=${postData ? postData.size : 25}`,
      name: "pocket_customers",
      location: postData.location,
      parent_value: true,
    },
    dispatch
  );
};

export const getPocketCustomerTransactions = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/pocketprofile/${getState().data.business_details.number}/pocket/${postData.pocketReferenceId
        }?type=${postData.type}&page=${postData ? postData.start : 0
        }&size=${postData ? postData.size : 25}`,
      name:
        postData.type === "ALL"
          ? "customer_pocket_credit"
          : "customer_pocket_debit",
      parent_value: true,
      location:
        postData.type === "ALL"
          ? "customer_pocket_credit"
          : "customer_pocket_debit",
    },
    dispatch
  );
};

export const getWalletTransaction = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/pocketprofile/${getState().data.business_details.number
        }/merchantpocket?type=${postData.type}&page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      name: postData.type === "ALL" ? "wallet_payouts" : "wallets",
      parent_value: true,
    },
    dispatch
  );
};

export const getUserById = (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.user_details.id}`,
      name: "user_data",
    },
    dispatch
  );
};

export const getSampleTransactions = () => (dispatch, getState) => {
  dispatch({
    type: LOADING_TRANSACTIONS,
    name: 'loading_transactions',
    payload: true,
  });
  query(
    {
      URL: `user/${getState().data.business_details.number}/transactions/landingtransactions`,
      name: "sample_transactions",
    },
    dispatch,
    dispatch({
      type: LOADING_TRANSACTIONS,
      name: 'loading_transactions',
      payload: false,
    })
  )
};



export const getTransactions = (
  from = 1,
  to = 25,
  cur,
  type = "ALL"
) => (dispatch, getState) => {
  dispatch({
    type: LOADING_TRANSACTIONS,
    payload: true,
  });
  const transformed_from = from !== 0 ? (from - 1) * to : from
  query(
    {
      URL: cur ? `user/${getState().data.business_details.number}/transactions?page=${transformed_from}&size=${to}&cur=${cur}&type=${type}`
        : `user/${getState().data.business_details.number}/transactions?page=${(from - 1) * to
        }&size=${to}&type=${type}`,
      name: "transactions",
      parent_value: true,
    },
    dispatch
  ).then(res => {
    dispatch({
      type: LOADING_TRANSACTIONS,
      payload: false,
    })
  })
    .catch(res => {
      dispatch({
        type: LOADING_TRANSACTIONS,
        payload: false,
      })
    })
};



export const getBranchSummary = () => (dispatch, getState) => {
  query(
    {
      URL: `business/branches/summary/${getState().data.business_details.number}?transDate=${moment().format("DD-MM-yyyy")}`,
      name: "branch_summary",
    },
    dispatch
  );
};

export const filterTransactions = (
  from,
  to,
  start,
  size = 50,
  cur = getState().data.business_details.default_currency,
  type = "ALL"
) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number
        }/transactions/start/${from}/stop/${to}/?page=${(start - 1) * size
        }&size=${size}&cur=${cur}&type=${type}`,
      name: "transactions",
      parent_value: true,
    },
    dispatch
  );
};

export const getTransactionRange = (postData) => (dispatch, getState) => {
  getState().data.business_details && query(
    {
      URL: `user/${getState().data.business_details.number}/transactions/range/${postData.DAY}/${postData.DATE}/${postData.LENGTH}`,
      name: "transaction_range",
    },
    dispatch
  );
};

export const searchProducts = (from, to, search_term = "", type = false) => (
  dispatch
) => {
  query(
    {
      URL: `products/business/${getState().data.business_details.number
        }/?q=${search_term}&page=${from - 1}&size=${to}&type=${type}`,
      name: "products",
      parent_value: true,
    },
    dispatch
  );
};

export const searchTransactions = (
  from,
  to,
  start_date,
  stop_date,
  search_term = "",
  cur = getState().data.business_details.default_currency,
  type = "ALL",
  showFilter,
  selectedpaymentOption = "",
  transactionReference,
  productId,
) => (dispatch, getState) => {
  dispatch({
    type: LOADING_TRANSACTIONS,
    payload: true,
  });
  query(
    {
      URL: showFilter && showFilter ? (
        `business/${getState().data.business_details.number
        }/transactions/search?q=${!isEmpty(transactionReference) ? transactionReference : ''}${!isEmpty(productId) ? '&product_id=' + productId : ''}&start_date=${start_date}&stop_date=${stop_date}&page=${from - 1}&size=${to}&cur=${cur}&type=${type}&channel=${selectedpaymentOption}`
      ) : (
        `transaction/${getState().data.business_details.number
        }/searchtransactions?search=${!isEmpty(transactionReference) ? transactionReference : ''}&product_id=${!isEmpty(productId) ? '&product_id=' + productId : ''}&cur=${cur}`
      ),
      name: "transactions",
      parent_value: true,
    },
    dispatch
  ).then(res => {
    dispatch({
      type: LOADING_TRANSACTIONS,
      payload: false,
    })
    if (res.responseCode !== '00') {
      dispatch({
        type: "transactions",
        payload: [],
      })
    }
  })
    .catch(res => {
      dispatch({
        type: "transactions",
        payload: [],
      })
      dispatch({
        type: LOADING_TRANSACTIONS,
        payload: false,
      })
    })
};

export const getRefunds = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/refunds?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      name: "refunds",
    },
    dispatch
  );
};
export const getBranches = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/allbranches/${getState().data.business_details.number}`,
      name: "branches",
      parent_value: true,
    },
    dispatch
  );
};

export const getProductCategories = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `products/business/categories/${getState().data.business_details.number
        }/?page=${postData ? (postData.start - 1) * postData.size : 0}&size=${postData ? postData.size : 25
        }`,
      name: "product_categories",
      parent_value: true,
    },
    dispatch
  );
};

export const getProducts = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `products/business/${getState().data.business_details.number}/?page=${postData ? (postData.start - 1) : 0
        }&size=${postData ? postData.size : 25}`,
      name: "products",
      parent_value: true,
    },
    dispatch
  );
};

export const getProductsOrder = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `products/business/${getState().data.business_details.number
        }/orders?q=${postData.ref}&page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      name: "get_products_order",
      location: postData.location,
      parent_value: true,
    },
    dispatch
  );
};

export const getPayouts = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/settlement?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}${postData && postData.cur ? `&cur=${postData.cur}` : ""
        }`,
      name: "payouts",
      parent_value: true,
    },
    dispatch
  );
};

export const getSettlements = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/settlement?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}${postData && postData.cur ? `&cur=${postData.cur}` : ""
        }`,
      name: "payouts",
      parent_value: true,
    },
    dispatch
  );
};

export const getInternationalPayouts = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number
        }/settlement/international?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25} ${postData && postData.cur ? `&cur=${postData.cur}` : ""
        }`,
      name: "payouts",
      parent_value: true,
    },
    dispatch
  );
};

export const getCustomers = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/customers?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 20}`,
      name: "customers",
      parent_value: true,
    },
    dispatch
  );
};

export const searchCustomers = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `transaction/${getState().data.business_details.number}/searchcustomers?search=${postData.param}`,
      name: "customers",
      parent_value: true,
    },
    dispatch
  );
};

export const searchRefunds = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/refunds/search?q=${postData.search_term}&start_date=${postData.start_date}&stop_date=${postData.stop_date}${postData.refundSource ? '&type=' + postData.refundSource : ''}&page=${postData.page - 1 || 0}&size=${postData.size || 2}`,
      name: "refunds",
    },
    dispatch
  );
};

export const verifyEmail = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `auth/validateemail/${postData.token}`,
      name: "activate",
    },
    dispatch
  );
};


export const getVendorSettlements = (postData) => (dispatch, getState) => {
  query(
    {
      URL: postData.start_date ? `subaccount/subaccountsettlements/${getState().data.business_details.number}/${postData.subAccountId}
      ?startDate=${postData.start_date}&endDate=${postData.stop_date}&size=${postData ? postData.size : 25
        }&page=${postData ? (postData.start - 1) * postData.size : 0}`
        : `subaccount/subaccountsettlements/${getState().data.business_details.number}/${postData.subAccountId}
      ?size=${postData ? postData.size : 25
        }&page=${postData ? (postData.start - 1) * postData.size : 0}`,
      name: "vendor_settlements",
    },
    dispatch
  );
};

export const searchDisputes = (postData) => (dispatch, getState) => {
  const { data } = postData
  executeActions(
    {
      URL: `user/${getState().data.business_details.number}/disputes/searchv2?page=${postData ? (postData.page - 1) : 0}&size=${postData ? postData.size : 25}`,
      data: data,
      name: postData.location,
      location: postData.location,
      type: "POST",
      parent_value: true,
    },
    dispatch
  );
};

export const deleteSplitAccount = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `subaccount/deletesubaccountsetup/${getState().data.business_details.number}/${postData.id}`,
      location: postData.location,
      name: "delete_subaccount",
      type: "DELETE",
    },
    dispatch
  );
};

export const getVendorTransactions = (postData) => (dispatch, getState) => {
  query(
    {
      URL: postData.start_date ? `subaccount/transactions/${getState().data.business_details.number}/${postData.subAccountId}?startDate=${postData.start_date}&endDate=${postData.stop_date}&size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}&type=all`
        : `subaccount/transactions/${getState().data.business_details.number}/${postData.subAccountId}
      ?&size=${postData ? postData.size : 25}&page=${postData ? (postData.start - 1) * postData.size : 0}&type=all`,
      name: "vendor_transactions",
    },
    dispatch
  );
};

export const getVendorTransactionOverview = (postData) => (dispatch, getState) => {
  query(
    {
      URL: !postData.start_date ?
        `subaccount/transactions/summary/${getState().data.business_details.number}/${postData.subAccountId}`
        : `subaccount/transactions/summary/${getState().data.business_details.number}/${postData.subAccountId}?startDate=${postData.start_date}&endDate=${postData.stop_date}`,
      name: "vendor_transaction_overview",
    },
    dispatch
  );
};

export const getVendors = (postData) => (dispatch, getState) => {
  query(
    {
      URL: postData && postData.type ? (
        `subaccount/getallsubaccountsetup/${getState().data.business_details.number}/search?size=${postData ? postData.size : 25
        }&page=${postData ? (postData.start - 1) * postData.size : 0}&type=${postData && postData.type}`
      ) : (
        `subaccount/getallsubaccountsetup/${getState().data.business_details.number}?size=${postData ? postData.size : 25
        }&page=${postData ? (postData.start - 1) * postData.size : 0}`
      ),
      name: "get_vendors",
    },
    dispatch
  );
};

export const searchVendor = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `subaccount/getallsubaccountsetup/${getState().data.business_details.number}/${postData.searchParam}`,
      name: "search_vendor",
    },
    dispatch
  );
};

export const searchPayouts = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/settlements/search?q=${postData.search_term
        }&start_date=${postData.start_date}&stop_date=${postData.stop_date
        }&page=${(postData.page - 1) * postData.size || 0}&size=${postData.size || 25
        }`,
      name: "payouts",
    },
    dispatch
  );
};

export const getSettlementTransaction = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/settlement/${postData.cycleRef
        }/transactions?page=${0}&size=${100000}`,
      name: "settlement_transactions",
      parent_value: true,
    },
    dispatch
  );
};

export const getBranchTransactions = (
  branchNumber,
  from = 1,
  to = 25,
  type = "ALL"
) => (dispatch, getState) => {
  query(
    {
      URL: `business/branches/transactions/${getState().data.business_details.number
        }/branch/${branchNumber}?page=${(from - 1) * to}&size=${to}&type=${type}`,
      name: "branch_transactions",
      parent_value: true,
    },
    dispatch
  );
};

export const getBranchSettlementTransactions = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/branch/${getState().data.business_details.number}/settlement/${postData.cycleRef}/ref/${postData.branchRef}`,
      name: "settlement_transactions",
      parent_value: true,
    },
    dispatch
  );
};
export const getBranchSettlement = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/branch/${getState().data.business_details.number}/settlement/${postData.cycleRef}`,
      name: "branch_settlements",
      parent_value: true,
    },
    dispatch
  );
};

export const getDisputes = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.business_details.number}/disputes?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      name: "disputes",
      parent_value: true,
    },
    dispatch
  );
};

export const getBranchPayout = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `business/branch/settlement/${getState().data.business_details.number
        }/branch/${postData.branch}?page=${postData ? (postData.start - 1) * postData.size : 0
        }&size=${postData ? postData.size : 25}`,
      name: "branch_payout",
    },
    dispatch
  );
};

export const getBankList = (postData) => (dispatch, getState) => {
    const bizCountry = getState().data.business_details &&
        getState().data.business_details.country &&
        getState().data.business_details.country.countryCode;

  query(
    {
      URL: `banks/country/${(bizCountry || 'NG')
        }?p=false`,
      name: "bank_list",
    },
    dispatch
  );
  // query(
  //     {
  //         URL: `banks/country`,
  //         name: "bank_list",
  //     },
  //     dispatch
  // );
};

export const getIndustries = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `industry?page=${0}&size=${1000}`,
      name: "industry_list",
    },
    dispatch
  );
};

export const getMerchantBank = (postData) => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.user_details.id}/payout`,
      name: "bank_details",
    },
    dispatch
  );
};

export const getBusiness = () => (dispatch, getState) => {
  query(
    {
      URL: `user/${getState().data.user_details.id}/business`,
      name: "business_details",
      index: getState().data.business_details.number,
      parent_value: true,
    },
    dispatch
  );
};
export const dispatchUpdateSingleBusiness = (res) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_SINGLE_BUSINESS,
    payload: res,
  });
};

export const getRoles = () => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/roles`,
      name: "roles",
    },
    dispatch
  );
};

export const setBusiness = (data) => (dispatch, getState) => {
  const param = data;
    const user_ps = param.role ? param.role.permissions : []
    const user_ps_branch = param.business ?
        param.business.invoice ?
        param.business.invoice.active ? ['ACCESS_BRANCHES'] :
            [] : [] : []
    const permissions = [...user_ps, ...user_ps_branch ]

  dispatch({
    name: "business",
    location: "set_business",
    spread: true,
    payload: {
      business_details: param.business,
      user_permissions: param.role && param.role.permissions,
        permissions: param.role && param.role.permissions,
    },
    type: QUERY,
  });

    dispatch({
        type:USER_PERMISSIONS,
        payload: permissions
    });
};


export const getBusinessAnalysis = (
  cur = getState().data.business_details.default_currency
) => (dispatch, getState) => {
  query(
    {
      URL: `business/${getState().data.business_details.number}/analytics?cur=${cur}`,
      name: "business_analytics",
    },
    dispatch
  );
};


export const inviteUser = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}/invite`,
      name: "invite_user",
      data: postData.data,
      location: postData.location,
      type: "POST",
    },
    dispatch
  );
};

export const createSplitAccount = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `subaccount/postsubaccountsetup/${getState().data.business_details.number}`,
      name: "create_split_account",
      data: postData.data,
      location: postData.location,
      type: "POST",
    },
    dispatch
  );
};

export const requestReport = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `transaction/${getState().data.business_details.number}/sendreport/link?transactionType=${postData.status}`,
      name: "request_report",
      data: postData.data,
      location: postData.location,
      type: "POST",
    },
    dispatch
  );
};

export const updateSplitAccount = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `subaccount/updatesubaccountsetup/${getState().data.business_details.number}/${postData.subAccountId}`,
      name: "update_split_account",
      data: postData.data,
      location: postData.location,
      type: "PUT",
    },
    dispatch
  );
};

export const fixUserToBranch = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/assignbranch/${getState().data.business_details.number}/user/${postData.userId}/branch/${postData.branchNumber}?status=${postData.mode}`,
      data: postData.data,
      location: postData.location,
      name: "user",
      type: "PUT",
    },
    dispatch
  );
};

export const switchUserMode = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/switchaccountmode/${getState().data.business_details.number}/user/${postData.userId}?${postData.type}`,
      data: postData.data,
      location: postData.location,
      name: postData.location === "update_user_role" ? "user" : "user_details",
      type: "PUT",
      additionalData:
        postData.location === "update_user_role"
          ? {}
          : { ...getState().data.user_details },
    },
    dispatch
  );
};

export const saveBusinessDetails = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/updatebusinessdetails/${getState().data.business_details.number}/${postData.userId}`,
      data: postData.data,
      location: postData.location,
      name: postData.location,
      type: "PUT"
    },
    dispatch
  );
};

export const saveBusinessSupport = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/updatebusinesssupport/${getState().data.business_details.number}/${postData.userId}`,
      data: postData.data,
      location: postData.location,
      name: postData.location,
      type: "PUT"
    },
    dispatch
  );
};

export const saveBusinessSettlements = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/updatebusinesssettlement/${getState().data.business_details.number}/${postData.userId}`,
      data: postData.data,
      location: postData.location,
      name: postData.location,
      type: "PUT"
    },
    dispatch
  );
};

export const saveBusinessKyc = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/updatebusinesscertificate/${getState().data.business_details.number}/${postData.userId}`,
      data: postData.data,
      location: postData.location,
      name: postData.location,
      type: "PUT"
    },
    dispatch
  );
};

export const updateUserRole = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `business/${getState().data.business_details.number}/users/switchrole`,
      data: postData.data,
      location: postData.location,
      name: "business_details",
      type: "PUT",
    },
    dispatch
  );
};

export const updateBusiness = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL:
        postData.type === "setting"
          ? `business/${getState().data.business_details.number}/setting`
          : postData.type === "settlement_email"
            ? `business/${getState().data.business_details.number}/addupdateSettlementEmailList`
            : `user/${getState().data.user_details.id}/business/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "business_details",
      type: "PUT",
      onUploadProgress: postData.onUploadProgress,
    },
    dispatch
  );
};

export const updateSettlement = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}/business/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "business_details",
      type: "PUT",
    },
    dispatch
  );
};

export const switchMode = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/switchmode/${getState().data.user_details.id}/business/${getState().data.business_details.number}`,
      data: postData.data,
      location: postData.location,
      name: "business_details",
      type: "PUT",
    },
    dispatch
  );
};

export const updateMerchantBank = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}/payout`,
      data: postData.data,
      location: postData.location,
      name: "bank_details",
      type: "PUT",
    },
    dispatch
  );
};

export const updateRole = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}/roles/${postData.id}`,
      data: postData.data,
      location: postData.location,
      name: "role",
      type: "PUT",
    },
    dispatch
  );
};

export const resetKeys = (postData) => (dispatch, getState) => {
  // props, dispatch, type, fn;
  executeActions(
    {
      URL: `business/${getState().data.business_details.number}/resetkeys`,
      data: postData.data,
      location: postData.location,
      name: "reset_keys",
      type: "PUT",
    },
    dispatch
  );
};

export const updateUser = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `user/${getState().data.user_details.id}`,
      data: postData.data,
      location: postData.location,
      name: "user_details",
      type: "PUT",
      additionalData: { ...getState().data.user_details },
    },
    dispatch
  );
};



export const setWhiteLabel = (postData) => (dispatch, getState) => {
  dispatch({
    type: WHITE_LABEL,
    payload: postData,
    name: "white_label",
    parent_value: true,
  });
};
export const saveKey = (business_key) => (dispatch, getState) => {
  dispatch({
    type: UPDATE,
    name: "business_key",
    payload: { data: business_key, location: "switchMode" },
    parent_value: true,
  });
};

export const setErrorLog = (postData) => (dispatch, getState) => {
  dispatch({ type: ERROR_DATA, payload: "" });
};

export const clearState = (postData) => (dispatch, getState) => {
  dispatch({ type: UPDATE, field: postData, clear: true });
};

export const getSingleTransaction = async (param, response) => {
  return axios(
    `${BASE_URL}transaction/${getState().data.business_details.number}/searchtransactions?search=${param}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${getState().data.user_details.token}`,
      },
    }
  ).then((res) => res.data);
};

export const userLogin = (postData) => (dispatch, getState) => {
  auth(
    {
      URL: `auth/login`,
      data: postData.data,
      location: postData.location,
    },
    dispatch
  );
};

export const dispatchUserDetails = (user_details) => (dispatch, getState) => {
  dispatch({
    type: LOGIN,
    payload: {
      user_details: user_details.payload,
      location: "login",
      business_details:
        Array.isArray(user_details.payload.businessList) ? user_details.payload.businessList.length === 1
          ? user_details.payload.businessList[0].business
          : {} : {},
      user_permissions:
        Array.isArray(user_details.payload.businessList) ? user_details.payload.businessList.length === 1
          ? user_details.payload.businessList[0].role.permissions
          : [] : [],
    },
  });
};

export const dispatchUpdateProfile = (user_details) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_USER_PROFILE,
    payload: user_details
  });
};

export const newUser = (postData) => (dispatch, getState) => {
  executeActions(
    {
      URL: `auth/register`,
      data: postData.data,
      location: postData.location,
      name: postData.location,
      type: "POST",
    },
    dispatch
  );
};

export const completeRegistration = (postData) => (dispatch, getState) => {
  auth(
    {
      URL: `auth/completeregistration/${postData.token}`,
      data: postData.data,
      location: postData.location,
    },
    dispatch
  );
};
