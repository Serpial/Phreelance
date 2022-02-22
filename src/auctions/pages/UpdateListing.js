import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import Container from "react-boostrap/Card";
import Col from "react-boostrap/Col";
import Row from "react-boostrap/Row";

import { useAuth } from "../../shared/contexts/AuthContext";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

const UpdateListing = (props) => {
  const { auctionID } = useParams();
  const { activeUser } = useAuth();

  const [auction, setAuction] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let cancel = false;

    let userAppId;
    Axios.get(`${BACKEND_HOST}/api/users/auth/${activeUser.uid}`)
      .then((res) => {
        if (cancel) return;
        userAppId = res.data?.user.id;
        return Axios.get(`${BACKEND_HOST}/api/auctions/${auctionID}`);
      })
      .then((res) => {
        if (cancel) return;

        const auction = res.data?.auction;
        if (userAppId !== auction.creator) {
          navigate("/auction/" + auctionID);
        }
        setAuction(auction);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (cancel = true);
  });

  return (
    <>
      {loading ? (
        <h3>Please wait...</h3>
      ) : (
        <Container>
          <Row>
            <Col></Col>
            <Col></Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default UpdateListing;
