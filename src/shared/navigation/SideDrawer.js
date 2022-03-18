import React from "react";
import { CSSTransition } from "react-transition-group";
import ReactDom from "react-dom";

import { useAuth } from "../contexts/AuthContext";

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
  const { appUser } = useAuth();

  const content = (
    <CSSTransition
      in={show}
      classNames="expand-right"
      mountOnEnter
      unmountOnExit
      timeout={150}
    >
      <aside className="side-drawer">
        <header className="side-drawer_header">
          <div className="side-drawer_header-profile-photo">
            <img
              src="https://placekitten.com/100/100"
              alt={`${appUser.name || ""}'s profile`}
            />
          </div>
          <div className="side-drawer_header-info-container">
            <h1 className="side-drawer_header-primary">{appUser.name || ""}</h1>
            <span className="side-drawer_header-secondary">
              {appUser.email || ""}
            </span>
          </div>
        </header>
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
