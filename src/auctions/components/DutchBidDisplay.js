import React, { useEffect, useState } from "react";

import ToDisplayValue from "../util/ToDisplayValue";
import {
  calculateCurrentIncrement,
  calculateCurrentPrice,
} from "../util/DutchAuctionPriceHelper";

import "./DutchBidDisplay.css";

/**
 * Display price information for a Dutch bid.
 *
 * @param {Object} auction
 * Auction object used to grab object specific information.
 *
 * @param {Object} topBid
 * Display the top bid if available.
 *
 * @param {String} status
 * Conditionally show information if status is active.
 *
 * @returns DutchBidDisplay
 */
const DutchBidDisplay = ({ auction, topBid, status }) => {
  const [currentPrice, setCurrentPrice] = useState();
  const [refreshAutoPrice, setRefreshAutoPrice] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshAutoPrice(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!refreshAutoPrice) return;
    const currentIncrement = calculateCurrentIncrement(
      new Date().getTime(),
      new Date(auction.starting).getTime(),
      new Date(auction.finishing).getTime()
    );
    const price = calculateCurrentPrice(
      auction.startingPrice,
      auction.reservePrice,
      currentIncrement
    );
    setCurrentPrice(ToDisplayValue(price));
    setRefreshAutoPrice(false);
  }, [auction, refreshAutoPrice]);

  return (
    <>
      <div>
        <span>Reserve price:</span>
        <span>{" " + ToDisplayValue(auction?.reservePrice)}</span>
      </div>
      <div>
        <span>Starting price:</span>
        <span>{" " + ToDisplayValue(auction?.startingPrice)}</span>
      </div>
      <div className="dutch-bid-display_main-price">
        {topBid ? (
          <>
            <span>Price:</span>
            <span>{" " + ToDisplayValue(topBid.value)}</span>
          </>
        ) : (
          status === "Active" && (
            <>
              <span>Automated Price:</span>
              <span>{" " + currentPrice}</span>

              <div className="dutch-bid-display_automated-bid-warning">
                This automated price will increase with time...
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default DutchBidDisplay;
