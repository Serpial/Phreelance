import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import ReactDom from "react-dom";
import Axios from "axios";

import { useAuth } from "../contexts/AuthContext";

import "./SideDrawer.css";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

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
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const { activeUser } = useAuth();
  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/users/auth/${activeUser?.uid}`)
      .then((response) => {
        if (cancel) return;
        const user = response.data.user;
        setDisplayName(user.name);
        setEmailAddress(user.email);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  });

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
              alt={`${displayName || ""}'s profile`}
            />
          </div>
          <div className="side-drawer_header-info-container">
            <h1 className="side-drawer_header-primary">{displayName || ""}</h1>
            <span className="side-drawer_header-secondary">
              {emailAddress || ""}
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
