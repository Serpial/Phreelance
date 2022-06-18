import React from "react";

import NavItem from "./NavItem";

import "./MobileNavItem.css";

/**
 * Allows us to style NavItems for mobile.
 * 
 * @param {Object} props 
 * Collection of props attached with a NavItem
 * 
 * @returns MobileNavItem
 */
const MobileNavItem = (props) => {
  return <NavItem className="mobile-nav-item" {...props} />;
};

export default MobileNavItem;
