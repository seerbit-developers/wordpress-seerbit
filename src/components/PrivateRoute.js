import React from "react";
import {Redirect, Route} from "react-router";
import AuthService from "../utils/auth";
function PrivateRoute({ children, ...rest }) {
    let auth = AuthService;
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.loggedIn() ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;
