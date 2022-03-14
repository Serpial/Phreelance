import React, { useEffect, useState } from "react";
import Axios from "axios";
import Card from "react-bootstrap/Card";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

import FindTimeBetween from "../util/FindTimeBetween";
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
  const { description, startTime, closeTime, auctionId, userAppId } = props;

  const [doBidRefresh, setDoBidRefresh] = useState(true);
  const [doTimeRefresh, setDoTimeRefresh] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setDoBidRefresh(true);
      setDoTimeRefresh(true);
    }, 950);

    return () => clearInterval(interval);
  }, []);

  const [minBid, setMinBid] = useState();
  const [userBid, setUserBid] = useState();
  const [topBidIsUser, setBidTopIsUser] = useState(false);
  useEffect(() => {
    if (!doBidRefresh) return;

    let cancel = false;

    Axios.get(`/api/bids/auction/${auctionId}`)
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
        setDoBidRefresh(false);
      })
      .catch((err) => console.log("Issue updating auctions :", err));

    return () => (cancel = true);
  }, [userBid, minBid, auctionId, userAppId, doBidRefresh]);

  const [timeRemaining, setTimeRemaining] = useState("");
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!doTimeRefresh) return;

    const now = new Date(Date.now());
    const startDateTime = new Date(Date.parse(startTime));
    const closeDateTime = new Date(Date.parse(closeTime));

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
  }, [startTime, closeTime, doTimeRefresh]);

  const auctionDescription =
    description.length < 120
      ? description
      : description.slice(0, 120).trim() + "...";

  const topBidderTooltip = (propss) => (
    <Tooltip {...propss}>You are the top bidder!</Tooltip>
  );

  const notTopTooltip = (propss) => (
    <Tooltip {...propss}>You are no longer top bidder!</Tooltip>
  );

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
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(p) => {
                  if (started && topBidIsUser) return topBidderTooltip(p);
                  if (userBid && !elapsed && !topBidIsUser)
                    return notTopTooltip(p);
                }}
              >
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
              </OverlayTrigger>
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

export default AuctionCard;
