import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import MainNavigation from "../navigation/MainNavigation";

import "./MainOutlet.css";

/**
 * Container for authorised locations within the
 * application.
 *
 * @returns outlet for main pages
 */
const MainOutlet = () => {
  const { appUser } = useAuth();

  if (!appUser) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <MainNavigation />
      <main className="main-container">
        <Outlet />
      </main>
    </>
  );
};

export default MainOutlet;
