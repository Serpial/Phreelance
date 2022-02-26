import React from "react";

import NavItem from "./NavItem";

import "./DesktopNavItem.css";

/**
 * Allows us to style NavItems for desktop.
 * 
 * @param {Object} props 
 * Collection of props attached with a NavItem
 * 
 * @returns DesktopNavItem
 */
const DesktopNavItem = ({ name, location }) => {
  return (
    <NavItem className="desktop-nav-item" name={name} location={location} />
  );
};

export default DesktopNavItem;
