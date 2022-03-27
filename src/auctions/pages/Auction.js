import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faLock } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../shared/contexts/AuthContext";
import BasicCard from "../../shared/components/BasicCard";
import BiddingModal from "../components/BiddingModal";
import BidList from "../components/BidList";
import LoadingWheel from "../../shared/components/LoadingWheel";
import AuctionDisplayCard from "../components/AuctionDisplayCard";
import ModalCard from "../../shared/components/ModalCard";
import BidCard from "../components/BidCard";
import EnglishBidDisplay from "../components/EnglishBidDisplay";

import "./Auction.css";
import DutchBidDisplay from "../components/DutchBidDisplay";

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
  const [auctionIsLoading, setAuctionIsLoading] = useState(true);
  const [bidsAreLoading, setBidsAreLoading] = useState(true);
  const [showBidding, setShowBidding] = useState(false);
  const [showRemoveWarning, setShowRemoveWarning] = useState(false);
  const [status, setStatus] = useState();
  const [topBid, setTopBid] = useState();
  const [hasBid, setHasBid] = useState(false);

  const { appUser } = useAuth();
  const { auctionID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/auctions/${auctionID}`)
      .then((res) => {
        if (cancel) return;
        const auctionRes = res.data.auction;
        setAuction(auctionRes);
        setAuctionIsLoading(false);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [auctionID, bidEmitted]);

  useEffect(() => {
    let cancel = false;

    if (!auction) return;
    if (!bidsAreLoading && !bidEmitted) return;
    Axios.get(`/api/bids/top-bid/${auction.meaningfulId}`)
      .then((res) => {
        if (cancel) return;
        setTopBid(res.data.bid);
        return Axios.get(`/api/bids/auction/${auction.meaningfulId}`);
      })
      .then((res) => {
        if (cancel) return;

        const bidsRes = res.data.bids;
        if (!bidsRes || bidsRes.length === 0) {
          setBidsAreLoading(false);
          return;
        }

        bidsRes.sort((a, b) =>
          Date(a.lastChange) > Date(b.lastChange) ? 1 : -1
        );
        setBids(bidsRes);
        setHasBid(bidsRes.find((b) => b.creator === appUser.id));
        setBidEmitted(false);
        setBidsAreLoading(false);
      })
      .catch((err) => console.log(err));

    return () => (cancel = true);
  }, [auction, appUser, bidEmitted, bidsAreLoading]);

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

  const bidButtonTooltip = (propss) => (
    <Tooltip {...propss}>
      This auction is currently {status.toLowerCase()}.
    </Tooltip>
  );

  return (
    <>
      <BiddingModal
        currentUser={appUser}
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
                getCurrentStatus={setStatus}
              />
            </Col>
            <Col md={4}>
              <BasicCard>
                {auction?.auctionType === "ENG" && (
                  <EnglishBidDisplay auction={auction} topBid={topBid} />
                )}
                {auction?.auctionType === "DUT" && (
                  <DutchBidDisplay
                    auction={auction}
                    topBid={topBid}
                    status={status}
                  />
                )}
                <hr />
                {auction?.creator === appUser?.id ? (
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
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={status !== "Active" ? bidButtonTooltip : <></>}
                  >
                    <div className="auction_bid_button_container">
                      <Button
                        className="auction_button"
                        variant="primary"
                        disabled={status !== "Active"}
                        onClick={() => {
                          if (status === "Active") {
                            setShowBidding(true);
                          }
                        }}
                      >
                        {status !== "Active" && (
                          <FontAwesomeIcon
                            className="auction-bid_lock_icon"
                            icon={faLock}
                          />
                        )}
                        {hasBid ? "Modify " : "Create "}
                        bid
                      </Button>
                    </div>
                  </OverlayTrigger>
                )}
              </BasicCard>
            </Col>
            <Col>
              {hasBid && (
                <Row className="auction_your-bid_container">
                  <h3>Your bid:</h3>
                  <BidCard bid={hasBid} showAdditionalDetail={true} />
                </Row>
              )}
              <Row>
                <h3>Bids:</h3>
                <BidList
                  isAuctionCreator={auction?.creator === appUser?.id}
                  bids={bids}
                />
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Auction;
