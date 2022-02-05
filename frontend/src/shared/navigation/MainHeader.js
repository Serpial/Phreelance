import React from "react";

import "./MainHeader.css";

/**
 * Main header used for navigation when in desktop mode.
 * 
 * @param {JSX.Element} children
 * Navigation items contained in the header of the page.
 * 
 * @returns header component.
 */
const MainHeader = ({ children }) => {
  return <header className="main-header">{children}</header>;
};

export default MainHeader;
