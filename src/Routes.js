/** @format */

import React, { lazy } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router";
import AuthService from "./utils/auth";
import Renderer from "./pages";
import Login from "./pages/login";
import ResetPassword from "./pages/reset_password";
import ChangePassword from "./pages/reset_password/change_password";
import RecoverPassword from "./pages/reset_password/recover_password";
import Signup from "./pages/register";
import JoinTeam from "./pages/register/join-team";
import ConfirmEmail from "./pages/confirm_email";
import Activate from "./pages/activate";
import Error from "./pages/error";
import PrivateRoute from "components/PrivateRoute";

const QuiteSetup = lazy(() => import("./pages/quick_setup"));
// const PersonalDetails = lazy(() => import('./pages/setup/personal_details'));
const BusinessDetails = lazy(() => import("./pages/setup/business_details"));
// const BankDetails = lazy(() => import('./pages/setup/bank_details'));
const Transactions = lazy(() => import("./pages/transactions"));

// POS Web
const POSTerminals = lazy(() => import("./pages/pos/terminals"));

const RefundPage = lazy(() => import("./pages/refunds"));
const SettlementPage = lazy(() => import("./pages/settlements"));
const SplitSettlementsPage = lazy(() => import("./pages/split_settlements"));
const WalletPage = lazy(() => import("./pages/wallets"));
const PocketPage = lazy(() => import("./pages/pocket"));
const InvoicePage = lazy(() => import("./pages/invoice"));
const TransferPage = lazy(() => import("./pages/transfer"));
const CustomerPocketsPage = lazy(() => import("./pages/customer_pockets"));
const DisputePage = lazy(() => import("./pages/disputes"));
const ProductPage = lazy(() => import("./pages/products"));
const ProductCategoryPage = lazy(() => import("./pages/products/categories"));
const CustomerPage = lazy(() => import("./pages/customers"));
const BusinessBranchPage = lazy(() => import("./pages/branches"));
const BrancheDetails = lazy(() => import("./utils/analytics/branch_details"));
const AuditLog = lazy(() => import("./pages/audit_log"));
// const Settings2 = lazy(() => import('./pages/settings'));
const BusinessList = lazy(() => import("./pages/setup/business_list"));
const WhiteLabel = lazy(() => import("./pages/setup"));
const PreAuthPage = lazy(() => import("./pages/pre_auth"));
const PaymentLink = lazy(() => import("./pages/payment_link/main"));
const PlanSubscribers = lazy(() => import("./pages/plans/plan_subscribers"));
const PlanTransactions = lazy(() => import("./pages/plans/plan_transactions"));
const SubscriberTransactions = lazy(() =>
  import("./pages/subscribers/subscriber_transactions")
);
const SubscriberSubscriptions = lazy(() =>
  import("./pages/subscribers/subscriber_subscriptions")
);
const Frontstore = lazy(() => import("./pages/frontstore"));
const FrontstoreOrders = lazy(() => import("./pages/order"));
const StoreProducts = lazy(() => import("./pages/frontstore/products"));
const AccountSettingsPage = lazy(() => import("./pages/account"));
const ResetTwoFactorOtp = lazy(() => import("./pages/auths/resetOtp"));
const Subscriptions = lazy(() => import("./pages/recurring/subscriptions"));
const Plans = lazy(() => import("./pages/plans"));
const Subscribers = lazy(() => import("./pages/subscribers"));
const ManageFrontstore = lazy(() => import("./pages/managefrontstore"));
const CapitalPage = lazy(() => import("./pages/capital"));

const ConfigRouters = ({ business_details }) => {
  let location = useLocation();
  console.log('AuthService.loggedIn()', AuthService.loggedIn())
  return (
    <>
      {!AuthService.loggedIn() && (
        <Switch>
          <Route path="/auth/audit-log" component={AuditLog} />
          <Route path="/auth/signup" component={Signup} />
          <Route path="/auth/join-team/:link" component={JoinTeam} />
          <Route path="/auth/passwordrecover/:auth" component={ResetPassword} />
          <Route
            path="/auth/password/change/:auth"
            component={ChangePassword}
          />
          <Route path="/auth/recover-password" component={RecoverPassword} />
          <Route path="/auth/register" component={Signup} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/two_factor/reset" component={ResetTwoFactorOtp} />
          <Route path="/auth/w/:label" component={WhiteLabel} />
          {/*<Route path="/auth/code" component={PinCode} />*/}
          <Route path="/auth/confirm-email/:email" component={ConfirmEmail} />
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
        <Switch location={location}>
          <PrivateRoute exact path="/" component={Renderer} />
          <PrivateRoute exact path="/dashboard" component={Renderer} />
          <PrivateRoute
            exact
            path="/transactions/branches"
            component={BusinessBranchPage}
          />
          <PrivateRoute
            exact
            path="/branch-details/:id"
            component={BrancheDetails}
          />
          <PrivateRoute exact path="/business-list" component={BusinessList} />
          <PrivateRoute
            exact
            path="/payments/transactions"
            component={Transactions}
          />

          <PrivateRoute exact path="/pos/terminals" component={POSTerminals}/>

          <PrivateRoute path="/pre-auth" component={PreAuthPage} />
          <PrivateRoute
            path="/transactions/customers"
            component={CustomerPage}
          />
          <PrivateRoute path="/refunds" component={RefundPage} />
          <PrivateRoute path="/pocket" component={PocketPage} exact />
          <PrivateRoute path="/invoice" component={InvoicePage} exact />
          <PrivateRoute path="/pocket/:page" component={PocketPage} />
          <PrivateRoute path="/invoice/:page" component={InvoicePage} />
          {/*<PrivateRoute path="/pocket/transactions" component={WalletPage} />*/}
          {/*<PrivateRoute path="/pocket/transfers" component={TransferPage} />*/}
          {/*<PrivateRoute path="/pocket/sub/pockets" component={CustomerPocketsPage} />*/}
          {/*<PrivateRoute path="/pocket/sub/pockets/:pocketReferenceId" component={CustomerPocketsPage} />*/}
          <PrivateRoute path="/transfer" component={TransferPage} />
          {/*<PrivateRoute path="/payment" component={PaymentLink} />*/}
          <PrivateRoute path="/payments/links" component={PaymentLink} />
          <PrivateRoute path="/disputes" component={DisputePage} />
          <PrivateRoute path="/settlements" component={SettlementPage} />
          <PrivateRoute path="/quick-setup" component={QuiteSetup} />
          {/*<PrivateRoute path="/personal-details" component={PersonalDetails} />*/}
          <PrivateRoute path="/business-details" component={BusinessDetails} />
          {/*<PrivateRoute path="/bank-details" component={BankDetails} />*/}
          <PrivateRoute
            path="/products/categories"
            component={ProductCategoryPage}
          />
          <PrivateRoute path="/products" component={ProductPage} />
          {/*<PrivateRoute path="/settings/:id" component={Settings2} />*/}
          {/*<PrivateRoute path="/settings" component={Settings2} />*/}
          <PrivateRoute path="/account" component={AccountSettingsPage} />
          <PrivateRoute path="/w/:label" component={WhiteLabel} />
          <PrivateRoute
            path="/split-settlements"
            component={SplitSettlementsPage}
          />
          <PrivateRoute path="/frontstore" component={Frontstore} />
          <PrivateRoute
            path="/frontstore/:storeId/products"
            component={StoreProducts}
          />
          <PrivateRoute
            path="/frontstore/:storeId/orders"
            component={FrontstoreOrders}
          />
          <PrivateRoute
            path="/frontstore/:storeId/manage"
            component={StoreProducts}
          />
          <PrivateRoute
            exact
            path="/manage-frontstore"
            component={ManageFrontstore}
          />
          <PrivateRoute exact path="/subscriptions" component={Subscriptions} />
          <PrivateRoute exact path="/plans" component={Plans} />
          <PrivateRoute
            path="/plans/:planId/subscribers"
            component={PlanSubscribers}
          />
          <PrivateRoute
            exact
            path={"/plans/:planId/:billingId/transactions"}
            component={PlanTransactions}
          />
          <PrivateRoute
            exact
            path={"/subscribers/:billingId/transactions"}
            component={SubscriberTransactions}
          />
          <PrivateRoute
            exact
            path={"/subscribers/:customerId/:cardName/subscriptions"}
            component={SubscriberSubscriptions}
          />
          <PrivateRoute exact path="/subscribers" component={Subscribers} />
          <PrivateRoute exact path="/capital" component={CapitalPage} />
          {/*<Route path="/auth/passwordrecover/:auth" component={ResetPassword} />*/}
          <Redirect from="/auth/*" to="/" />
          <Route component={Error} />
        </Switch>
      )}
    </>
  );
};

export default ConfigRouters;
