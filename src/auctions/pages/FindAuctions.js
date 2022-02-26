import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useAuth } from "../../shared/contexts/AuthContext";
import FilterCard from "../components/FilterCard";
import AuctionList from "../components/AuctionList";

import "./FindAuctions.css";

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
  const buildFilterValues = (defaults) => {
    const queryParams = new URLSearchParams(window.location.search);
    let values = { ...defaults };
    for (const key in defaults) {
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

  const [filterValues, setFilterValues] = useState(
    buildFilterValues(FILTER_DEFAULTS)
  );
  const location = useLocation();
  const navigate = useNavigate();
  const handleFilterSubmit = useRef();
  useEffect(() => {
    handleFilterSubmit.current = (filterTerms) => {
      setFilterValues(filterTerms);
      const params = new URLSearchParams(location.search);

      // Tidy then set new params
      for (const key in FILTER_DEFAULTS) {
        params.delete(key);
        if (filterTerms[key] !== FILTER_DEFAULTS[key]) {
          params.set(key, filterTerms[key]);
        }
      }
      navigate("/find-auctions?" + params.toString());
    };
  }, [location, navigate]);

  const [userAppId, setUserAppId] = useState();
  const { activeUser } = useAuth();
  const userAuthId = activeUser.uid;
  useEffect(() => {
    let cancel = false;

    Axios.get(BACKEND_HOST + "/api/users/auth/" + userAuthId)
      .then((res) => {
        if (cancel) return;
        const user = res.data.user;
        setUserAppId(user.id);
      })
      .catch((err) => {
        console.log(err.response);
      });

    return () => (cancel = true);
  }, [userAuthId]);

  const [pageNumber, setPageNumber] = useState(1);
  const [auctionList, setAuctionList] = useState([]);
  const [auctionsOnPage, setAuctionsOnPage] = useState([]);
  const auctionsPerPage = 5;
  useEffect(() => {
    let cancel = false;

    Axios.get(`${BACKEND_HOST}/api/auctions`, {
      params: filterValues,
    })
      .then((res) => {
        if (cancel || res.status !== 200) return;
        const auctions = res.data.auctions.filter(
          (a) => a.creator !== userAppId
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
        console.log(err.response);
      });
    return () => (cancel = true);
  }, [userAppId, pageNumber, filterValues, auctionsPerPage]);

  const pageCount = Math.ceil(auctionList.length / auctionsPerPage);
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
          <AuctionList
            userAppId={userAppId}
            auctions={auctionsOnPage}
            emptyMessage="Could not find any auctions with these filters."
          />
          <ReactPaginate
            className="auctions-pagination"
            breakLabel="..."
            nextLabel="Next"
            previousLabel="Previous"
            onPageChange={({ selected }) => setPageNumber(selected + 1)}
            pageRangeDisplayed={pageCount > 5 ? 5 : pageCount}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Auctions;