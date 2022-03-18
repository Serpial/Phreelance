import React, { useState, useEffect } from "react";
import Axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import AuctionList from "../components/AuctionList";
import LoadingWheel from "../../shared/components/LoadingWheel";
import { useAuth } from "../../shared/contexts/AuthContext";

import "./MyAuctions.css";

/**
 * Page showing auctions that the user is interacting
 * with. This means: ones that they have created, and
 * ones that they have participated in with a bid.
 *
 * @returns
 */
const MyAuctions = () => {
  const [loadingCreator, setLoadingCreator] = useState(true);
  const [createdAuctionList, setCreatedAuctionList] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [bidAuctionList, setBidAuctionList] = useState([]);

  const { appUser } = useAuth();

  useEffect(() => {
    let cancel = false;

    if (!appUser.id) return;
    Axios.get(`/api/auctions/creator/${appUser.id}`)
      .then((res) => {
        if (cancel) return;
        setCreatedAuctionList(res.data.auctions);
        setLoadingCreator(false);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [appUser.id]);

  useEffect(() => {
    let cancel = false;

    if (!appUser.id) return;
    Axios.get(`/api/auctions/bidder/${appUser.id}`)
      .then((res) => {
        if (cancel) return;
        setBidAuctionList(res.data.auctions);
      })
      .catch((err) => console.log(err.response));
    setLoadingBids(false);

    return () => (cancel = true);
  }, [appUser.id]);

  return (
    <>
      {loadingBids || loadingCreator ? (
        <LoadingWheel />
      ) : (
        <Container>
          <Row>
            <Col sm className="my-auctions_content-area">
              <h2>Auctions you are participating in:</h2>
              <AuctionList userAppId={appUser.id} auctions={bidAuctionList} />
            </Col>
            <Col sm className="my-auctions_content-area">
              <h2>Auctions you have created:</h2>
              <AuctionList
                userAppId={appUser.id}
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
