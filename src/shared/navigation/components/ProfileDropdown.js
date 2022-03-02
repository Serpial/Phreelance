import React, { useEffect, useState } from "react";
import Axios from "axios";

import { useAuth } from "../../contexts/AuthContext";

import "./ProfileDropdown.css";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

/**
 * Profile dropdown is available when the user hovers over their name
 * when the website is being displayed in desktop mode.
 * 
 * @param {JSX.Element} children
 * List of DropdownNavItem Elements
 * 
 * @returns 
 */
const ProfileDropdown = ({ children }) => {
  const { activeUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/users/auth/${activeUser?.uid}`)
      .then((response) => {
        if (cancel) return;
        const user = response.data.user;
        setDisplayName(user.name);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [activeUser]);

  return (
    <div className="profile-dropdown_container">
      <div className="profile-dropdown">
        <span className="profile-dropdown_profile-photo">
          <img
            src="https://placekitten.com/50/50"
            alt={`${displayName}'s profile`}
          />
        </span>
        <span className="profile-dropdown_display-name">{displayName}</span>
      </div>
      <div className="profile-dropdown_content">{children}</div>
    </div>
  );
};

export default ProfileDropdown;
