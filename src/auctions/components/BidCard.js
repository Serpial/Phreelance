import React, { useEffect, useState } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import BasicCard from "../../shared/components/BasicCard";

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
  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/users/${bid.creator}`)
      .then((res) => {
        if (cancel) return;
        const userRes = res.data.user;
        setBidCreator(userRes);
      })
      .catch((err) => console.log(err));

    return () => (cancel = true);
  }, [bid]);

  return (
    <BasicCard>
      <div>{bid.value}</div>
      {isAuctionCreator && (
        <>
          <div>{bid.description}</div>
          <div>{bid.timeEstimation}</div>
        </>
      )}
      <hr />
      <span>
        <FontAwesomeIcon icon={faUserCircle} />
        <span>
          {bidCreator.name} ({isAuctionCreator && bidCreator.email})
        </span>
      </span>
    </BasicCard>
  );
};

export default BidCard;
