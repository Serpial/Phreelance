import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
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
import FindTimeBetween from "../util/FindTimeBetween";
import LoadingWheel from "../../shared/navigation/components/LoadingWheel";

import "./Auction.css";

/**
 * Auction page that contains information about an individual auction.
 * This can be managed and viewed by participants.
 * @returns Auction
 */
const Auction = () => {
  const [doTimeRefresh, setDoTimeRefresh] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setDoTimeRefresh(true);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatus = (started, elapsed) => {
    if (!elapsed && started) return "Active";
    if (elapsed) return "Closed";
    if (!started) return "Pending";
  };

  const { activeUser } = useAuth();
  const [currentUser, setCurrentUser] = useState();
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

  const [auctionSocket, setAuctionSocket] = useState();
  useEffect(() => {
    const connectionHostString = process.env.REACT_APP_RUN_BACK_END_HOST;
    const connection = io(connectionHostString + "/auction-routes");
    connection.on("posted-bid", () => {
      // https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm
      console.log("new bid posted to auction.");
    });

    setAuctionSocket(connection);
    return () => connection.close();
  }, []);

  const { auctionID } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [auction, setAuction] = useState();
  const [creator, setCreator] = useState();
  const [bids, setBids] = useState([]);
  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/auctions/${auctionID}`)
      .then((res) => {
        if (cancel) return;
        const auctionRes = res.data.auction;
        setAuction(auctionRes);

        if (auctionSocket && auctionSocket.connected) {
          auctionSocket.emit("join-room", {
            auctionId: auctionRes.meaningfulId,
          });
        }

        return Promise.all([
          Axios.get(`/api/users/${auctionRes.creator}`),
          Axios.get(`/api/bids/auction/${auctionRes.meaningfulId}`),
        ]);
      })
      .then((res) => {
        if (cancel) return;
        const creatorRes = res[0].data.user;
        setCreator(creatorRes);
        const bidsRes = res[1].data.bids;
        setBids(bidsRes);
        setIsLoading(false);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [auctionID, currentUser, auctionSocket]);

  const [timeRemaining, setTimeRemaining] = useState("");
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!doTimeRefresh || !auction) return;

    const now = new Date(Date.now());
    const startDateTime = new Date(Date.parse(auction.starting));
    const closeDateTime = new Date(Date.parse(auction.finishing));

    const hasStarted = now > startDateTime;
    setStarted(hasStarted);
    const hasElapsed = now >= closeDateTime;
    setElapsed(hasElapsed);

    if (!hasElapsed) {
      const timeBefore = hasStarted
        ? FindTimeBetween(now, closeDateTime)
        : FindTimeBetween(now, startDateTime);
      setTimeRemaining(timeBefore);
    }
    setDoTimeRefresh(false);
  }, [auction, doTimeRefresh]);

  const navigate = useNavigate();
  const onRemoveDraft = () => {
    Axios.delete(`/api/auctions/${auction.meaningfulId}`).finally(() => {
      navigate("/find-auctions");
    });
  };

  const [showBidding, setShowBidding] = useState(false);
  const status = getStatus(started, elapsed);
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
              <div
                className={
                  "auction_main-card_container auction_main-card_container-" +
                  status.toLowerCase()
                }
              >
                <span className="auction_status">{status}</span>
                <BasicCard>
                  <Card.Title>{auction?.title}</Card.Title>
                  <Card.Body>
                    <div className="auction_description-container">
                      {auction?.description}
                    </div>
                    <hr />
                    <div>
                      <div>
                        <span className="auction_main-card_heading">
                          Start:
                        </span>
                        <span>
                          {new Date(auction.starting).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="auction_main-card_heading">
                          Finish:
                        </span>
                        <span>
                          {new Date(auction.finishing).toLocaleString()}
                        </span>
                      </div>
                      <div className="auction_timing">
                        {status === "Active" && (
                          <>Time remaining on this auction: {timeRemaining}</>
                        )}
                        {status === "Closed" && (
                          <>Time on auction has elapsed.</>
                        )}
                        {status === "Pending" && (
                          <>Starting in: {timeRemaining}</>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div>
                      <span className="auction_main-card_heading">
                        Contract Vendor:
                      </span>
                      <span>
                        {creator?.name} ({creator?.email})
                      </span>
                    </div>
                  </Card.Body>
                </BasicCard>
              </div>
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
