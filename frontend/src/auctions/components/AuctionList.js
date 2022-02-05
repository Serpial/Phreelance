import React from "react";
import { useNavigate } from "react-router-dom";

import AuctionCard from "./AuctionCard";

import "./AuctionList.css";

/**
 * Takes a list of auctions objects and generates
 * auctions cards to be displayed to the user.
 *
 * @param {String} userId
 * This refers to the user in the backend to retreive
 * bids.
 *
 * @param {Array} auctions
 * Array of auction objects to be turned into cards.
 *
 * @returns list of auctions to be displayed.
 */
const AuctionList = ({ userId, auctions }) => {
  const navigate = useNavigate();

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
