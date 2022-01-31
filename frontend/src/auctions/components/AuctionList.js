import React from "react";
import { useNavigate } from "react-router-dom";
import AuctionCard from "./AuctionCard";

import "./AuctionList.css";

const AuctionList = (props) => {
  const navigate = useNavigate();

  const pageNumber = props.pageNumber;
  // const pageItems = props.items.slice(0, );
  const pageItems = props.items;
  if (pageItems.length === 0) {
    return <span>Could not find any auctions with these filters</span>;
  }
  return (
    <ul className="auction-list">
      {props.items.map((auction) => (
        <li>
          <AuctionCard
            id={auction.id}
            title={auction.title}
            onClick={() => navigate(`/auctions/${auction.id}`)}
            description={auction.description}
            startTime={auction.start}
            closeTime={auction.end}
          />
        </li>
      ))}
    </ul>
  );
};

export default AuctionList;
