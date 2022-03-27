import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import CurrencyInput from "react-currency-input-field";

import ModalCard from "../../shared/components/ModalCard";
import BasicCard from "../../shared/components/BasicCard";
import DateTimeInput from "../components/DateTimeInput";
import DateIsWithinRange from "../util/DateIsWithinRange";
import { useAuth } from "../../shared/contexts/AuthContext";
import AuctionTypes from "../res/AuctionTypes.json";

import "./CreateListing.css";

// Starts tomorrow at 12pm
const DEFAULT_START_DATE = new Date(new Date().getTime() + 86000000);

// Finishes a 2 days from now (plus 1 hour)
const DEFAULT_END_DATE = new Date(
  new Date().getTime() + 3600000 + 86000000 * 2
);

const AUCTION_DEFINITIONS = AuctionTypes.types;

/**
 * Create auction listing with various options
 * @returns CreateListing page
 */
const CreateListing = () => {
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE);
  const [dateWarnings, setDateWarnings] = useState();
  const [showPriceWarning, setShowPriceWarning] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [useCustomStartTime, setUseCustomStartTime] = useState(false);
  const [auctionType, setAuctionType] = useState(AUCTION_DEFINITIONS[0]);
  const [auctionDescription, setAuctionDescription] = useState(
    AUCTION_DEFINITIONS[0].description
  );

  const title = useRef();
  const description = useRef();
  const reservePrice = useRef();
  const startingPrice = useRef();

  const navigate = useNavigate();
  const { appUser } = useAuth();

  const handleDropdownChange = (event) => {
    const newAuctionType = AUCTION_DEFINITIONS.find(
      (a) => a.fullName === event.target.value
    );
    setAuctionType(newAuctionType);
    setAuctionDescription(newAuctionType.description);
  };

  const applyDateWarning = ({ newStartDate, newEndDate }) => {
    const validateDate = DateIsWithinRange(
      new Date(),
      newStartDate || startDate,
      newEndDate || endDate
    );
    if (validateDate.isValid) {
      setDateWarnings(null);
      return;
    }

    let id = 0;
    const warnings = (
      <ul>
        {validateDate.message.map((w) => (
          <li key={"date-warning-" + id++}>{w}</li>
        ))}
      </ul>
    );

    setDateWarnings(warnings);
  };

  const applyPriceWarning = () => {
    const sPrice = startingPrice.current?.value.replace(",", "").slice(1);
    const rPrice = reservePrice.current?.value.replace(",", "").slice(1);

    if (sPrice && rPrice && parseFloat(rPrice) <= parseFloat(sPrice)) {
      setShowPriceWarning(true);
      return;
    }
    setShowPriceWarning(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (dateWarnings && dateWarnings.length > 1 && showPriceWarning) return;
    const isPublic = event.nativeEvent.submitter.name === "publish";

    if (isPublic && !useCustomStartTime) {
      setShowConfirmModal(true);
      return;
    }

    publish({ isPublic });
  };

  const publish = ({ isPublic }) => {
    setShowConfirmModal(false);
    const newAuction = {
      title: title.current.value,
      description: description.current.value,
      reservePrice: parseFloat(
        reservePrice.current.value.replace(",", "").slice(1)
      ),
      startingPrice: 0,
      auctionType: auctionType.shortName,
      finishing: endDate.toUTCString(),
    };

    if (startingPrice?.current?.value) {
      const newStartPrice = parseFloat(
        startingPrice.current.value.replace(",", "").slice(1)
      );
      newAuction.startingPrice = newStartPrice;
    }
    if (useCustomStartTime) {
      newAuction.starting = startDate.toUTCString();
    }

    if (isPublic) {
      newAuction.isPublic = isPublic;
    }

    Axios.post(`/api/auctions/${appUser.id}`, newAuction).then((res) => {
      const newAuctionId = res?.data?.auction.meaningfulId;
      navigate("/auction/" + newAuctionId);
    });
  };

  return (
    <>
      <ModalCard
        show={showConfirmModal}
        title="Publishing... Are you sure?"
        infoText="You will not be able to change the some options after publishing an auction."
      >
        <Button variant="danger" onClick={() => publish({ isPublic: true })}>
          Confirm
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => setShowConfirmModal(false)}
        >
          Cancel
        </Button>
      </ModalCard>
      <Container as="form" onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <BasicCard>
              <Card.Title>About</Card.Title>
              <Card.Body>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  ref={title}
                  required
                  placeholder="My new contract"
                />
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={3}
                  minLength={10}
                  required
                  ref={description}
                  placeholder="Please describe the contract..."
                />
                {dateWarnings && (
                  <Alert className="create-listing_alert" variant="danger">
                    {dateWarnings}
                  </Alert>
                )}
                <Form.Label>Start time</Form.Label>
                <Form.Check
                  checked={useCustomStartTime}
                  onChange={() => setUseCustomStartTime(!useCustomStartTime)}
                  label="Delay the start-time of your auction"
                />
                <DateTimeInput
                  defaultDate={DEFAULT_START_DATE}
                  onChange={(date) => {
                    setStartDate(date);
                    applyDateWarning({ newStartDate: date });
                  }}
                  disabled={!useCustomStartTime}
                />
                <Form.Label>Finish time</Form.Label>
                <DateTimeInput
                  defaultDate={DEFAULT_END_DATE}
                  onChange={(date) => {
                    setEndDate(date);
                    applyDateWarning({ newEndDate: date });
                  }}
                />
              </Card.Body>
            </BasicCard>
          </Col>
          <Col md={4}>
            <BasicCard>
              <Card.Title>Pricing</Card.Title>
              <Card.Body>
                <Form.Label>Reserve Price</Form.Label>
                <CurrencyInput
                  className="form-control"
                  name="reserve-price"
                  ref={reservePrice}
                  required
                  prefix="£"
                  onChange={applyPriceWarning}
                  decimalsLimit={2}
                  placeholder="£100"
                />
                {auctionType.shortName === "DUT" && (
                  <>
                    <Form.Label>Starting Price</Form.Label>
                    {showPriceWarning && (
                      <Alert variant="danger">
                        The starting price should be less than the reserve
                        price.
                      </Alert>
                    )}
                    <CurrencyInput
                      className="form-control"
                      name="start-price"
                      ref={startingPrice}
                      required
                      prefix="£"
                      onChange={applyPriceWarning}
                      decimalsLimit={2}
                      placeholder="£30.99"
                    />
                  </>
                )}
                <Form.Label>Auction Type</Form.Label>
                <Form.Select onChange={handleDropdownChange}>
                  {AUCTION_DEFINITIONS.map((option) => (
                    <option key={option.shortName}>{option.fullName}</option>
                  ))}
                </Form.Select>
                <Alert className="create-listing_alert" variant="dark">
                  {auctionDescription}
                </Alert>
              </Card.Body>
            </BasicCard>
            <BasicCard>
              <Button
                as="input"
                className="create-listing_submit-button"
                type="submit"
                value="Save as draft"
                name="draft"
                variant="secondary"
              />
              <Button
                as="input"
                className="create-listing_submit-button"
                type="submit"
                value="Publish"
                name="publish"
                variant="primary"
              />
            </BasicCard>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateListing;
