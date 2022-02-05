import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/row";

import { useAuth } from "../../shared/contexts/AuthContext";
import FilterCard from "../components/FilterCard";
import AuctionList from "../components/AuctionList";

import "./Auctions.css";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;
const FILTER_DEFAULTS = {
  searchString: "",
  showPending: true,
  showStarted: true,
  showClosed: false,
  sortNewest: true,
  sortOldest: false,
};

/**
 * This is the main page where auctions will be displayed.
 *
 * This shows live values and descriptions to allow the user
 * to evaluate their contract options.
 *
 * @returns Auction page component
 */
const Auctions = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionsOnPage, setAuctionsOnPage] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentUserId, setCurrentUserId] = useState();
  const [filterValues, setFilterValues] = useState(
    mergedValues(FILTER_DEFAULTS)
  );

  const auctionsPerPage = 5;
  const pageCount = Math.ceil(auctionList.length / auctionsPerPage);

  const { activeUser } = useAuth();
  const userAuthId = activeUser.uid;

  const location = useLocation();
  const navigate = useNavigate();
  const handleFilterSubmit = useRef();
  useEffect(() => {
    handleFilterSubmit.current = (filterTerms) => {
      setFilterValues(filterTerms);
      const params = new URLSearchParams(location.search);

      // Tidy get parameters
      for (const pair of params.entries()) {
        params.delete(pair[0]);
      }

      for (const key in FILTER_DEFAULTS) {
        if (filterTerms[key] !== FILTER_DEFAULTS[key]) {
          params.set(key, filterTerms[key]);
        }
      }
      navigate("/auctions?" + params.toString());
    };
  }, [location, navigate]);

  useEffect(() => {
    let cancel = false;

    Axios.get(BACKEND_HOST + "/api/users/auth/" + userAuthId)
      .then((res) => {
        if (cancel || res.status !== 200) return;
        const user = res.data;
        setCurrentUserId(user.id);
      })
      .catch((err) => {
        console.log(err.request.status);
      });

    return () => (cancel = true);
  }, [userAuthId]);

  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/auctions`, {
      params: filterValues,
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
        console.log(err.request.status);
      });

    return () => (cancel = true);
  }, [currentUserId, pageNumber, filterValues, auctionsPerPage]);

  return (
    <Container fluid="sm">
      <Row xs={1} md={2}>
        <Col md={4}>
          <FilterCard
            filterValues={filterValues}
            onSubmit={handleFilterSubmit.current}
          />
        </Col>
        <Col md={7} lg={8}>
          <AuctionList userId={currentUserId} auctions={auctionsOnPage} />
          <ReactPaginate
            className="auctions-pagination"
            breakLabel="..."
            nextLabel="Next"
            previousLabel="Previous"
            onPageChange={({ selected }) => setPageNumber(selected + 1)}
            pageRangeDisplayed={pageCount > 5 ? 5 : pageCount}
            pageCount={pageCount}
            renderOnZeroPageCount={() => {
              return <p>Could not find any auctions with these search terms</p>;
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

const mergedValues = (defaults) => {
  const queryParams = new URLSearchParams(window.location.search);
  let values = { ...defaults };
  for (let key in defaults) {
    if (queryParams.has(key)) {
      const valueString = queryParams.get(key);

      let booleanValue;
      if (valueString === "true" || valueString === "false") {
        booleanValue = valueString === "true";
      }

      values[key] =
        booleanValue === undefined ? queryParams.get(key) : booleanValue;
    }
  }
  return values;
};

export default Auctions;
