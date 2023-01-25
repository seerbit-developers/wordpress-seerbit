import React from 'react';
import PocketOverview from "./contents/PocketOverview";
import SubPocketOverview from "./contents/subpocket/Overview";
import SubPocketBalance from "./contents/subpocket/balance";
// import Topups from "./contents/topups";
import Balance from "./contents/balance";
import SubPockets from "./contents/subpocket/pockets";
import PropTypes from 'prop-types';
import Transfers from "./contents/transfers";
import {Route, Switch, useParams, useRouteMatch} from "react-router";
const Content = ({fundPocket}) => {

    return (
        <Switch>
            <Route path={`/pocket`} exact render={()=> <PocketOverview fundPocket={fundPocket} /> } />
            <Route path={`/pocket/overview`} exact render={()=> <PocketOverview fundPocket={fundPocket} /> } />
            <Route path={`/pocket/balance`} exact render={()=> <Balance fundPocket={fundPocket} /> } />
            <Route path={`/pocket/transfers`} exact component={Transfers} />
            <Route path={`/pocket/sub/overview`} exact component={SubPocketOverview} />
            <Route path={`/pocket/sub/pockets`} exact component={SubPockets} />
            <Route path={`/pocket/sub/balance`} exact component={SubPocketBalance} />
        </Switch>
    );
};

Content.propTypes = {
    tab: PropTypes.string,
    fundPocket: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
}
export default Content;
