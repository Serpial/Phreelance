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
import ToDisplayValue from "../util/ToDisplayValue";
import ModalCard from "../../shared/components/ModalCard";

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
  const [auctionIsLoading, setAuctionIsLoading] = useState(true);
  const [bidsAreLoading, setBidsAreLoading] = useState(true);
  const [showBidding, setShowBidding] = useState(false);
  const [showRemoveWarning, setShowRemoveWarning] = useState(false);
  const [status, setStatus] = useState();
  const [topBid, setTopBid] = useState();

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
        setAuctionIsLoading(false);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [auctionID]);

  useEffect(() => {
    let cancel = false;

    if (!auction) return;
    if (!bidsAreLoading && !bidEmitted) return;
    Axios.get(`/api/bids/auction/${auction.meaningfulId}`).then((res) => {
      if (cancel) return;

      const bidsRes = res.data.bids;
      if (!bidsRes || bidsRes.length === 0) {
        setBidsAreLoading(false);
        return;
      }

      bidsRes.sort((a, b) => (a.value > b.value ? 1 : -1));
      setBids(bidsRes);
      setTopBid(bidsRes[0]);
      setBidEmitted(false);
      setBidsAreLoading(false);
    });

    return () => (cancel = true);
  }, [auction, currentUser, bidEmitted, bidsAreLoading]);

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
      navigate("/my-auctions");
    });
  };

  return (
    <>
      <BiddingModal
        currentUser={currentUser}
        currentAuction={auction}
        onClose={(_e) => setShowBidding(false)}
        onBidSubmit={(_e) => {
          setShowBidding(false);
          setBidEmitted(true);
        }}
        show={showBidding}
        socket={auctionSocket}
        topBid={topBid}
      />
      <ModalCard
        show={showRemoveWarning}
        infoText="Are you sure you want to remove this draft?"
      >
        <Button
          variant="outline-primary"
          onClick={() => setShowRemoveWarning(false)}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={onRemoveDraft}>
          Remove
        </Button>
      </ModalCard>
      {auctionIsLoading || bidsAreLoading ? (
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
                {auction.auctionType === "DUT" && (
                  <div>
                    <span className="auction_starting-price-preface">
                      Starting price:{" "}
                    </span>
                    <span className="auction_starting-price-value">
                      {auction.startingPrice}
                    </span>
                  </div>
                )}
                <div>
                  <span className="auction_top-bid-preface">Winning bid: </span>
                  <span className="auction_top-bid-value">
                    {topBid ? ToDisplayValue(topBid.value) : "£-.--"}
                  </span>
                </div>
                <hr />
                {auction?.creator === currentUser?.id ? (
                  <>
                    <Button
                      className="auction_button"
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
                      <Button
                        className="auction_button"
                        variant="danger"
                        onClick={() => setShowRemoveWarning(true)}
                      >
                        Remove draft
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    className="auction_button"
                    variant="primary"
                    onClick={() => {
                      if (status === "Active") {
                        setShowBidding(true);
                      }
                    }}
                  >
                    {bids.find((b) => b.creator === currentUser.id)
                      ? "Modify "
                      : "Create "}
                    bid
                  </Button>
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
