import React, { useState, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import BasicCard from "../../shared/components/BasicCard";
import ModalCard from "../../shared/components/ModalCard";
import Backdrop from "../../shared/components/Backdrop";
import { useAuth } from "../../shared/contexts/AuthContext";
import useCloudStorage from "../../shared/hooks/useCloudStorage";

import "./EditProfile.css";

/**
 * Edit profile and settings page. Only accessible by the intended user
 * @returns EditProfile
 */
const EditProfile = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasUploadError, setHasUploadError] = useState(false);

  const { appUser } = useAuth();
  const { userID } = useParams();
  const { uploadProfilePhoto } = useCloudStorage();
  const navigate = useNavigate();

  const name = useRef();
  const biography = useRef();
  const photo = useRef();

  const onDelete = () => {
    Axios.post(`/api/users/delete/${appUser.id}`).catch((err) =>
      console.log(err)
    );
    navigate(`/profile/${appUser.id}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const currentName = name.current;
    const currentBiography = biography.current;
    const currentPhoto = photo.current;

    if (currentPhoto?.files && currentPhoto?.files.length > 0) {
      uploadProfilePhoto(currentPhoto.files[0])
        .then((snapshot) => {
          setHasUploadError(false);
          const newProfile = {
            name: currentName.value,
            biography: currentBiography.value,
            profilePhoto: snapshot.metadata.fullPath,
          };
          console.log(snapshot);
          console.log(newProfile);
          return Axios.patch(
            `/api/users/update-profile/${appUser.id}`,
            newProfile
          );
        })
        .then((_res) => {
          console.log("User updated with photo");
          navigate("/profile/" + userID);
        })
        .catch((_err) => {
          console.log("Patch error");
          setHasUploadError(true);
        });
    } else {
      Axios.patch(`/api/users/update-profile/${appUser.id}`, {
        name: currentName.value,
        biography: currentBiography.value,
      })
        .then((_res) => {
          console.log("User updated");
          navigate("/profile/" + userID);
        })
        .catch((_err) => console.log("Patch error"));
    }
  };

  return (
    <>
      {showDeleteModal && <Backdrop />}
      <ModalCard
        title="Delete your profile?"
        show={showDeleteModal}
        infoText="Are you sure you want to delete your profile? Nothing will change immediately but the administrator will be notified."
      >
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </ModalCard>
      {appUser.id === userID ? (
        <Container as="form" onSubmit={onSubmit}>
          <BasicCard>
            <Form.Label>Display name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              ref={name}
              defaultValue={appUser.name}
            />
            <Form.Label>Biography</Form.Label>
            <Form.Control
              as="textarea"
              name="biography"
              ref={biography}
              defaultValue={appUser.biography}
            />
            <Form.Label>Profile photo</Form.Label>
            <Form.Control type="file" accept="image/*" ref={photo} />
            {hasUploadError && (
              <Alert variant="warning">
                Make sure your image is less that 5MB.
              </Alert>
            )}
          </BasicCard>
          <BasicCard className="edit-profile_button-card">
            <ButtonGroup className="edit-profile_button-container">
              <Button
                className="edit-profile_button"
                variant="secondary"
                onClick={() => navigate("/profile/" + userID)}
              >
                Return to profile
              </Button>
              <Button
                className="edit-profile_button"
                variant="primary"
                type="submit"
              >
                Submit changes
              </Button>
            </ButtonGroup>
          </BasicCard>
          <BasicCard className="edit-profile_button-card">
            <div className="edit-profile_button-container">
              <Button
                className="edit-profile_button edit-profile_deactivate-account"
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Deactivate account
              </Button>
            </div>
          </BasicCard>
        </Container>
      ) : (
        <Navigate to={`/profile/${userID}`} />
      )}
    </>
  );
};

export default EditProfile;
