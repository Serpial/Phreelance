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
import Backdrop from "../../shared/components/Backdrop";
import DateTimeInput from "../components/DateTimeInput";
import { useAuth } from "../../shared/contexts/AuthContext";

import "./CreateListing.css";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

// Starts tomorrow at 12pm
const DEFAULT_START_DATE = new Date(new Date().getTime() + 86000000);

// Finishes a 2 days from now (plus 1 hour)
const DEFAULT_END_DATE = new Date(
  new Date().getTime() + 3600000 + 86000000 * 2
);

const AUCTION_DESCRIPTIONS = {
  "English auction": "English",
  "Dutch auction": "Dutch",
};

/**
 * Create auction listing with various options
 * @returns CreateListing page
 */
const CreateListing = () => {
  const title = useRef();
  const description = useRef();
  const reservePrice = useRef();

  const defaultAuctionType = Object.keys(AUCTION_DESCRIPTIONS)[0];
  const [auctionType, setAuctionType] = useState(defaultAuctionType);
  const defaultAuctionDescription = AUCTION_DESCRIPTIONS[auctionType];
  const [auctionDescription, setAuctionDescription] = useState(
    defaultAuctionDescription
  );
  const handleDropdownChange = (event) => {
    const newAuctionType = event.target.value;
    setAuctionType(newAuctionType);
    setAuctionDescription(AUCTION_DESCRIPTIONS[newAuctionType]);
  };

  const [startDate, setStartDate] = useState(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE);
  const [dateWarnings, setDateWarnings] = useState();
  const applyDateWarning = ({ newStartDate, newEndDate }) => {
    const validateDate = dateIsWithinRange(
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [useCustomStartTime, setUseCustomStartTime] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (dateWarnings && dateWarnings.length > 1) return;
    const isPublic = event.nativeEvent.submitter.name === "publish";

    if (isPublic && !useCustomStartTime) {
      setShowConfirmModal(true);
      return;
    }

    publish({ isPublic });
  };

  const authId = useAuth()?.activeUser?.uid;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const publish = ({ isPublic }) => {
    setShowConfirmModal(false);
    setLoading(true);
    const newAuction = {
      title: title.current.value,
      description: description.current.value,
      reservePrice: reservePrice.current.value,
      auctionType: auctionType.toLowerCase().slice(0, 3),
      finishing: endDate.toUTCString(),
    };

    if (useCustomStartTime) {
      newAuction["starting"] = startDate.toUTCString();
    }

    if (isPublic) {
      newAuction["isPublic"] = isPublic;
    }

    Axios.get(`${BACKEND_HOST}/api/users/auth/${authId}`)
      .then((res) => {
        const uri = `${BACKEND_HOST}/api/auctions/${res?.data?.user?.id}`;
        return Axios.post(uri, newAuction);
      })
      .then((res) => {
        const newAuctionId = res?.data?.auction?.meaningfulId;
        navigate("/auction/" + newAuctionId);
      })
      .catch((_err) => {
        navigate("/my-auctions");
      });
  };

  return (
    <>
      {loading && <Backdrop />}
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
                  ref={title}
                  required
                  placeholder="My new contract"
                />
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
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
                  ref={reservePrice}
                  required
                  prefix="£"
                  decimalsLimit={2}
                  placeholder="£30.99"
                />
                <Form.Label>Auction Type</Form.Label>
                <Form.Select onChange={handleDropdownChange}>
                  {Object.keys(AUCTION_DESCRIPTIONS).map((option) => (
                    <option key={option.split(" ")[0]}>{option}</option>
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

const dateIsWithinRange = (creation, start, finish) => {
  const day = 86400000;
  const threeMonths = 8035200000;
  const year = 31622400000;

  const message = [];
  const startIsWithinThreeMonths =
    start.getTime() < creation.getTime() + threeMonths;
  if (!startIsWithinThreeMonths) {
    message.push("The start date should be within three months of today");
  }

  const startIsNotBeforeCreation = start.getTime() >= creation;
  if (!startIsNotBeforeCreation) {
    message.push("The start date should be after the current time.");
  }

  const auctionLengthIsAtLeastADay = start.getTime() + day < finish.getTime();
  if (!auctionLengthIsAtLeastADay) {
    message.push(
      "You must make sure you auction is live for more than 24 hours to allow bidders to participate."
    );
  }

  const finishTimeIsWithinAYear = finish.getTime() < start.getTime() + year;
  if (!finishTimeIsWithinAYear) {
    message.push("The auction should be over within a year.");
  }

  return {
    isValid: message.length < 1,
    message,
  };
};

export default CreateListing;
