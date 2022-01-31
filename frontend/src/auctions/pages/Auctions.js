import React, { useEffect, useState } from "react";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/row";

import { useAuth } from "../../shared/contexts/AuthContext";
import FilterCard from "../components/FilterCard";
import AuctionList from "../components/AuctionList";

import "./Auctions.css";

const Auctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const queryParams = new URLSearchParams(window.location.search);
  const currentListPage = queryParams.get("pageNumber");

  useEffect(() => {
    let cancel = false;

    const { activeUser } = useAuth;
    Axios.get(
      process.env.REACT_APP_RUN_BACK_END_HOST +
        "/api/users/auth/" +
        activeUser.uid
    ).then((response) => {
      if (cancel || response.status !== 200) return;
      currentUser = response.data;
    });

    return () => (cancel = true);
  }, []);

  useEffect(() => {
    let cancel = false;

    Axios.get(process.env.REACT_APP_RUN_BACK_END_HOST + "/api/auctions/")
      .then((response) => {
        if (cancel || response.status !== 200) return;
        setAuctionList(response.data.auctions);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (cancel = true);
  }, []);

  return (
    <Container fluid="sm">
      <Row xs={1} md={2}>
        <Col md={4}>
          <FilterCard />
        </Col>
        <Col md={7} lg={8}>
          <AuctionList
            pageNumber={currentListPage}
            items={auctionList.filter((a) => a.creator !== currentUser.id)}
            user={currentUser}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Auctions;
