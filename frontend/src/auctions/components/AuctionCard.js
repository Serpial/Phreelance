import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./AuctionCard.css";

const AuctionCard = (props) => {
  const [active, setIsActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [started, setStarted] = useState(false);

  if (false) {
    setIsActive(false);
  }
  const isUser = true;

  const auctionDescription = props.description;
  const description =
    auctionDescription.length < 120
      ? auctionDescription
      : auctionDescription.trim().slice(0, 120) + "...";

  const startTime = props.startTime;
  const closeTime = props.closeTime;
  
  useEffect(() => {
    const start = Date.parse(startTime);
    const close = Date.parse(closeTime);
    const now = Date.now();

    if (!started && now > start) {
      setStarted(true);
    }

    let timeBefore = timeBetween(close, start);
    if (!started) {
      timeBefore = timeBetween(start, now);
    }
    setTimeRemaining(timeBefore);
  }, [started, startTime, closeTime]);

  return (
    <BasicCard className="auction-card">
      <Card.Title
        className="auction-card_title-container"
        onClick={props.onClick}
      >
        <span className="auction-card_title">{props.title}</span>
        {started &&
          (active ? (
            <span className="auction-card_status auction-card_status-active">
              Active
            </span>
          ) : (
            <span className="auction-card_status auction-card_status-closed">
              Closed
            </span>
          ))}
      </Card.Title>
      <Card.Body className="auction-card_body-container">
        {started &&
          (active ? (
            <span className="auction-card_timing">
              Time remaining on this auction: {timeRemaining}
            </span>
          ) : (
            <span className="auction-card_timing">
              Time on auction has elapsed.
            </span>
          ))}
        {!started && (
          <span className="auction-card_timing">
            Starting in: {timeRemaining}
          </span>
        )}
        <div className="auction-card_description">{description}</div>
        <div className="auction-card_bid-container">
          <div className="auction-card_top-bid"></div>
          <div className="auction-card_notification">
            {isUser ? (
              <>
                <FontAwesomeIcon
                  className="auction-card_icon"
                  icon={faUserCircle}
                />
                You
              </>
            ) : (
              <FontAwesomeIcon
                className="auction-card_icon auction-card_warning-icon"
                icon={faExclamationCircle}
              />
            )}
          </div>
          <div className="auction-card_my-bid"></div>
        </div>
      </Card.Body>
    </BasicCard>
  );
};

const timeBetween = (timeA, timeB) => {
  const difference = timeA - timeB;
  const difference_in_months = difference / (1000 * 3600 * 24 * 31 * 12);

  if (difference_in_months > 1) {
    return Math.floor(difference_in_months) + " months";
  }

  const difference_in_days = difference_in_months / 31;
  if (difference_in_days > 1) {
    return Math.floor(difference_in_days) + " days";
  }

  const difference_in_hours = difference_in_days / 24;
  if (difference_in_hours > 1) {
    return Math.floor(difference_in_hours) + " hours";
  }

  const difference_in_minutes = difference_in_hours / 60;
  if (difference_in_minutes > 1) {
    return Math.floor(difference_in_minutes) + " minutes";
  }

  const difference_in_seconds = difference_in_minutes / 60;
  if (difference_in_seconds > 1) {
    return Math.floor(difference_in_seconds) + " seconds";
  }
};

export default AuctionCard;
