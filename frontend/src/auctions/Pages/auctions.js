import React from "react";

import { useAuth } from "../../shared/contexts/AuthContext";

const Auctions = () => {
  const { activeUser } = useAuth();
  return (
    <>
      Email: {activeUser?.email}
    </>
  );
};

export default Auctions;
