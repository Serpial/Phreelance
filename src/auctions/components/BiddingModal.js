import React, { useEffect, useState } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import CurrencyInput from "react-currency-input-field";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import ModalCard from "../../shared/components/ModalCard";

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
 * @param {Function} onCancel
 * Callback method that allows us to close the modal.
 *
 * @param {Bool} show
 * Whether or not the modal is currently being displayed.
 *
 * @param {io} socket
 * Socket for current auction
 *
 * @param {Object} props
 * Some additional props are neccessary for the Modal Card.
 *
 * @returns BiddingModal
 */
const BiddingModal = ({
  currentUser,
  currentAuction,
  onCancel,
  show,
  socket,
  ...props
}) => {
  const [bidValue, setBidValue] = useState();
  const [proposal, setProposal] = useState();
  const [timeEstimate, setTimeEstimate] = useState();
  const [timeEstimateBase, setTimeEstimateBase] = useState();

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

    const newBid = {
      description: proposal,
      value: bidValue,
      timeEstimation: timeEstimate + " " + timeEstimateBase,
    };

    socket.emit("posting-bid", { auctionId: currentAuction.meaningfulId });
    return;
    if (oldBid) {
      Axios.patch(`/api/bids/${oldBid.id}`, newBid);
    } else {
      Axios.post(
        `/api/bids/create/${currentAuction.meaningfulId}/${currentUser.id}`,
        newBid
      );
    }
  };
  return (
    <ModalCard
      className="bidding-modal"
      title={`${oldBid ? "Adjust" : "Create"} bid`}
      show={show}
      {...props}
    >
      <Form onSubmit={onSubmit}>
        <Form.Label>Bid:</Form.Label>
        <CurrencyInput
          className="form-control"
          required
          prefix="£"
          onValueChange={(v) => setBidValue(v)}
          value={bidValue}
          decimalsLimit={2}
          placeholder="£30.99"
        />
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
                min={0}
                max={300}
              />
            </Col>
            <Col>
              <Form.Select defaultValue={timeEstimateBase}>
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
            onClick={() => onCancel()}
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
