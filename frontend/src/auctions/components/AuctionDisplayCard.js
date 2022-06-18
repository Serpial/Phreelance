import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";

import BasicCard from "../../shared/components/BasicCard";
import ProfileButton from "../../shared/components/ProfileButton";
import FindTimeBetween from "../util/FindTimeBetween";

import "./AuctionDisplayCard.css";

/**
 * Display auction information to the user in a larger format.
 *
 * @param {Object} auction
 * Object of the current auction.
 *
 * @param {Object} creator
 * Object of the creator of the auction
 *
 * @param {Function} getCurrentStatus
 * Callback method to retrieve the current status of the auction.
 *
 * @return AuctionDisplayCard
 */
const AuctionDisplayCard = ({ auction, creator, getCurrentStatus }) => {
  const [doTimeRefresh, setDoTimeRefresh] = useState(true);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [status, setStatus] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setDoTimeRefresh(true);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const getStatus = (started, elapsed) => {
    if (!elapsed && started) return "Active";
    if (elapsed) return "Closed";
    if (!started) return "Pending";
  };

  useEffect(() => {
    const currentStatus = getStatus(started, elapsed);
    setStatus(currentStatus);
    getCurrentStatus(currentStatus);
  }, [started, elapsed, getCurrentStatus]);

  return (
    <div
      className={
        "auction_main-card_container auction_main-card_container-" +
        status?.toLowerCase()
      }
    >
      <span className="auction_status">{status}</span>
      <BasicCard>
        <Card.Title className="auction_title">{auction?.title}</Card.Title>
        <Card.Body>
          <div className="auction_description-container">
            {auction?.description}
          </div>
          <hr />
          <div>
            <div>
              <span className="auction_main-card_heading">Start:</span>
              <span>{new Date(auction.starting).toLocaleString()}</span>
            </div>
            <div>
              <span className="auction_main-card_heading">Finish:</span>
              <span>{new Date(auction.finishing).toLocaleString()}</span>
            </div>
            <div className="auction_timing">
              {status === "Active" && (
                <>Time remaining on this auction: {timeRemaining}</>
              )}
              {status === "Closed" && <>Time on auction has elapsed.</>}
              {status === "Pending" && <>Starting in: {timeRemaining}</>}
            </div>
          </div>
          <hr />
          <div>
            <span className="auction_main-card_heading">Contract Vendor:</span>
            <ProfileButton subjectId={auction.creator} />
          </div>
        </Card.Body>
      </BasicCard>
    </div>
  );
};

export default AuctionDisplayCard;
