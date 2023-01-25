/** @format */

import React from "react";
import {useRouteMatch, Switch, Route,withRouter} from "react-router";
import FrontStores from "./stores";
import StoreProducts from "../store_products";
import StoreOrders from "../order";
import ManageFrontstore from "../managefrontstore";


export function Frontstore(props) {
  let { path, url } = useRouteMatch();

  return (
        <div className="sbt-fronstore page-container">
          <Switch>
            <Route exact path={path} component={FrontStores}>
            </Route>
            <Route path={`${path}/:storeId/products`} exact>
            <StoreProducts/>
            </Route>
              <Route exact path={`${path}/:storeId/orders`} component={StoreOrders} />
              <Route exact path={`${path}/:storeId/manage`} component={ManageFrontstore} />
          </Switch>
        </div>
  );
}

export default withRouter(Frontstore);