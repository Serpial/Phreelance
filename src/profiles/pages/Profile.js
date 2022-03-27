import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../shared/contexts/AuthContext";
import MainProfileCard from "../components/MainProfileCard";
import AuctionList from "../../auctions/components/AuctionList";

import "./Profile.css";

/**
 *
 * @returns Profile
 */
const Profile = () => {
  const [subjectUser, setSubjectUser] = useState();

  const { userID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/users/${userID}`)
      .then((res) => {
        if (cancel) return;
        const userRes = res.data.user;
        setSubjectUser(userRes);
      })
      .catch((_err) => navigate("/find-auctions"));

    return () => {
      cancel = true;
    };
  }, [userID, navigate]);

  return (
    <Container>
      <Row>
        <MainProfileCard subjectUser={subjectUser} />
      </Row>
      <Row>
        <h3>
          <FontAwesomeIcon
            className="profile_auctions_trophy"
            icon={faTrophy}
          />
          <span>Auctions victories:</span>
        </h3>
        <AuctionList userAppId={subjectUser?.id} auctions={[]} />
      </Row>
    </Container>
  );
};

export default Profile;
