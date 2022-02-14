import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import CurrencyInput from "react-currency-input-field";

import DateTimeInput from "../components/DateTimeInput";
import { useAuth } from "../../shared/contexts/AuthContext";

import "./CreateListing.css";

const AUCTION_DESCRIPTIONS = {
  "Scottish auction": "Scottish",
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

  const authId = useAuth()?.activeUser;
  const [warning, setWarning] = useState(null);
  useEffect(() => {});

  const getStartDateTime = (date) => {
    console.log(date);
  };
  const getFinishDateTime = (date) => {
    console.log(date);
  };

  const defaultAuctionType = Object.keys(AUCTION_DESCRIPTIONS)[0];
  const [auctionType, setAuctionType] = useState(defaultAuctionType);
  const defaultAuctionDescription = AUCTION_DESCRIPTIONS[auctionType];
  const [auctionTypeDescription, setAuctionTypeDescription] = useState(
    defaultAuctionDescription
  );
  const handleDropdownChange = (event) => {
    const newAuctionType = event.target.value;
    setAuctionType(newAuctionType);
    setAuctionTypeDescription(AUCTION_DESCRIPTIONS[newAuctionType]);
  };

  return (
    <Container>
      <Row>
        <Col>
          {warning && (
            <Alert className="create-listing_alert" variant="danger">
              {warning}
            </Alert>
          )}
          <Form>
            <Form.Group>
              <h2>About</h2>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="My new work job..." />
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Please describe the product..."
              />
              <Form.Label>Start time</Form.Label>
              <DateTimeInput
                handleDateTime={getStartDateTime}
              />
              <Form.Label>Finish time</Form.Label>
              <DateTimeInput
                handleDateTime={getFinishDateTime}
              />
            </Form.Group>
            <Form.Group>
              <h2>Pricing</h2>
              <Form.Label>Reserve Price</Form.Label>
              <CurrencyInput
                className="form-control"
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
                {auctionTypeDescription}
              </Alert>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateListing;
