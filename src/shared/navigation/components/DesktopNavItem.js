import React from "react";

import NavItem from "./NavItem";

import "./DesktopNavItem.css";

const DesktopNavItem = ({ name, location }) => {
  return (
    <NavItem className="desktop-nav-item" name={name} location={location} />
  );
};

export default DesktopNavItem;
