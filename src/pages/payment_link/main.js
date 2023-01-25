import React from 'react';
import {useRouteMatch, Switch, Route,withRouter} from "react-router";
import Links from "./index";
import Transactions from "./transactions";

const Main = () => {
    let { path } = useRouteMatch()
    return (
        <Switch>
            <Route path={`${path}/:page?`} exact component={Links} />
            <Route path={`${path}/:page?/:id/transactions`} component={Transactions} />
        </Switch>
    );
};

export default Main;
