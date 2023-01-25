import { combineReducers } from "redux";
import postReducer from "./postReducers";
import frontStoreReducer from "./frontStoreReducer";
import userManagementReducer from "./userManagementReducer";
import transactionsReducer from "./transactionsReducer";
import recurringReducer from "./recurringReducer";
import recurrentReducer from "./recurrentReducer";
import settlementReducer from "./settlementReducer";
import authReducer from "./authReducer";
import paymentLinkReducer from "./paymentLinkReducer";
import pocketReducer from "./pocketReducer";
import invoiceReducer from "./invoiceReducer";
import posTerminalsReducer from "./posTerminals";

export default combineReducers({
  data: postReducer,
  frontStore: frontStoreReducer,
  userManagement: userManagementReducer,
  transactions: transactionsReducer,
  recurring: recurringReducer,
  recurrent: recurrentReducer,
  settlement: settlementReducer,
  auth: authReducer,
  paymentLink: paymentLinkReducer,
  pocket: pocketReducer,
  invoice: invoiceReducer,
  posTerminals: posTerminalsReducer
});
