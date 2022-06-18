import React from "react";
import { useNavigate } from "react-router-dom";

import AuctionCard from "./AuctionCard";
import { useAuth } from "../../shared/contexts/AuthContext";

import "./AuctionList.css";

/**
 * Takes a list of auctions objects and generates
 * auctions cards to be displayed to the user.
 *
 * @param {Array} auctions
 * Array of auction objects to be turned into cards.
 *
 * @param {String} emptyMessage
 * String that you wish to be displayed when the list
 * is empty
 *
 * @returns list of auctions to be displayed.
 */
const AuctionList = ({ auctions, emptyMessage }) => {
  const navigate = useNavigate();
  const { appUser } = useAuth();

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
        <li key={auction.meaningfulId}>
          <AuctionCard
            auctionId={auction.meaningfulId}
            title={auction.title}
            onClick={() => navigate(`/auction/${auction.meaningfulId}`)}
            description={auction.description}
            isPublic={auction.isPublic}
            startTime={auction.starting}
            closeTime={auction.finishing}
            userAppId={appUser}
          />
        </li>
      ))}
    </ul>
  );
};

export default AuctionList;
