import React from "react";
import { Link } from "react-router-dom";

import "./DrawerLink.css";

const DrawerLink = (props) => {
  return <span className="side-drawer_nav-item">{props.Children}</span>;
};
