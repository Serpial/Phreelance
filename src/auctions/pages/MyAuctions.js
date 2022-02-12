import React, { useState, useEffect } from "react";
import Axios from "axios";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import AuctionList from "../components/AuctionList";
import { useAuth } from "../../shared/contexts/AuthContext";

import "./MyAuctions.css";
import { Col } from "react-bootstrap";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

/**
 * Page showing auctions that the user is interacting
 * with. This means: ones that they have created, and
 * ones that they have participated in with a bid.
 *
 * @returns
 */
const MyAuctions = () => {
  const [userAppId, setUserAppId] = useState();
  const { activeUser } = useAuth();
  const userAuthId = activeUser.uid;
  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/users/auth/${userAuthId}`)
      .then((res) => {
        if (cancel) return;
        const user = res.data.user;
        setUserAppId(user.id);
      })
      .catch((err) => {
        console.log(err.response);
      });

    return () => (cancel = true);
  }, [userAuthId]);

  const [loadingCreator, setLoadingCreator] = useState(true);
  const [createdAuctionList, setCreatedAuctionList] = useState([]);
  useEffect(() => {
    let cancel = false;

    if (!userAppId) return;
    Axios.get(`${BACKEND_HOST}/api/auctions/creator/${userAppId}`)
      .then((res) => {
        if (cancel) return;
        setCreatedAuctionList(res.data.auctions);
        setLoadingCreator(false);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [userAppId]);

  const [loadingBids, setLoadingBids] = useState(true);
  const [bidAuctionList, setBidAuctionList] = useState([]);
  useEffect(() => {
    let cancel = false;

    if (!userAppId) return;
    Axios.get(`${BACKEND_HOST}/api/auctions/bidder/${userAppId}`)
      .then((res) => {
        if (cancel) return;
        setBidAuctionList(res.data.auctions);
      })
      .catch((err) => console.log(err.response));
    setLoadingBids(false);

    return () => (cancel = true);
  }, [userAppId]);

  return (
    <>
      {!loadingBids && !loadingCreator && (
        <Container>
          <Row>
            <Col sm className="my-auctions_content-area">
              <h2>Auctions you are participating in:</h2>
              <AuctionList userAppId={userAppId} auctions={bidAuctionList} />
            </Col>
            <Col sm className="my-auctions_content-area">
              <h2>Auctions you have created:</h2>
              <AuctionList
                userAppId={userAppId}
                auctions={createdAuctionList}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default MyAuctions;