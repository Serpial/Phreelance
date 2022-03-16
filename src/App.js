import Axios from "axios";
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
import UpdateListing from "./auctions/pages/UpdateListing";
import { AuthProvider, useAuth } from "./shared/contexts/AuthContext";
import Profile from "./profiles/pages/Profile";
import EditProfile from "./profiles/pages/EditProfile";

const App = () => {
  Axios.defaults.baseURL = process.env.REACT_APP_RUN_BACK_END_HOST;
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
            <Route exact path="/profile/:userID" element={<Profile />} />
            <Route
              exactpath="/profile/:userID/edit"
              element={<EditProfile />}
            />
            <Route exact path="/auction/:auctionID" element={<Auction />} />
            <Route
              exact
              path="/auction/:auctionID/edit"
              element={<UpdateListing />}
            />
          </Route>
          <Route path="*" element={<Navigate to={defaultRoute} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
