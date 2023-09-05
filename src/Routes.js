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
const BusinessDetails = lazy(() => import("./pages/setup/business_details"));
const Transactions = lazy(() => import("./pages/transactions"));
const RefundPage = lazy(() => import("./pages/refunds"));
const SettlementPage = lazy(() => import("./pages/settlements"));
const DisputePage = lazy(() => import("./pages/disputes"));
const BusinessList = lazy(() => import("./pages/setup/business_list"));
const WhiteLabel = lazy(() => import("./pages/setup"));
const PreAuthPage = lazy(() => import("./pages/pre_auth"));
const AccountSettingsPage = lazy(() => import("./pages/account"));
const ResetTwoFactorOtp = lazy(() => import("./pages/auths/resetOtp"));

const ConfigRouters = ({ business_details }) => {
  let location = useLocation();
  return (
    <>
      {!AuthService.loggedIn() && (
        <Switch>
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
          <PrivateRoute exact path="/business-list" component={BusinessList} />
          <PrivateRoute
            exact
            path="/payments/transactions"
            component={Transactions}
          />
          <PrivateRoute path="/pre-auth" component={PreAuthPage} />
          <PrivateRoute path="/refunds" component={RefundPage} />
          <PrivateRoute path="/disputes" component={DisputePage} />
          <PrivateRoute path="/settlements" component={SettlementPage} />
          <PrivateRoute path="/quick-setup" component={QuiteSetup} />
          <PrivateRoute path="/business-details" component={BusinessDetails} />
          <PrivateRoute path="/account" component={AccountSettingsPage} />
          <PrivateRoute path="/w/:label" component={WhiteLabel} />
          <Redirect from="/auth/*" to="/" />
          <Route component={Error} />
        </Switch>
      )}
    </>
  );
};

export default ConfigRouters;
