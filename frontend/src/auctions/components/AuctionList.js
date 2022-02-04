import React from "react";
import { useNavigate } from "react-router-dom";

import AuctionCard from "./AuctionCard";

import "./AuctionList.css";

const AuctionList = (props) => {
  const navigate = useNavigate();

  const { userId, auctions } = props;
  if (auctions === 0) {
    return (
      <span className="auction-list_empty-list">
        Could not find any auctions with these filters
      </span>
    );
  }

  const onAuctionClick = (event, auctionId) => {
    event.preventDefault();
    navigate(`/auctions/${auctionId}`);
  };

  return (
    <ul className="auction-list">
      {auctions.map((auction) => (
          <li key={auction.id}>
            <AuctionCard
              auctionId={auction.id}
              title={auction.title}
              onClick={(e) => onAuctionClick(e, auction.id)}
              description={auction.description}
              isPublic={auction.isPublic}
              startTime={auction.starting}
              closeTime={auction.finishing}
              userId={userId}
            />
          </li>
        ))}
    </ul>
  );
};

export default AuctionList;
