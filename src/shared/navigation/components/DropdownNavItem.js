import React from "react";

import NavItem from "./NavItem";

import "./DropdownNavItem.css";

/**
 * Allows us to style NavItems for the dropdown.
 *
 * @param {Object} props
 * Collection of props attached with a NavItem
 *
 * @returns DropdownNavItem
 */
const DropdownNavItem = (props) => {
  return <NavItem className={"dropdown-nav-item"} {...props} />;
};

export default DropdownNavItem;
