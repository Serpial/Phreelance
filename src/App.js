import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import AuthOutlet from "./shared/outlets/AuthOutlet";
import MainOutlet from "./shared/outlets/MainOutlet";
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import Forgot from "./auth/pages/Forgot";
import Auctions from "./auctions/pages/Auctions";
import MyAuctions from "./auctions/pages/MyAuctions";
import { AuthProvider, useAuth } from "./shared/contexts/AuthContext";

const App = () => {
  const isLoggedIn = useAuth()?.activeUser;
  const defaultRoute = isLoggedIn ? "/auctions" : "/login";

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate to={defaultRoute} />} />
          <Route path="/" element={<AuthOutlet />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="password-reset" element={<Forgot />} />
          </Route>
          <Route path="/" element={<MainOutlet />}>
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
          </Route>
          <Route path="*" element={<Navigate to={defaultRoute} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
