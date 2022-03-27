import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../shared/contexts/AuthContext";
import BasicCard from "../../shared/components/BasicCard";

import "./MainProfileCard.css";
import ProfilePhotoCircle from "../../shared/components/ProfilePhotoCircle";

/**
 * Profile card that displays the users information.
 *
 * @param {Object} subjectUser
 * The user who's profile it is.
 *
 * @returns MainProfileCard
 */
const MainProfileCard = ({ subjectUser }) => {
  const navigate = useNavigate();
  const { appUser } = useAuth();

  return (
    <>
      {subjectUser && (
        <BasicCard className="main-profile-card">
          {appUser.id === subjectUser?.id && (
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
          <Container>
            <Row>
              <Col md={4}>
                <ProfilePhotoCircle subjectUser={subjectUser} />
              </Col>
              <Col md={8} className="main-profile-card_info-container">
                <div>
                  <h1 className="main-profile-card_display-name">
                    {subjectUser?.name}
                  </h1>
                </div>
                <div className="main-profile-card_description">
                  <h4>Biography</h4>
                  {subjectUser?.biography !== ""
                    ? subjectUser?.biography
                    : "This user has no biography at this time. Check again later."}
                </div>
              </Col>
            </Row>
          </Container>
        </BasicCard>
      )}
    </>
  );
};

export default MainProfileCard;
