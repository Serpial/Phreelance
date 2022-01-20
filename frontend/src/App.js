import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Login from "./authentication/pages/login";
import Register from "./authentication/pages/register";
import Forgot from "./authentication/pages/forgot";
import { AuthProvider } from "./shared/contexts/AuthContext";
// import HiddenRoute from "./shared/components/HiddenRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
