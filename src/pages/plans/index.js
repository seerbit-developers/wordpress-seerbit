/** @format */

import React from "react";
import { useRouteMatch, Switch, Route, withRouter } from "react-router";
import Plans from "./plans";
import PlanSubscribers from "./plan_subscribers";
import PlanTransactions from "./plan_transactions";


export function PlanModule(props) {
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}/:planId/subscribers`} component={PlanSubscribers} />
            <Route exact path={`${path}/:planId/:billingId/transactions`} component={PlanTransactions} />
            <Route exact path={path} component={Plans} />
        </Switch>
    );
}
export default withRouter(PlanModule);
