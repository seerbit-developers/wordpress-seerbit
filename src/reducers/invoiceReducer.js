import {
  LOADING_INVOICES,
  INVOICES,
  LOADING_INVOICE_CUSTOMERS,
  INVOICE_CUSTOMERS,
  GENERATING_INVOICE_NUMBER,
  INVOICE_NUMBER,
  LOADING_INVOICE_0VERVIEW,
  INVOICE_0VERVIEW,
  CREATING_INVOICE,
} from "../actions/types";

const initialState = {
  loading_invoices: false,
  invoices: null,
  loading_invoice_customers: false,
  invoice_customers: null,
  generating_invoice_number: false,
  invoice_number: null,
  loading_invoice_overview: false,
  invoice_overview: null,
  creating_invoice: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_INVOICE_CUSTOMERS:
      return {
        ...state,
        loading_invoice_customers: action.payload,
      };
    case INVOICE_CUSTOMERS:
      return {
        ...state,
        invoice_customers: action.payload,
      };
    case LOADING_INVOICES:
      return {
        ...state,
        loading_invoices: action.payload,
      };
    case INVOICES:
      return {
        ...state,
        invoices: action.payload,
      };
    case GENERATING_INVOICE_NUMBER:
      return {
        ...state,
        generating_invoice_number: action.payload,
      };
    case INVOICE_NUMBER:
      return {
        ...state,
        invoice_number: action.payload,
      };
    case LOADING_INVOICE_0VERVIEW:
      return {
        ...state,
        loading_invoice_overview: action.payload,
      };
    case INVOICE_0VERVIEW:
      return {
        ...state,
        invoice_overview: action.payload,
      };
    case CREATING_INVOICE:
      return {
        ...state,
        creating_invoice: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
}
