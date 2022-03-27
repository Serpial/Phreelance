import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import useCloudStorage from "../hooks/useCloudStorage";

import "./ProfilePhotoCircle.css";

/**
 * Takes a user and presents their profile photo
 *
 * @param {Object} subjectUser
 * Subject user object
 *
 * @param {String} className
 *
 * @returns ProfilePhotoCircle
 */
const ProfilePhotoCircle = ({ subjectUser, className }) => {
  const [imageURL, setImageURL] = useState();

  const { fetchProfilePhoto } = useCloudStorage();

  useEffect(() => {
    let cancel = false;
    if (!subjectUser?.profilePhoto) return;
    fetchProfilePhoto(subjectUser?.profilePhoto)
      .then((url) => {
        if (cancel) return;
        setImageURL(url);
      })
      .catch((_err) => console.log("Could not retrieve photo..."));
    return () => (cancel = true);
  }, [fetchProfilePhoto, subjectUser]);

  return (
    <div
      className={
        "profile-photo-circle_container" + (className ? " " + className : "")
      }
    >
      {subjectUser?.profilePhoto !== "" ? (
        <img
          className="profile-photo-circle_profile-photo"
          alt={subjectUser?.name + "'s profile picture"}
          src={imageURL}
        />
      ) : (
        <FontAwesomeIcon
          className="profile-photo-circle_icon"
          size="3x"
          icon={faUser}
        />
      )}
    </div>
  );
};

export default ProfilePhotoCircle;
