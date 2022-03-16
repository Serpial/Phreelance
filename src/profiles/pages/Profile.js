import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../shared/contexts/AuthContext";

/**
 *
 * @returns Profile
 */
const Profile = () => {
  const [userProfile, setUserProfile] = useState();
  const [currentUser, setCurrentUser] = useState();

  const { activeUser } = useAuth();
  const { userID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/users/${userID}`)
      .then((res) => {
        if (cancel) return;
        const userRes = res.data.user;
        setUserProfile(userRes);
        return Axios.get(`/api/users/auth/${activeUser.uid}`);
      })
      .then((res) => {
        if (cancel) return;
        setCurrentUser(res.data.user);
      })
      .catch((_err) => navigate("/find-auctions"));

    return () => {
      cancel = true;
    };
  }, []);

  return <></>;
};

export default Profile;
