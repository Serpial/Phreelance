import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./NavItem.css";

/**
 * Component for sidebar navigation.
 *
 * @param {JSX.Element} name
 * Name of the link
 *
 * @param {FontAwesomeIcon} icon
 * Insert a fontawesome icon object.
 *
 * @param {String} className
 * Insert className for custom styling
 *
 * @param {String} location
 * Location in which this nav item is associated with
 *
 * @param {Function} onClick
 * Custom onClick element
 *
 * @returns
 */
const NavItem = ({ name, icon, className, location, onClick }) => {
  const { pathname } = useLocation();
  const isLocation = location === pathname;

  if (!onClick) {
    onClick = () => {
      if (!isLocation) {
        navigate(location);
      }
    };
  }

  const navigate = useNavigate();

  return (
    <div
      className={
        "nav-item_container " + (className ? className + "_container" : "")
      }
    >
      <div
        className={
          "nav-item " + (className || "") + (isLocation ? " selected" : "")
        }
        onClick={onClick}
      >
        {icon && <FontAwesomeIcon className="nav-item_icon" icon={icon} />}
        <span className="nav-item_content">{name}</span>
      </div>
    </div>
  );
};

export default NavItem;
