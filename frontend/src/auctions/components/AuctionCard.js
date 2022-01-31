import React, { useState } from "react";
import Card from "react-bootstrap/Card";

import BasicCard from "../../shared/components/BasicCard";

import "./AuctionCard.css";

const AuctionCard = (props) => {
  const [active, setIsActive] = useState(true);

  if (false) {
    setIsActive(false);
  }
  const started = true;

  return (
    <BasicCard onClick={props.onClick}>
      <Card.Title>
        <span>{props.title}</span>
        {started &&
          (active ? (
            <>
              <span className="auction-card_status auction-card_status-active">
                Active
              </span>
              <span>Time remaining on this auction: {props.timeRemaining}</span>
            </>
          ) : (
            <>
              <span className="auction-card_status auction-card_status-closed">
                Closed
              </span>
              <span>Time on auction has elapsed</span>
            </>
          ))}
        {!started && <span>{props.timeRemaining}</span>}
      </Card.Title>
      <Card.Body>
        <div>{props.description}</div>
        <div className="auction-card_bid-container">
          <div className="auction-card_you-notification"></div>
          <div className="auction-card_top-bid"></div>
          <div className="auction-card_my-bid"></div>
        </div>
      </Card.Body>
    </BasicCard>
  );
};

export default AuctionCard;
