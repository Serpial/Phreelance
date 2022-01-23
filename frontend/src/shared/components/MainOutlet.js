import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const MainOutlet = () => {
  const auth = useAuth();
  const isLoggedIn = auth?.activeUser;
  if (!isLoggedIn){
    return <Navigate to={"/login"}/>;
  }

  return <Outlet />
};

export default MainOutlet;