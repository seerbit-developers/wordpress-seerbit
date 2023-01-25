/** @format */

import React from "react";
import { useRouteMatch, Switch, Route, withRouter } from "react-router";
import SubscriberTransactions from "./subscriber_transactions";
import SubscriberSubscriptions from "./subscriber_subscriptions";
import Subscribers from "./subscribers";


export function SubscriberModule(props) {
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}/:billingId/transactions`} component={SubscriberTransactions} />
            <Route exact path={`${path}/:customerId/:cardName/subscriptions`} component={SubscriberSubscriptions} />
            <Route exact path={path} component={Subscribers} />
        </Switch>
    );
}
export default withRouter(SubscriberModule);
