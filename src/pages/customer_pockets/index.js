import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router";
import List from "./main.jsx"
import Details from "./details.jsx"
function Main(props) {
  let { path, url } = useRouteMatch();

  return (
      <div>
        <Switch>
          <Route exact path={path} component={List}/>
          <Route exact path={`${path}/:pocketReferenceId`} component={Details}/>
        </Switch>
      </div>
  );
}

export default Main;
