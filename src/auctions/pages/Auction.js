import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../shared/contexts/AuthContext";
import BasicCard from "../../shared/components/BasicCard";
import BiddingModal from "../components/BiddingModal";
import BidList from "../components/BidList";
import LoadingWheel from "../../shared/navigation/components/LoadingWheel";

import "./Auction.css";
import AuctionDisplayCard from "../components/AuctionDisplayCard";

/**
 * Auction page that contains information about an individual auction.
 * This can be managed and viewed by participants.
 * @returns Auction
 */
const Auction = () => {
  const [auction, setAuction] = useState();
  const [auctionSocket, setAuctionSocket] = useState();
  const [bids, setBids] = useState([]);
  const [bidEmitted, setBidEmitted] = useState(false);
  const [creator, setCreator] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showBidding, setShowBidding] = useState(false);
  const [status, setStatus] = useState();
  
  const { activeUser } = useAuth();
  const { auctionID } = useParams();
  
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/users/auth/${activeUser.uid}`)
      .then((res) => {
        if (cancel) return;
        setCurrentUser(res.data.user);
      })
      .catch((err) => console.log(err));

    return () => (cancel = true);
  }, [activeUser]);

  useEffect(() => {
    let cancel = false;
    
    Axios.get(`/api/auctions/${auctionID}`)
    .then((res) => {
      if (cancel) return;
      const auctionRes = res.data.auction;
      setAuction(auctionRes);
      
      return Axios.get(`/api/users/${auctionRes.creator}`);
    })
    .then((res) => {
      if (cancel) return;
      const creatorRes = res.data.user;
      setCreator(creatorRes);
      setIsLoading(false);
    })
    .catch((err) => console.log(err.response));
    
    return () => (cancel = true);
  }, [auctionID]);
  
  useEffect(() => {
    let cancel = false;

    if (!auction) return;
    Axios.get(`/api/bids/auction/${auction.meaningfulId}`).then((res) => {
      if (cancel) return;
      const bidsRes = res.data.bids;
      setBids(bidsRes);
      setBidEmitted(false);
    });

    return () => (cancel = true);
  }, [auction, bidEmitted]);

  useEffect(() => {
    if (!auction) return;
    const connectionHostString = process.env.REACT_APP_RUN_BACK_END_HOST;
    const connection = io(connectionHostString + "/auction-routes");
    connection.emit("join-room", {
      auctionId: auction.meaningfulId,
    });
    connection.on("posted-bid", () => setBidEmitted(true));
    setAuctionSocket(connection);
    return () => connection.close();
  }, [auction]);

  const onRemoveDraft = () => {
    Axios.delete(`/api/auctions/${auction.meaningfulId}`).finally(() => {
      navigate("/find-auctions");
    });
  };

  return (
    <>
      <BiddingModal
        show={showBidding}
        currentAuction={auction}
        currentUser={currentUser}
        socket={auctionSocket}
        onCancel={() => setShowBidding(false)}
      />
      {isLoading ? (
        <LoadingWheel />
      ) : (
        <Container>
          <Row>
            <Col md={8}>
              {!auction?.isPublic && (
                <Alert className="auction_publish-alert" variant="info">
                  <FontAwesomeIcon
                    className="auction_publish-alert_icon"
                    icon={faInfoCircle}
                  />
                  <span>This auction has not been published yet!</span>
                </Alert>
              )}
              <AuctionDisplayCard
                auction={auction}
                creator={creator}
                getCurrentStatus={setStatus}
              />
            </Col>
            <Col md={4}>
              <BasicCard>
                <hr />
                {auction?.creator === currentUser?.id ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() =>
                        navigate("/auction/" + auctionID + "/edit")
                      }
                    >
                      {"Modify " +
                        (!auction?.isPublic ? "or Publish " : "") +
                        "auction"}
                    </Button>
                    {!auction?.isPublic && (
                      <Button variant="danger" onClick={onRemoveDraft}>
                        Remove draft
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (status === "Active") {
                          setShowBidding(true);
                        }
                      }}
                    >
                      {} bid
                    </Button>
                  </>
                )}
              </BasicCard>
            </Col>
            <Col>
              <h3>Bids:</h3>
              <BidList
                isAuctionCreator={auction?.creator === currentUser?.id}
                bids={bids}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Auction;
