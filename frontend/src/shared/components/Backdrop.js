import React from "react";
import reactDom from "react-dom";

import "./Backdrop.css";

/**
 * A large page with element that prevents the
 * user from select parts of the application
 * while in the sidebar.
 * 
 * @param {Function} onClick
 * Callback function to enact what should happen
 * when the backdrop is pressed.
 * 
 * @returns Backdrop
 */
const Backdrop = ({onClick}) => {
  return reactDom.createPortal(
    <div className="backdrop" onClick={onClick}></div>,
    document.getElementById("backdrop-hook")
  );
};

export default Backdrop;
