import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import { useAuth } from "../../shared/contexts/AuthContext";

const Auctions = () => {
  const { activeUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log("Logout not completed: ", err.message);
    }
  };
  return (
    <>
      Email: {activeUser?.email}
      <Button
        as="input"
        variant="primary"
        type="button"
        value="Logout"
        onClick={handleLogout}
      />
    </>
  );
};

export default Auctions;
