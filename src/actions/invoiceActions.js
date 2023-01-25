import {
  LOADING_INVOICES,
  INVOICES,
  LOADING_INVOICE_CUSTOMERS,
  INVOICE_CUSTOMERS,
  INVOICE_NUMBER,
  GENERATING_INVOICE_NUMBER,
  LOADING_INVOICE_0VERVIEW,
  INVOICE_0VERVIEW,
  CREATING_INVOICE,
} from "./types";
import { getRequest, postRequest } from "../services/apiService";
import { BASE_URL_INVOICE } from "../actions/types";
import { alertError, alertExceptionError, alertSuccess } from "modules/alert";

export const createInvoice = (data, id) => (dispatch, getState) => {
  dispatch({
    type: CREATING_INVOICE,
    payload: true,
  });
  postRequest(`${BASE_URL_INVOICE}invoice/${id}`, data)
    .then((data) => {
      dispatch({
        type: CREATING_INVOICE,
        payload: false,
      });
      if (data) {
        dispatch(getInvoices(0, 25));
        alertSuccess("An Invoice was successfully created.");
      } else {
        alertError(data.message
            ? data.message || data.message
            : "An error occurred while creating customer. Kindly try again");
      }
    })
    .catch((e) => {
      dispatch({
        type: CREATING_INVOICE,
        payload: false,
      });
      console.log(e?.response?.data?.message);
      alertError(e?.response?.data?.message);
    });
};

export const getInvoices =
  (from = 0, to = 25, search = "") =>
  (dispatch, getState) => {
    dispatch({
      type: LOADING_INVOICES,
      payload: true,
    });
    postRequest(
      `${BASE_URL_INVOICE}invoice/business/${
        getState().data.business_details.number
      }?page=${from}&size=${to}`,
      {
        invoiceNo: search,
      }
    )
      .then((res) => {
        dispatch({
          type: LOADING_INVOICES,
          payload: false,
        });
        if (res.code === 200) {
          dispatch({
            type: INVOICES,
            payload: res,
          });
        } else {
         /* alertError(
            res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again"
          );*/
          dispatch({
            type: INVOICES,
            payload: null,
          });
        }
      })
      .catch((e) => {
        alertExceptionError(e);
        dispatch({
          type: LOADING_INVOICES,
          payload: false,
        });
        dispatch({
          type: INVOICES,
          payload: null,
        });
      });
  };

export const getInvoiceOverview =
  (from = 0, to = 25, search = "") =>
  (dispatch, getState) => {
    dispatch({
      type: LOADING_INVOICE_0VERVIEW,
      payload: true,
    });
    getRequest(
      `${BASE_URL_INVOICE}invoice/overview/${
        getState().data.business_details.number
      }`
    )
      .then((res) => {
        dispatch({
          type: LOADING_INVOICE_0VERVIEW,
          payload: false,
        });
        if (res.code === 200) {
          dispatch({
            type: INVOICE_0VERVIEW,
            payload: res,
          });
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again");
          dispatch({
            type: LOADING_INVOICE_0VERVIEW,
            payload: null,
          });
        }
      })
      .catch((e) => {
        alertExceptionError(e);
        dispatch({
          type: LOADING_INVOICE_0VERVIEW,
          payload: false,
        });
        dispatch({
          type: INVOICE_0VERVIEW,
          payload: null,
        });
      });
  };

export const generateInvoice = () => (dispatch, getState) => {
  dispatch({
    type: GENERATING_INVOICE_NUMBER,
    payload: true,
  });
  getRequest(`${BASE_URL_INVOICE}invoice/generate`)
    .then((res) => {
      dispatch({
        type: GENERATING_INVOICE_NUMBER,
        payload: false,
      });
      if (res.responseCode === 201) {
        dispatch({
          type: INVOICE_NUMBER,
          payload: res,
        });
      } else {
        alertError(res.message
            ? res.message
            : "An Error Occurred sending the request. Kindly try again");
        dispatch({
          type: INVOICE_NUMBER,
          payload: null,
        });
      }
    })
    .catch((e) => {
      alertExceptionError(e);
      dispatch({
        type: GENERATING_INVOICE_NUMBER,
        payload: false,
      });
      dispatch({
        type: INVOICE_NUMBER,
        payload: null,
      });
    });
};

export const getCustomers =
  (from = 0, to = 25, search = "") =>
  (dispatch, getState) => {
    dispatch({
      type: LOADING_INVOICE_CUSTOMERS,
      payload: true,
    });
    getRequest(
      `${BASE_URL_INVOICE}customer/business/${
        getState().data.business_details.number
      }?page=${from}&size=${to}&name=${search}`
    )
      .then((res) => {
        dispatch({
          type: LOADING_INVOICE_CUSTOMERS,
          payload: false,
        });
        if (res.code === 200) {
          dispatch({
            type: INVOICE_CUSTOMERS,
            payload: res,
          });
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again");
          dispatch({
            type: INVOICE_CUSTOMERS,
            payload: null,
          });
        }
      })
      .catch((e) => {
        alertExceptionError(e);
        dispatch({
          type: LOADING_INVOICE_CUSTOMERS,
          payload: false,
        });
        dispatch({
          type: INVOICE_CUSTOMERS,
          payload: null,
        });
      });
  };

export const createCustomer = (payload) => (dispatch, getState) => {
  dispatch({
    type: LOADING_INVOICE_CUSTOMERS,
    payload: true,
  });
  postRequest(
    `${BASE_URL_INVOICE}customer/${getState().data.business_details.number}`,
    payload
  )
    .then((data) => {
      dispatch({
        type: LOADING_INVOICE_CUSTOMERS,
        payload: false,
      });
      if (data) {
        dispatch(getCustomers(0, 25));
        alertSuccess("An Invoice customer was successfully created.");
      } else {
        alertError(data.message
            ? data.message || data.message
            : "An error occurred while creating customer. Kindly try again");
      }
    })
    .catch((e) => {
      dispatch({
        type: LOADING_INVOICE_CUSTOMERS,
        payload: false,
      });
      alertExceptionError(e);
    });
};
