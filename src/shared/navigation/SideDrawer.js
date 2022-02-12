import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDom from "react-dom";
import Axios from "axios";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";

import NavItem from "../components/NavItem";
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
 * @returns Side drawer component
 */
const SideDrawer = ({ show, children }) => {
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const { activeUser, logout } = useAuth();
  useEffect(() => {
    let cancel = false;

    Axios.get(
      `${process.env.REACT_APP_RUN_BACK_END_HOST}/api/users/auth/${activeUser?.uid}`
    )
      .then((response) => {
        if (cancel) return;
        const user = response.data.user;
        setDisplayName(user.name);
        setEmailAddress(user.email);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  });

  const navigate = useNavigate();
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log("Logout not completed: ", err.message);
    }
  };

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
        <footer className="side-drawer_footer">
          <NavItem onClick={handleLogout} icon={faSignOutAlt}>
            Sign out
          </NavItem>
        </footer>
      </aside>
    </CSSTransition>
  );

  return ReactDom.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
