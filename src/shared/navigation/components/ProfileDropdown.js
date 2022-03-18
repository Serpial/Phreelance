import React from "react";

import { useAuth } from "../../contexts/AuthContext";

import "./ProfileDropdown.css";

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
  const { appUser } = useAuth();

  return (
    <div className="profile-dropdown_container">
      <div className="profile-dropdown">
        <span className="profile-dropdown_profile-photo">
          <img
            src="https://placekitten.com/50/50"
            alt={`${appUser.name}'s profile`}
          />
        </span>
        <span className="profile-dropdown_display-name">{appUser.name}</span>
      </div>
      <div className="profile-dropdown_content">{children}</div>
    </div>
  );
};

export default ProfileDropdown;
