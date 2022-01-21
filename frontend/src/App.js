import React from "react";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";

import Login from "./authentication/pages/login";
import Register from "./authentication/pages/register";
import Forgot from "./authentication/pages/forgot";
import { AuthProvider } from "./shared/contexts/AuthContext";
// import HiddenRoute from "./shared/components/HiddenRoute";

import logo from "./shared/res/logo.svg";
import "./App.css";

const App = () => {
  const unauthenticatedRoutes = (
      <main className="login">
        <div className="logo-container">
          <img className="logo" src={logo} alt="Phreelance in lowercase text" />
        </div>
        <div className="login-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </main>
    );

  const isLoggedIn = false;
  return (
    <AuthProvider>
      <Router>{isLoggedIn ? <main></main> : unauthenticatedRoutes}</Router>
    </AuthProvider>
  );
};

export default App;
