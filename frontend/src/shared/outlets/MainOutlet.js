import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import MainNavigation from "../navigation/MainNavigation";

import "./MainOutlet.css";

/**
 * Container for autherised locations within the
 * application.
 * 
 * @returns outlet for main pages
 */
const MainOutlet = () => {
  const auth = useAuth();
  const isLoggedIn = auth?.activeUser;
  if (!isLoggedIn) {
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
