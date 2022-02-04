import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/row";

import { useAuth } from "../../shared/contexts/AuthContext";
import FilterCard from "../components/FilterCard";
import AuctionList from "../components/AuctionList";

import "./Auctions.css";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

const Auctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionsOnPage, setAuctionsOnPage] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentUserId, setCurrentUserId] = useState();

  const auctionsPerPage = 5;
  const pageCount = Math.ceil(auctionList.length / auctionsPerPage);

  const { activeUser } = useAuth();
  const userAuthId = activeUser.uid;

  useEffect(() => {
    let cancel = false;

    Axios.get(BACKEND_HOST + "/api/users/auth/" + userAuthId)
      .then((res) => {
        if (cancel || res.status !== 200) return;
        const user = res.data;
        setCurrentUserId(user.id);
      })
      .catch((err) => {
        console.log(err.status);
      });

    return () => (cancel = true);
  }, [userAuthId]);

  const queryParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/auctions`, {
      params: queryParams,
    })
      .then((res) => {
        if (cancel || res.status !== 200) return;
        const auctions = res.data.auctions.filter(
          (a) => a.creator !== currentUserId
        );
        setAuctionList(auctions);
        setAuctionsOnPage(
          auctions.slice(
            (pageNumber - 1) * auctionsPerPage,
            pageNumber * auctionsPerPage
          )
        );
      })
      .catch((err) => {
        console.log(err.status);
      });

    return () => (cancel = true);
  }, [currentUserId, queryParams, pageNumber, auctionsPerPage]);

  const handlePageChange = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    handlePageChange.current = ({ selected }) => {
      const newPage = selected + 1;
      setPageNumber(newPage);
      navigate("/auctions?page=" + newPage);
    };
  }, [handlePageChange, navigate]);

  return (
    <Container fluid="sm">
      <Row xs={1} md={2}>
        <Col md={4}>
          <FilterCard />
        </Col>
        <Col md={7} lg={8}>
          <AuctionList userId={currentUserId} auctions={auctionsOnPage} />
          <ReactPaginate
            className="auctions-pagination"
            breakLabel="..."
            nextLabel="Next"
            previousLabel="Previous"
            onPageChange={handlePageChange.current}
            pageRangeDisplayed={pageCount > 5 ? 5 : pageCount}
            pageCount={pageCount}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Auctions;
