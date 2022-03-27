import React from "react";
import { useNavigate } from "react-router-dom";
import ProfilePhotoCircle from "../../components/ProfilePhotoCircle";

import { useAuth } from "../../contexts/AuthContext";

import "./SideDrawerProfileCard.css"

/**
 * Displays the users information in the sidebar
 *
 * @returns SideDrawerProfileCard
 */
const SideDrawerProfileCard = () => {
  const { appUser } = useAuth();
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate(`/profile/${appUser.id}`);
  };

  return (
    <header
      className="side-drawer-profile-card_header"
      onClick={navigateToProfile}
    >
      <ProfilePhotoCircle
        subjectUser={appUser}
        className="side-drawer-profile-card_header-profile-photo"
      />
      <div className="side-drawer-profile-card_header-info-container">
        <h1 className="side-drawer-profile-card-primary">{appUser.name || ""}</h1>
        <span className="side-drawer-profile-card_header-secondary">
          {appUser.email || ""}
        </span>
      </div>
    </header>
  );
};

export default SideDrawerProfileCard;
