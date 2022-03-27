import React from "react";
import { CSSTransition } from "react-transition-group";
import ReactDom from "react-dom";

import SideDrawerProfileCard from "./components/SideDrawerProfileCard";

import "./SideDrawer.css";

/**
 * This side drawer aims to provide navigation to
 * the user.
 *
 * @param {Boolean} show
 * Boolean representation of whether the side drawer
 * should be shown.
 *
 * @param {JSX.Element} children
 * Main list of options presented to the user.
 *
 * @param {JSX.Element} subChildren
 * This refers to the items to be contained in the collection below the
 * main list of options.
 *
 * @returns Side drawer component
 */
const SideDrawer = ({ show, children, subChildren }) => {

  const content = (
    <CSSTransition
      in={show}
      classNames="expand-right"
      mountOnEnter
      unmountOnExit
      timeout={150}
    >
      <aside className="side-drawer">
        <SideDrawerProfileCard />
        <hr className="side-drawer_separator" />
        <legend className="side-drawer_nav">{children}</legend>
        <hr className="side-drawer_separator" />
        <footer className="side-drawer_footer">{subChildren}</footer>
      </aside>
    </CSSTransition>
  );

  return ReactDom.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
