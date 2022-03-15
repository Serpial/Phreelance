import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGavel,
  faList,
  faCalendarPlus,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/AuthContext";
import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import Backdrop from "../components/Backdrop";
import MobileNavItem from "./components/MobileNavItem";
import DesktopNavItem from "./components/DesktopNavItem";
import ProfileDropdown from "./components/ProfileDropdown";
import DropdownNavItem from "./components/DropdownNavItem";

import "./MainNavigation.css";

const NAV_LOCATIONS = [
  {
    name: "Auctions",
    key: "auctions",
    location: "/find-auctions",
    icon: faGavel,
  },
  {
    name: "My Auctions",
    key: "user-auctions",
    location: "/my-auctions",
    icon: faList,
  },
  {
    name: "New Listing",
    key: "create-auction",
    location: "/create-listing",
    icon: faCalendarPlus,
  },
];

/**
 * This component manages the sidebar and the
 * header bar used for navigation.
 *
 * @returns container for navigation components
 */
const MainNavigation = () => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log("Logout not completed: ", err.message);
    }
  };

  return (
    <>
      {showSideDrawer && <Backdrop onClick={() => setShowSideDrawer(false)} />}
      <SideDrawer
        show={showSideDrawer}
        subChildren={[
          <DropdownNavItem
            name="Sign out"
            key="sign-out"
            onClick={handleLogout}
            icon={faSignOutAlt}
          />,
        ]}
      >
        {NAV_LOCATIONS.map((nl) => (
          <MobileNavItem key={nl.key} {...nl} />
        ))}
      </SideDrawer>
      <MainHeader>
        <span
          className="main-navigation_menu-button"
          onClick={() => setShowSideDrawer(true)}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </span>
        <span className="main-navigation_location-list">
          {NAV_LOCATIONS.map((nl) => (
            <DesktopNavItem {...nl} />
          ))}
          <ProfileDropdown>
            <DropdownNavItem
              name="Sign out"
              onClick={handleLogout}
              icon={faSignOutAlt}
            />
          </ProfileDropdown>
        </span>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
