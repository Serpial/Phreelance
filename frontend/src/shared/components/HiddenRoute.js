// See: https://github.com/WebDevSimplified/React-Firebase-Auth/blob/master/src/components/PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

const HiddenRoute = ({ component: Component, ...routeObject }) => {
  // const { currentUser } = useAuth();
  const { currentUser } = {currentUser: "me"};

  return (
    <Route
      {...routeObject}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        );
      }}
    ></Route>
  );
};

export default HiddenRoute;
