import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./MainProfileCard.css";

const MainProfileCard = ({ currentUser, subjectUser }) => {
  const navigate = useNavigate();

  if (!currentUser || !subjectUser) return <></>;

  return (
    <BasicCard>
      {currentUser.id === subjectUser.id && (
        <>
          <div className="main-profile-card_button_container">
            <Button
              className="main-profile-card_button"
              variant="light"
              onClick={() => navigate(`/profile/${subjectUser.id}/edit`)}
            >
              <FontAwesomeIcon
                className={"main-profile-card_button_cog"}
                icon={faCog}
              />
              Edit Profile
            </Button>
          </div>
          <hr className="main-profile-card_edit-separator" />
        </>
      )}
    </BasicCard>
  );
};

export default MainProfileCard;
