import React from "react";
import BidCard from "./BidCard";

import "./BidList.css";

/**
 * Component to contruct the list of bids to be displayed on an auction page.
 *
 * @param {Bool} isAuctionCreator
 * Boolean to decide weather or not we display additional information
 * to the user. This only happens if they are the auction creator.
 *
 * @param {[Object]} bids
 * Array of bid objects retrieved from the database.
 *
 * @returns List of Bids
 */
const BidList = ({ isAuctionCreator, bids }) => {
  if (bids.length === 0) {
    return (
      <span className="bid-list_empty-list">No current bids at this time</span>
    );
  }

  return (
    <ul className="bid-list">
      {bids.map((bid) => (
        <li key={bid.id}>
          <BidCard showAdditionalDetail={isAuctionCreator} bid={bid} />
        </li>
      ))}
    </ul>
  );
};

export default BidList;
