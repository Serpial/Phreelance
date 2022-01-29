import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./NavItem.css";
import { Container } from "react-bootstrap";

const NavItem = (props) => {
  const icon = props.icon || faLink;

  return (
    <Container className="nav-item_container">
      <span
        className={(props.className || "") + " nav-item"}
        onClick={props.onClick}
      >
        <FontAwesomeIcon className="nav-item_icon" icon={icon} />
        <span className="nav-item_content">{props.children}</span>
      </span>
    </Container>
  );
};

export default NavItem;
