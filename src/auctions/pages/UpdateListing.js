import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CurrencyInput from "react-currency-input-field";

import { useAuth } from "../../shared/contexts/AuthContext";
import DateIsWithinRange from "../util/DateIsWithinRange";
import BasicCard from "../../shared/components/BasicCard";
import ModalCard from "../../shared/components/ModalCard";
import DateTimeInput from "../components/DateTimeInput";
import AuctionTypes from "../res/AuctionTypes.json";
import LoadingWheel from "../../shared/components/LoadingWheel";

const AUCTION_DEFINITIONS = AuctionTypes.types;

const UpdateListing = () => {
  const [auction, setAuction] = useState();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateWarnings, setDateWarnings] = useState();
  const [showPriceWarning, setShowPriceWarning] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const description = useRef();
  const reservePrice = useRef();
  const startingPrice = useRef();
  const currentAuctionType = useRef();

  const { auctionID } = useParams();
  const { appUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;

    Axios.get(`/api/auctions/${auctionID}`)
      .then((res) => {
        if (cancel) return;

        const auctionResponse = res.data?.auction;
        if (
          appUser.id !== auctionResponse.creator ||
          new Date().getTime() > new Date(auctionResponse.finishing).getTime()
        ) {
          navigate("/auction/" + auctionID, { replace: false });
        }
        currentAuctionType.current = AUCTION_DEFINITIONS.find(
          (a) => a.shortName === auctionResponse?.auctionType
        );

        setStartDate(new Date(auctionResponse.starting));
        setEndDate(new Date(auctionResponse.finishing));
        setAuction(auctionResponse);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (cancel = true);
  }, [appUser, auctionID, navigate]);

  const applyDateWarning = ({ newStartDate, newEndDate }) => {
    const validateDate = DateIsWithinRange(
      new Date(auction.created),
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
    const sPrice = startingPrice.current?.value.slice(1);
    const rPrice = reservePrice.current?.value.slice(1);

    if (sPrice && rPrice && parseFloat(sPrice) <= parseFloat(rPrice)) {
      setShowPriceWarning(true);
      return;
    }
    setShowPriceWarning(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (dateWarnings && dateWarnings.length > 1) return;
    const isPublic = event.nativeEvent.submitter.name === "publish";

    if (isPublic) {
      setShowConfirmModal(true);
      return;
    }

    publish({ isPublic });
  };

  const publish = ({ isPublic }) => {
    setShowConfirmModal(false);
    setLoading(true);
    const updatedAuction = {
      description: description.current.value,
      finishing: endDate.toUTCString(),
    };

    if (auction.auctionType === "DUT" && !auction.isPublic) {
      updatedAuction["startingPrice"] = parseFloat(
        startingPrice.current.value.slice(1)
      );
    }

    if (!auction.isPublic) {
      updatedAuction["reservePrice"] = parseFloat(
        reservePrice.current.value.slice(1)
      );

      if (startDate.getTime() > new Date().getTime()) {
        updatedAuction["starting"] = startDate.toUTCString();
      }
    }

    if (isPublic) {
      updatedAuction["isPublic"] = isPublic;
    }

    Axios.patch(`/api/auctions/${auctionID}`, updatedAuction)
      .then((_res) => {
        navigate("/auction/" + auctionID);
      })
  };

  const creationTooltip = (props) => (
    <Tooltip {...props}>
      Cannot change once you have created the auction.
    </Tooltip>
  );

  const publicTooltip = (props) => (
    <Tooltip {...props}>
      Cannot change once you have made the auction public.
    </Tooltip>
  );

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
      {loading ? (
        <LoadingWheel />
      ) : (
        <Container as="form" onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <BasicCard>
                <Card.Title>About</Card.Title>
                <Card.Body>
                  <Form.Label>Title</Form.Label>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={creationTooltip}
                  >
                    <Form.Control
                      type="text"
                      readOnly
                      defaultValue={auction.title}
                    />
                  </OverlayTrigger>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    minLength={10}
                    required
                    ref={description}
                    defaultValue={auction.description}
                    placeholder="Please describe the contract..."
                  />
                  {dateWarnings && (
                    <Alert className="create-listing_alert" variant="danger">
                      {dateWarnings}
                    </Alert>
                  )}
                  <Form.Label>Start time</Form.Label>
                  <DateTimeInput
                    defaultDate={startDate}
                    disabled={
                      new Date().getTime() >
                      new Date(auction.starting).getTime()
                    }
                    onChange={(date) => {
                      setStartDate(date);
                      applyDateWarning({ newStartDate: date });
                    }}
                  />
                  <Form.Label>Finish time</Form.Label>
                  <DateTimeInput
                    defaultDate={endDate}
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
                <Card.Body>
                  <Form.Label>Reserve Price</Form.Label>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={auction.isPublic ? publicTooltip : null}
                  >
                    <CurrencyInput
                      className="form-control"
                      ref={reservePrice}
                      readOnly={auction.isPublic}
                      onChange={applyPriceWarning}
                      prefix="£"
                      defaultValue={auction.reservePrice}
                      decimalsLimit={2}
                      placeholder="£30.99"
                    />
                  </OverlayTrigger>
                  {auction.auctionType === "DUT" && (
                    <>
                      <Form.Label>Starting Price</Form.Label>
                      {showPriceWarning && (
                        <Alert variant="danger">
                          The starting price should be greater than the reserve
                          price.
                        </Alert>
                      )}
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={auction.isPublic ? publicTooltip : null}
                      >
                        <CurrencyInput
                          className="form-control"
                          readOnly={auction.isPublic}
                          ref={startingPrice}
                          onChange={applyPriceWarning}
                          prefix="£"
                          decimalsLimit={2}
                          defaultValue={auction.startingPrice}
                          placeholder="£30.99"
                        />
                      </OverlayTrigger>
                    </>
                  )}
                  <Form.Label>Auction Type</Form.Label>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={creationTooltip}
                  >
                    <Form.Select disabled>
                      <option key={currentAuctionType.current?.shortName ?? ""}>
                        {currentAuctionType.current?.fullName ?? ""}
                      </option>
                    </Form.Select>
                  </OverlayTrigger>
                  <Alert className="create-listing_alert" variant="dark">
                    {currentAuctionType.current?.description ?? ""}
                  </Alert>
                </Card.Body>
              </BasicCard>
              <BasicCard>
                <Card.Body>
                  {!auction.isPublic && (
                    <Button
                      as="input"
                      className="create-listing_submit-button"
                      type="submit"
                      value="Save as draft"
                      name="draft"
                      variant="secondary"
                    />
                  )}
                  <Button
                    as="input"
                    className="create-listing_submit-button"
                    type="submit"
                    value="Publish"
                    name="publish"
                    variant="primary"
                  />
                </Card.Body>
              </BasicCard>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default UpdateListing;
