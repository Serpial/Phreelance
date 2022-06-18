import React, { useEffect, useState } from "react";
import Axios from "axios";

import BasicCard from "../../shared/components/BasicCard";
import ToDisplayValue from "../util/ToDisplayValue";
import ProfileButton from "../../shared/components/ProfileButton";

import "./BidCard.css";

/**
 * Card to display a bid on the auction page.
 *
 * @param {Bool} showAdditionalDetail
 * Show additional detail if the user is the bid creator or the user is
 * the auction creator.
 *
 * @param {Object} bid
 * The appropriate bid and information to display.
 *
 * @returns BidCard
 */
const BidCard = ({ showAdditionalDetail, bid }) => {
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

  return (
    <>
      {!isLoading && (
        <BasicCard className="bid-card">
          <div></div>
          <div className="bid-card_value">{ToDisplayValue(bid.value)}</div>
          {showAdditionalDetail && (
            <>
              <div>Proposal: {bid.description}</div>
              <div>Time estimate: {bid.timeEstimation}</div>
            </>
          )}
          <hr />
          <span>
            <ProfileButton subjectId={bidCreator?.id} />
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
