import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

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
  const selectedIcon = icon || faLink;

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
    <div className="nav-item_container">
      <span
        className={
          "nav-item " + (className || "") + (isLocation && " selected")
        }
        onClick={onClick}
      >
        <FontAwesomeIcon className="nav-item_icon" icon={selectedIcon} />
        <span className="nav-item_content">{name}</span>
      </span>
    </div>
  );
};

export default NavItem;
