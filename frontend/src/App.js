import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import AuthOutlet from "./shared/components/AuthOutlet";
import MainOutlet from "./shared/components/MainOutlet";
import Login from "./authentication/pages/login";
import Register from "./authentication/pages/register";
import Forgot from "./authentication/pages/forgot";
import Auctions from "./auctions/Pages/auctions";
import { AuthProvider, useAuth } from "./shared/contexts/AuthContext";

const App = () => {
  const auth = useAuth();
  const isLoggedIn = auth?.activeUser;

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthOutlet />}>
            <Route exact path="login" element={<Login />} />
            <Route exact path="register" element={<Register />} />
            <Route exact path="password-reset" element={<Forgot />} />
          </Route>
          <Route path="/" element={<MainOutlet />}>
            <Route exact path="/auctions" element={<Auctions />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/auctions" : "/login"} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
