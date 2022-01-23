import React from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";

import Login from "./authentication/pages/login";
import Register from "./authentication/pages/register";
import Forgot from "./authentication/pages/forgot";
import Auctions from "./auctions/Pages/auctions";

import { AuthProvider, useAuth } from "./shared/contexts/AuthContext";

import logo from "./shared/res/logo.svg";
import "./App.css";

const App = () => {
  const auth = useAuth();
  const isLoggedIn = auth?.activeUser;
  let routes;
  if (!isLoggedIn) {
    routes = (
      <main className="login">
        <div className="logo-container">
          <img className="logo" src={logo} alt="Phreelance in lowercase text" />
        </div>
        <div className="login-container">
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/password-reset" element={<Forgot />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </main>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/auctions" element={<Auctions />} />
        <Route path="*" element={<Navigate to="/auctions" />} />
      </Routes>
    );
  }

  return (
    <AuthProvider>
      <Router>{routes}</Router>
    </AuthProvider>
  );
};

export default App;
