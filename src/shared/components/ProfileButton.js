import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "./ProfileButton.css";

/**
 * Button that can will take the user to the subjects profile.
 * 
 * @param {String} subjectId
 * Id of the person who's profile this link will go to
 *
 * @returns ProfileButton
 */
const ProfileButton = ({ subjectId }) => {
  const [subjectUser, setSubjectUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    Axios.get(`api/users/${subjectId}`)
      .then((res) => {
        if (cancel) return;
        const user = res.data?.user;
        setSubjectUser(user);
      })
      .catch((_err) => console.log("error"));

    return () => (cancel = true);
  }, [subjectId]);

  const navigateToProfile = () => {
    if (subjectUser) {
      navigate("/profile/" + subjectUser.id);
    }
  };

  return (
    <div className="profile-button" onClick={navigateToProfile}>
      <span>
        <FontAwesomeIcon icon={faUser} className="profile-button_icon" />
      </span>
      <span className="profile-button_name">{subjectUser?.name}</span>
    </div>
  );
};

export default ProfileButton;
