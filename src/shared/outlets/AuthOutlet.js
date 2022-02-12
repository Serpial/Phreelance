import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import logo from "../../shared/res/logo.svg";

import "./AuthOutlet.css";

/**
 * This is a container of the outer styles of
 * the login information allowing the smaller
 * individual components to maange page specific
 * information.
 *
 * @returns outlet for authorisation pages
 */
const AuthOutlet = () => {
  const auth = useAuth();
  const isLoggedIn = auth?.activeUser;
  if (isLoggedIn) {
    return <Navigate to={"/find-auctions"} />;
  }

  return (
    <main className="login">
      <div className="logo-container">
        <img className="logo" src={logo} alt="Phreelance in lowercase text" />
      </div>
      <div className="login-container">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthOutlet;
