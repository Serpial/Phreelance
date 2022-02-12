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
 * @param {String} emptyMessage
 * Sttring that you wish to be displayed when the list
 * is empty
 *
 * @returns list of auctions to be displayed.
 */
const AuctionList = ({ userAppId, auctions, emptyMessage }) => {
  const navigate = useNavigate();

  if (auctions.length === 0) {
    return (
      <span className="auction-list_empty-list">
        {emptyMessage || "Could not find any auctions."}
      </span>
    );
  }

  return (
    <ul className="auction-list">
      {auctions.map((auction) => (
        <li key={auction.id}>
          <AuctionCard
            auctionId={auction.id}
            title={auction.title}
            onClick={() => navigate(`/auctions/${auction.id}`)}
            description={auction.description}
            isPublic={auction.isPublic}
            startTime={auction.starting}
            closeTime={auction.finishing}
            userAppId={userAppId}
          />
        </li>
      ))}
    </ul>
  );
};

export default AuctionList;
