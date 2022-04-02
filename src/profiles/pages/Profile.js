import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

import MainProfileCard from "../components/MainProfileCard";
import AuctionList from "../../auctions/components/AuctionList";

import "./Profile.css";

/**
 * Profile page that allows the user to present themselves.
 * @returns Profile
 */
const Profile = () => {
  const [subjectUser, setSubjectUser] = useState();
  const [winningBids, setWinningBids] = useState();
  const [winningAuctions, setWinningAuctions] = useState([]);
  const [loadingAuctions, setLoadingAuctions] = useState(true);

  const { userID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    setLoadingAuctions(true);
    Axios.get(`/api/users/${userID}`)
      .then(({ data }) => {
        if (cancel) return;
        console.log("subject:", data.user.id);
        setSubjectUser(data.user);
        return Axios.get(`/api/bids/winning-bids/user/${data.user.id}`);
      })
      .then((bidsRes) => {
        if (cancel) return;
        console.log("bid:", bidsRes.data.bids);
        setWinningBids(bidsRes.data.bids);
      })
      .catch((_err) => console.log(_err));

    return () => {
      cancel = true;
    };
  }, [userID, navigate]);

  useEffect(() => {
    if (!winningBids || winningBids.length === 0) {
      setLoadingAuctions(false);
      return;
    }

    const winningAuctionsRetrieved = [];
    for (const bid of winningBids) {
      Axios.get(`/api/auctions/${bid.auction}`)
        .then(({ data }) => {
          winningAuctionsRetrieved.push(data.auction);
        })
        .catch((_err) => {
          console.log("Error loading bid:", bid.id);
        });
    }

    console.log(winningAuctionsRetrieved);

    setWinningAuctions(winningAuctionsRetrieved);
    setLoadingAuctions(false);
  }, [winningBids]);

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
        {!loadingAuctions && (
          <AuctionList
            auctions={winningAuctions}
            emptyMessage={"This user has not yet won an auction."}
          />
        )}
      </Row>
    </Container>
  );
};

export default Profile;
