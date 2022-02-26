import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGavel,
  faList,
  faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";

import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import Backdrop from "../components/Backdrop";
import MobileNavItem from "./components/MobileNavItem";
import DesktopNavItem from "./components/DesktopNavItem";
import ProfileDropdown from "./components/ProfileDropdown";

import "./MainNavigation.css";

const NAV_LOCATIONS = [
  {
    name: "Auctions",
    location: "/find-auctions",
    icon: faGavel,
  },
  {
    name: "My Auctions",
    location: "/my-auctions",
    icon: faList,
  },
  {
    name: "New Listing",
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

  return (
    <>
      {showSideDrawer && <Backdrop onClick={() => setShowSideDrawer(false)} />}
      <SideDrawer show={showSideDrawer}>
        {NAV_LOCATIONS.map((nl) => (
          <MobileNavItem {...nl} />
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
          <ProfileDropdown />
        </span>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
