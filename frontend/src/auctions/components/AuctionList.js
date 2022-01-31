import React from "react";
import { useNavigate } from "react-router-dom";

import AuctionCard from "./AuctionCard";

import "./AuctionList.css";

const AuctionList = (props) => {
  const navigate = useNavigate();

  const pageItems = props.items;
  if (pageItems.length === 0) {
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
      {props.items.map((auction) => (
        <li key={auction.id}>
          <AuctionCard
            id={auction.id}
            title={auction.title}
            onClick={(e) => onAuctionClick(e, auction.id)}
            description={auction.description}
            isPublic={auction.isPublic}
            startTime={auction.starting}
            closeTime={auction.finishing}
            user={props.user}
          />
        </li>
      ))}
    </ul>
  );
};

export default AuctionList;
