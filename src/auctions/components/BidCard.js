import React, { useEffect, useState } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

import "./BidCard.css";

/**
 * Card to display a bid on the auction page.
 *
 * @param {Bool} isAuctionCreator
 * Vary options based on whether or not the user is the auction creator.
 *
 * @param {Object} bid
 * The appropriate bid and information to display.
 *
 * @returns BidCard
 */
const BidCard = ({ isAuctionCreator, bid }) => {
  const [bidCreator, setBidCreator] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/users/${bid.creator}`)
      .then((res) => {
        if (cancel) return;
        const userRes = res.data.user;
        setBidCreator(userRes);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));

    return () => (cancel = true);
  }, [bid]);

  const parseBid = (valueNumber) => {
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    const numberFormat = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    });

    return numberFormat.format(valueNumber);
  };

  return (
    <>
      {!isLoading && (
        <BasicCard className="bid-card">
          <div className="bid-card_value">{parseBid(bid.value)}</div>
          {isAuctionCreator && (
            <>
              <div>Proposal: {bid.description}</div>
              <div>Time estimate: {bid.timeEstimation}</div>
            </>
          )}
          <hr />
          <span>
            <FontAwesomeIcon className="bid-card_icon" icon={faUserCircle} />
            <span>{bidCreator?.name} </span>
          </span>
          <span className="bid-card_last-modified">
            Modified: {new Date(bid.lastChange).toLocaleString()}
          </span>
        </BasicCard>
      )}
    </>
  );
};

export default BidCard;
