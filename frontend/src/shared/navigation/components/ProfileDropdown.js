import React from "react";

import { useAuth } from "../../contexts/AuthContext";
import ProfilePhotoCircle from "../../components/ProfilePhotoCircle";

import "./ProfileDropdown.css";

/**
 * Profile dropdown is available when the user hovers over their name
 * when the website is being displayed in desktop mode.
 *
 * @param {JSX.Element} children
 * List of DropdownNavItem Elements
 *
 * @returns ProfileDropdown
 */
const ProfileDropdown = ({ children }) => {
  const { appUser } = useAuth();

  return (
    <div className="profile-dropdown_container">
      <div className="profile-dropdown">
        <ProfilePhotoCircle
          subjectUser={appUser}
          className="profile-dropdown_profile-photo"
        />
        <span className="profile-dropdown_display-name">{appUser.name}</span>
      </div>
      <div className="profile-dropdown_content">{children}</div>
    </div>
  );
};

export default ProfileDropdown;
