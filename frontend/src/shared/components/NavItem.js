import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./NavItem.css";
import { Container } from "react-bootstrap";

/**
 * Component for sidebar navigation.
 * 
 * @param {FontAwesomeIcon} icon
 * Insert a fontawesome icon object.
 * 
 * @param {String} className
 * Insert className for custom styling
 * 
 * @param {Function} onClick
 * Callback function for inserting intended
 * click options. Likely for navigation.
 * 
 * @param {JSX.Element} children
 * Collection of JSX elements to be contained.
 * 
 * @returns
 */
const NavItem = ({ icon, className, onClick, children }) => {
  const selectedIcon = icon || faLink;

  return (
    <Container className="nav-item_container">
      <span className={(className || "") + " nav-item"} onClick={onClick}>
        <FontAwesomeIcon className="nav-item_icon" icon={selectedIcon} />
        <span className="nav-item_content">{children}</span>
      </span>
    </Container>
  );
};

export default NavItem;
