import React, { useEffect, useState } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import CurrencyInput from "react-currency-input-field";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ModalCard from "../../shared/components/ModalCard";
import ToDisplayValue from "../util/ToDisplayValue";

import "./BiddingModal.css";

/**
 * Bidding modal that is sharing the reponsibility of creating and adjusting
 * the user's bid.
 *
 * @param {Object} currentUser
 * Current user object that allows us to obtain the correct bid.
 *
 * @param {Object} currentAuction
 * Current auction object that allows us to manage the correct bid.
 *
 * @param {Function} onClose
 * Callback method that allows us to close the modal.
 *
 * @param {Function} onBidSubmit
 * Callback method for action to be taken when a bid is submitted.
 *
 * @param {Bool} show
 * Whether or not the modal is currently being displayed.
 *
 * @param {io} socket
 * Socket for current auction
 *
 * @param {Object} topBid
 * Object containing the current top bid.
 *
 * @param {Object} props
 * Some additional props are neccessary for the Modal Card.
 *
 * @returns BiddingModal
 */
const BiddingModal = ({
  currentUser,
  currentAuction,
  onClose,
  onBidSubmit,
  show,
  socket,
  topBid,
  ...props
}) => {
  const [alertDescription, setAlertDescription] = useState();
  const [bidValue, setBidValue] = useState();
  const [proposal, setProposal] = useState();
  const [timeEstimate, setTimeEstimate] = useState();
  const [timeEstimateBase, setTimeEstimateBase] = useState("days");
  const [oldBid, setOldBid] = useState();

  useEffect(() => {
    let cancel = false;

    if (!currentAuction && !show) return;
    Axios.get(`/api/bids/auction/${currentAuction.meaningfulId}`)
      .then((res) => {
        if (cancel) return;
        const bids = res.data.bids;
        const bidRes = bids.find((b) => b.creator === currentUser.id);

        if (!bidRes) return;
        setOldBid(bidRes);

        setBidValue(bidRes.value);
        setTimeEstimate(parseInt(bidRes.timeEstimation.split(" ")[0]));
        setTimeEstimateBase(bidRes.timeEstimation.split(" ")[1]);
        setProposal(bidRes.description);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (cancel = true);
  }, [currentUser, currentAuction, show]);

  const onSubmit = (e) => {
    e.preventDefault();

    let tempAlertDescription;
    if (
      topBid?.value &&
      bidValue >= topBid?.value &&
      topBid?.creator !== currentUser?.id
    ) {
      tempAlertDescription = (
        <span key="tooMuch">Your bid is higher than the current value.</span>
      );
    } else if (
      !topBid &&
      currentAuction.auctionType === "DUT" &&
      bidValue >= currentAuction.startingPrice
    ) {
      tempAlertDescription = (
        <span key="biggerStarting">
          Your bid is higher than the starting price.
        </span>
      );
    }

    if (tempAlertDescription) {
      setAlertDescription(tempAlertDescription);
      return;
    }

    const newBid = {
      description: proposal,
      value: bidValue,
      timeEstimation: timeEstimate + " " + timeEstimateBase,
    };
    if (oldBid) {
      Axios.patch(`/api/bids/${oldBid.id}`, newBid).then(() => {
        socket.emit("posting-bid", { auctionId: currentAuction.meaningfulId });
        onBidSubmit();
      });
    } else {
      Axios.post(
        `/api/bids/create/${currentAuction.meaningfulId}/${currentUser.id}`,
        newBid
      ).then(() => {
        socket.emit("posting-bid", { auctionId: currentAuction.meaningfulId });
        onBidSubmit();
      });
    }
  };

  const topBidderTooltip = (propss) => (
    <Tooltip {...propss}>You are already the winning bidder.</Tooltip>
  );

  return (
    <ModalCard
      className="bidding-modal"
      title={`${oldBid ? "Adjust" : "Create"} bid`}
      show={show}
      {...props}
    >
      <div>
        <span className="bidding-modal_current-price_afore">Winning bid: </span>
        <span className="bidding-modal_current-price_value">
          {topBid?.value ? ToDisplayValue(topBid.value) : "No bids"}
        </span>
      </div>
      {alertDescription && (
        <Alert className="bidding-modal_alerts" variant="danger">
          {alertDescription}
        </Alert>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Label>Bid:</Form.Label>
        <span className="bidding-modal_value-entry">
          {topBid?.creator === currentUser?.id && (
            <FontAwesomeIcon
              icon={faLock}
              className="bidding-modal_value-entry_padlock"
            />
          )}
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={
              topBid?.creator === currentUser?.id ? topBidderTooltip : <></>
            }
          >
            <CurrencyInput
              className="form-control"
              required
              prefix="£"
              onValueChange={(v) => setBidValue(v)}
              value={bidValue}
              decimalsLimit={2}
              placeholder="£30.99"
              disabled={topBid?.creator === currentUser?.id}
              allowNegativeValue={false}
            />
          </OverlayTrigger>
        </span>
        <Form.Label>Estimated completion time:</Form.Label>
        <Container>
          <Row>
            <Col>
              <Form.Control
                required
                as="input"
                type="number"
                defaultValue={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                min={1}
                max={300}
              />
            </Col>
            <Col>
              <Form.Select
                value={timeEstimateBase}
                onChange={(e) => setTimeEstimateBase(e.target.value)}
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
              </Form.Select>
            </Col>
          </Row>
        </Container>
        <Form.Label>Proposal:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          minLength={10}
          required
          defaultValue={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Please describe your plan for the contract..."
        />
        <div className="bidding-modal_button-container">
          <Button
            className="bidding-modal_button"
            as="input"
            type="button"
            value="Cancel"
            variant="outline-primary"
            onClick={onClose}
          />
          <Button
            className="bidding-modal_button"
            as="input"
            type="submit"
            value="Publish"
            variant="danger"
          />
        </div>
      </Form>
    </ModalCard>
  );
};

export default BiddingModal;
