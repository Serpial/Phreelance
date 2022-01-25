import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import Axios from "axios";
// import { CSSTransition } from "react-transition-group";

import { useAuth } from "../contexts/AuthContext";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const auth = useAuth();
  const fireUser = auth?.activeUser;

  useEffect(() => {
    let cancel = false;

    Axios.get(
      `${process.env.REACT_APP_RUN_BACK_END_HOST}/api/users/auth/${fireUser.uid}`
    )
      .then((response) => {
        if (cancel) return;
        const user = response.data.user;
        setDisplayName(user.name);
        setEmailAddress(user.email);
      })
      .catch((err) => {
        console.log("Could not retrieve user:", err);
      });

    return () => (cancel = true);
  });

  const content = (
    // <CSSTransition
    //   in={props.show}
    //   classNames="slide-in-left"
    //   mountOnEnter
    //   unmountOnExit
    //   timout={150}
    // >
    <aside className="side-drawer" onClick={props.onClick}>
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
      <legend className="side-drawer_nav">{props.children}</legend>
      <hr className="side-drawer_separator" />
      <footer className="side-drawer_footer">
        <span className="side-drawer_footer-item">Sign out</span>
      </footer>
    </aside>
    /* </CSSTransition> */
  );

  return ReactDom.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
