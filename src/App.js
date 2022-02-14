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
import FindAuctions from "./auctions/pages/FindAuctions";
import MyAuctions from "./auctions/pages/MyAuctions";
import Auction from "./auctions/pages/Auction";
import CreateListing from "./auctions/pages/CreateListing";
import { AuthProvider, useAuth } from "./shared/contexts/AuthContext";

const App = () => {
  const isLoggedIn = useAuth()?.activeUser;
  const defaultRoute = isLoggedIn ? "/auctions-list" : "/login";

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
            <Route path="/find-auctions" element={<FindAuctions />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/auction/:auctionID" element={<Auction />} />
          </Route>
          <Route path="*" element={<Navigate to={defaultRoute} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
