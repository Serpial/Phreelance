import React, { useEffect, useState } from "react";
import Axios from "axios";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./AuctionCard.css";

/**
 * Individual auction card that displays surface
 * information about an auction. This will include
 * its current top price, description, and time
 * remaining before it starts or finishes.
 *
 * @param {String} description
 * Short description of the auction displayed
 * to the user
 *
 * @param {String} startTime
 * Start time of the auction used to calculate
 * the remaining time.
 *
 * @param {String} closeTime
 * Close time of the auction used to calculate
 * the remaining time.
 *
 * @param {String} auctionId
 * ID associated with this auction.
 *
 * @param {String} userId
 * Used to determine whether the user is currently
 * the top bid.
 *
 * @returns Card displaying individual auction information.
 */
const AuctionCard = (props) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(false);
  const [topBidIsUser, setBidTopIsUser] = useState(false);
  const [minBid, setMinBid] = useState();
  const [userBid, setUserBid] = useState();

  const { description, startTime, closeTime, auctionId, userAppId } = props;

  const auctionDescription =
    description.length < 120
      ? description
      : description.slice(0, 120).trim() + "...";

  useEffect(() => {
    let cancel = false;

    Axios.get(
      process.env.REACT_APP_RUN_BACK_END_HOST + "/api/bids/auction/" + auctionId
    )
      .then((response) => {
        if (cancel) return;

        const bids = response.data.bids;
        if (bids.length < 1) return;
        const minBidValue = Math.min(...bids.map((b) => b.value));
        if (!minBidValue) return;
        setMinBid(parseBid(minBidValue));

        const usersBidValue = bids.find((b) => b.creator === userAppId)?.value;
        if (!usersBidValue) return;
        
        const bidAsString = parseBid(usersBidValue);
        setUserBid(bidAsString);

        if (usersBidValue === minBidValue) {
          setBidTopIsUser(true);
        }
      })
      .catch((err) => console.log(err));

    return () => (cancel = true);
  }, [userBid, minBid, auctionId, userAppId]);

  useEffect(() => {
    const start = Date.parse(startTime);
    const close = Date.parse(closeTime);
    const now = Date.now();

    if (!elapsed && now > close) {
      setElapsed(true);
    }

    if (!started && now > start) {
      setStarted(true);
    }

    let timeBefore = timeBetween(close, start);
    if (!started) {
      timeBefore = timeBetween(start, now);
    }
    setTimeRemaining(timeBefore);
  }, [started, elapsed, startTime, closeTime]);

  return (
    <BasicCard className="auction-card">
      <Card.Title
        className="auction-card_title-container"
        onClick={props.onClick}
      >
        <span className="auction-card_title">{props.title}</span>
        {!elapsed && started && (
          <span className="auction-card_status auction-card_status-active">
            Active
          </span>
        )}
        {elapsed && (
          <span className="auction-card_status auction-card_status-closed">
            Closed
          </span>
        )}
        {!started && (
          <span className="auction-card_status auction-card_status-pending">
            Pending
          </span>
        )}
      </Card.Title>
      <Card.Body className="auction-card_body-container">
        {!elapsed && started && (
          <span className="auction-card_timing">
            Time remaining on this auction: {timeRemaining}
          </span>
        )}
        {elapsed && (
          <span className="auction-card_timing">
            Time on auction has elapsed.
          </span>
        )}
        {!started && (
          <span className="auction-card_timing">
            Starting in: {timeRemaining}
          </span>
        )}
        <div className="auction-card_description">{auctionDescription}</div>
        {minBid && (
          <>
            <hr />
            <div className="auction-card_bid-container">
              <span className="auction-card_bid-label">Winning bid: </span>
              <span className="auction-card_value-container">
                {minBid}
                <span className="auction-card_notification">
                  {started && topBidIsUser && (
                    <FontAwesomeIcon
                      className="auction-card_icon"
                      icon={faUserCircle}
                      fixedWidth
                      size="lg"
                    />
                  )}
                  {userBid && !elapsed && !topBidIsUser && (
                    <FontAwesomeIcon
                      className="auction-card_icon auction-card_warning-icon"
                      icon={faExclamationCircle}
                      fixedWidth
                      size="lg"
                    />
                  )}
                </span>
              </span>
            </div>
          </>
        )}
        {userBid && !topBidIsUser && (
          <>
            <div className="auction-card_bid-container">
              <span className="auction-card_bid-label">My bid: </span>
              <span className="auction-card_value-container">{userBid}</span>
            </div>
          </>
        )}
      </Card.Body>
    </BasicCard>
  );
};

const parseBid = (valueNumber) => {
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  const numberFormat = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return numberFormat.format(valueNumber);
};

const timeBetween = (timeA, timeB) => {
  const difference = timeA - timeB;
  const difference_in_months = difference / (1000 * 3600 * 24 * 31);
  if (difference_in_months > 1) {
    return Math.floor(difference_in_months) + " months";
  }

  const difference_in_days = difference_in_months * 31;
  if (difference_in_days > 1) {
    return Math.floor(difference_in_days) + " days";
  }

  const difference_in_hours = difference_in_days * 24;
  if (difference_in_hours > 1) {
    return Math.floor(difference_in_hours) + " hours";
  }

  const difference_in_minutes = difference_in_hours * 60;
  if (difference_in_minutes > 1) {
    return Math.floor(difference_in_minutes) + " minutes";
  }

  const difference_in_seconds = difference_in_minutes * 60;
  return Math.floor(difference_in_seconds) + " seconds";
};

export default AuctionCard;
