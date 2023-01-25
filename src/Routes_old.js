/** @format */

import React, {lazy} from "react";
import { Switch, Route, Redirect } from "react-router";
import AuthService from "./utils/auth";

// import Error from "./pages/error";
// import "react-table/react-table.css";
import Renderer from "./pages";
// import QuiteSetup from "./pages/quick_setup";
// import PersonalDetails from "./pages/setup/personal_details";
// import BusinessDetails from "./pages/setup/business_details";
// import BankDetails from "./pages/setup/bank_details";
// import Transactions from "./pages/transactions";
// import RefundPage from "./pages/refunds";
// import SettlementPage from "./pages/settlements";
// import SplitSettlementsPage from "./pages/split_settlements";
// import WalletPage from "./pages/wallets";
// import TransferPage from "./pages/transfer";
// import CustomerPocketsPage from "./pages/customer_pockets";
// import DisputePage from "./pages/disputes";
// import ProductPage from "./pages/products";
// import CustomerPage from "./pages/customers";
// import ProductCategoryPage from "./pages/products/category";
// import BusinessBranchPage from "./pages/branches";
// import BrancheDetails from "./utils/analytics/branch_details";
// import AuditLog from "./pages/audit_log";
// import Settings2 from "./pages/settings";
// import ResetPassword from "./pages/reset_password";
// import RecoverPassword from "./pages/reset_password/recover_password";
// import Signup from "./pages/register";
// import JoinTeam from "./pages/register/join-team";
import Login from "./pages/login";
// import BusinessList from "./pages/setup/business_list";
// import WhiteLabel from "./pages/setup";
// import PreAuthPage from "./pages/pre_auth";
// import PaymentLink from "./pages/payment_link";
// import PinCode from "./pages/pin_code";
const Error = lazy(() => import('./pages/error'));
const QuiteSetup = lazy(() => import('./pages/quick_setup'));
const PersonalDetails = lazy(() => import('./pages/setup/personal_details'));
const BusinessDetails = lazy(() => import('./pages/setup/business_details'));
const BankDetails = lazy(() => import('./pages/setup/bank_details'));
const Transactions = lazy(() => import('./pages/transactions'));
const RefundPage = lazy(() => import('./pages/refunds'));
const SettlementPage = lazy(() => import('./pages/settlements'));
const SplitSettlementsPage = lazy(() => import('./pages/split_settlements'));
const WalletPage = lazy(() => import('./pages/wallets'));
const TransferPage = lazy(() => import('./pages/transfer'));
const CustomerPocketsPage = lazy(() => import('./pages/customer_pockets'));
const DisputePage = lazy(() => import('./pages/disputes'));
const ProductPage = lazy(() => import('./pages/products'));
const ProductCategoryPage = lazy(() => import('./pages/products/categories'));
const CustomerPage = lazy(() => import('./pages/customers'));
const BusinessBranchPage = lazy(() => import('./pages/branches'));
const BrancheDetails = lazy(() => import('./utils/analytics/branch_details'));
const AuditLog = lazy(() => import('./pages/audit_log'));
const Settings2 = lazy(() => import('./pages/settings'));
const ResetPassword = lazy(() => import('./pages/reset_password'));
const RecoverPassword = lazy(() => import('./pages/reset_password/recover_password'));
const Signup = lazy(() => import('./pages/register'));
const JoinTeam = lazy(() => import('./pages/register/join-team'));
const BusinessList = lazy(() => import('./pages/setup/business_list'));
const WhiteLabel = lazy(() => import('./pages/setup'));
const PreAuthPage = lazy(() => import('./pages/pre_auth'));
const PaymentLink = lazy(() => import('./pages/payment_link'));
const ConfirmEmail = lazy(() => import('./pages/confirm_email'));
const Activate = lazy(() => import('./pages/activate'));
const Frontstore = lazy(() => import('./pages/frontstore'));
const AccountSettingsPage = lazy(() => import('./pages/account'));
const ResetTwoFactorOtp = lazy(() => import('./pages/auths/resetOtp'));
const Stores = lazy(() => import('./pages/frontstore/stores'));
// import Stores from './pages/frontstore/stores';
const ConfigRouters = ({ business_details }) => (
  <>
    {!AuthService.loggedIn() && (
      <Switch>
        <Route path="/auth/audit-log" component={AuditLog} />
        <Route path="/auth/signup" component={Signup} />
        <Route path="/auth/join-team/:link" component={JoinTeam} />
        <Route path="/auth/passwordrecover/:auth" component={ResetPassword} />
        <Route path="/auth/recover-password" component={RecoverPassword} />
        <Route path="/auth/register" component={Signup} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/two_factor/reset" component={ResetTwoFactorOtp} />
        <Route path="/auth/w/:label" component={WhiteLabel} />
        {/*<Route path="/auth/code" component={PinCode} />*/}
        <Route path="/auth/confirm-email" component={ConfirmEmail} />
        <Route path="/auth/activate/:token" component={Activate} />
        <Redirect from="/" to="/auth/login" />
        <Redirect from="/*" to="/auth/login" />
        <Route component={Error} />
      </Switch>
    )}

    {!business_details && AuthService.loggedIn() && (
      <Switch>
        <Route exact path="/business-list" component={BusinessList} />
        <Redirect from="/" to="/business-list" />
      </Switch>
    )}

    {AuthService.loggedIn() && business_details && (
      <Switch>
        <Route exact path="/" component={Renderer} />
        <Route exact path="/dashboard" component={Renderer} />
        <Route exact path="/branches" component={BusinessBranchPage} />
        <Route exact path="/branch-details/:id" component={BrancheDetails} />
        <Route exact path="/business-list" component={BusinessList} />
        <Route exact path="/transactions" component={Transactions} />
        <Route path="/pre-auth" component={PreAuthPage} />
        <Route path="/customers" component={CustomerPage} />
        <Route path="/refunds" component={RefundPage} />
        <Route path="/pockets" component={WalletPage} />
        <Route path="/transfer" component={TransferPage} />
        <Route path="/customer-pockets" component={CustomerPocketsPage} />
        <Route path="/payment" component={PaymentLink} />
        <Route path="/disputes" component={DisputePage} />
        <Route path="/settlements" component={SettlementPage} />
        <Route path="/quick-setup" component={QuiteSetup} />
        <Route path="/personal-details" component={PersonalDetails} />
        <Route path="/business-details" component={BusinessDetails} />
        <Route path="/bank-details" component={BankDetails} />
        <Route path="/products" component={ProductPage} />
        <Route path="/product-categories" component={ProductCategoryPage} />
        <Route path="/settings/:id" component={Settings2} />
        <Route path="/settings" component={Settings2} />
        <Route path="/account" component={AccountSettingsPage} />
        <Route path="/w/:label" component={WhiteLabel} />
        <Route path="/split-settlements" component={SplitSettlementsPage} />
        <Route path="/frontstore" component={Frontstore} />
        <Route exact path="/stores" component={Stores} />
        <Redirect from="/auth/*" to="/" />
        <Route component={Error} />
      </Switch>
    )}
  </>
);

export default ConfigRouters;
