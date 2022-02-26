import React from "react";

import NavItem from "./NavItem";

import "./MobileNavItem.css";

const MobileNavItem = (props) => {
  return <NavItem className="mobile-nav-item" {...props} />;
};

export default MobileNavItem;
