import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
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
import MobileNavItem from "../components/MobileNavItem";

import "./MainNavigation.css";

/**
 * This component manages the sidebar and the
 * header bar used for navigation.
 *
 * @returns container for navigation components
 */
const MainNavigation = () => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  //https://react-bootstrap.github.io/components/navbar/
  return (
    <>
      {showSideDrawer && <Backdrop onClick={() => setShowSideDrawer(false)} />}
      <SideDrawer show={showSideDrawer}>
        <MobileNavItem
          name="Auctions"
          icon={faGavel}
          location="/find-auctions"
        />
        <MobileNavItem
          name="My Auctions"
          icon={faList}
          location="/my-auctions"
        />
        <MobileNavItem
          name="New Listing"
          icon={faCalendarPlus}
          location="/create-listing"
        />
      </SideDrawer>
      <MainHeader>
        <span
          className="main-navigation_menu-button"
          onClick={() => setShowSideDrawer(true)}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </span>
        <Navbar></Navbar>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
