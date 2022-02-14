import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

const Auction = () => {
  const { auctionID } = useParams();

  const [auction, setAuction] = useState();
  console.log(auction);
  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/auctions/${auctionID}`)
      .then((res) => {
        if (cancel) return;
        console.log(res.data.auction)
        setAuction(res.data.auction);
      })
      .catch((err) => console.log(err.response));

    return () => (cancel = true);
  }, [auctionID]);
  return <></>;
};

export default Auction;
