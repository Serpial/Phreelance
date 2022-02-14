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
import NavItem from "../components/NavItem";

import "./MainNavigation.css";

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
        <NavItem name="Auctions" icon={faGavel} location="/find-auctions" />
        <NavItem name="My Auctions" icon={faList} location="/my-auctions" />
        <NavItem name="New Listing" icon={faCalendarPlus} location="/create-listing" />
      </SideDrawer>
      <MainHeader>
        <span
          className="main-navigation_menu-button"
          onClick={() => setShowSideDrawer(true)}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </span>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
