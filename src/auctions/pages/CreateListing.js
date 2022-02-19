import React, { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CurrencyInput from "react-currency-input-field";

import DateTimeInput from "../components/DateTimeInput";
import { useAuth } from "../../shared/contexts/AuthContext";

import "./CreateListing.css";

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

  const authId = useAuth()?.activeUser;
  const [warning, setWarning] = useState();

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

  const [startDate, setStartDate] = useState();
  const [finishDate, setFinishDate] = useState();
  const [useCustomStartTime, setUseCustomStartTime] = useState(false);
  const handleSubmit = (event, options) => {
    event.preventDefault();
    const isPublic = options?.isDraft;
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
              <Form.Control
                type="text"
                ref={title}
                placeholder="My new contract"
              />
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                ref={description}
                placeholder="Please describe the contract..."
              />
              <Form.Label>Start time</Form.Label>
              <Form.Check
                checked={useCustomStartTime}
                onChange={(e) => {
                  setUseCustomStartTime(!useCustomStartTime);
                }}
                label="Delay the start-time of your auction"
              />
              <DateTimeInput
                onChange={setStartDate}
                disabled={!useCustomStartTime}
              />
              <Form.Label>Finish time</Form.Label>
              <DateTimeInput onChange={setFinishDate} />
            </Form.Group>
            <Form.Group>
              <h2>Pricing</h2>
              <Form.Label>Reserve Price</Form.Label>
              <CurrencyInput
                className="form-control"
                ref={reservePrice}
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
            </Form.Group>
            <ButtonGroup
              className="create-listing_submit-group"
              aria-label="Submit or save as draft"
            >
              <Button
                className="create-listing_submit-button"
                type="submit"
                variant="secondary"
                onClick={(e) => handleSubmit(e, { isDraft: true })}
              >
                Save as draft
              </Button>
              <Button
                className="create-listing_submit-button"
                type="submit"
                variant="primary"
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </Button>
            </ButtonGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateListing;
