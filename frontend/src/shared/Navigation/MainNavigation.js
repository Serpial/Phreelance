import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import Backdrop from "../components/Backdrop";
import NavItem from "../components/NavItem";

import "./MainNavigation.css";

const MainNavigation = () => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  return (
    <>
      {showSideDrawer && <Backdrop onClick={() => setShowSideDrawer(false)} />}
      <SideDrawer
        show={showSideDrawer}
      >
        <NavItem>asdf</NavItem>
        <NavItem>asdf</NavItem>
        <NavItem>asdf</NavItem>
        <NavItem>asdf</NavItem>
      </SideDrawer>
      <MainHeader>
        <span
          className="main-navigation_menu-button"
          onClick={() => setShowSideDrawer(true)}
        >
          <FontAwesomeIcon icon={faBars} size="2x"/>
        </span>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
