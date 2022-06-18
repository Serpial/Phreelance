import React from "react";

import ToDisplayValue from "../util/ToDisplayValue";

import "./EnglishBidDisplay.css";

/**
 * Display price information for an Basic English Auction.
 *
 * @param {Object} auction
 * Auction object used to grab object specific information.
 *
 * @param {Object} topBid
 * Display the top bid if available.
 *
 * @returns EnglishBidDisplay
 */
const EnglishBidDisplay = ({ auction, topBid }) => {
  if (!auction) return;
  return (
    <>
      <div>
        <span>Reserve price:</span>
        <span>{" " + ToDisplayValue(auction.reservePrice)}</span>
      </div>
      <div>
        <span className="english-bid-display_top-bid-preface">
          Winning bid:{" "}
        </span>
        <span className="english-bid-display_top-bid-value">
          {topBid ? ToDisplayValue(topBid.value) : "£-.--"}
        </span>
      </div>
    </>
  );
};

export default EnglishBidDisplay;
