import React, { useEffect, useRef, useState } from "react";
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
 * @param {Object} props
 * Some additional props are neccessary for the Modal Card.
 *
 * @returns BiddingModal
 */
const BiddingModal = ({ currentUser, currentAuction, onCancel, ...props }) => {
  const bid = useRef();
  const proposal = useRef();

  const [currentBid, setCurrentBid] = useState();
  useEffect(() => {
    let cancel = false;

    if (!currentAuction) return;
    Axios.get(`/api/bids/auction/${currentAuction.meaningfulId}`)
      .then((res) => {
        if (cancel) return;
        const bids = res.data.bids;
        setCurrentBid(bids.find((b) => b.creator === currentUser));
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (cancel = true);
  }, [currentUser, currentAuction]);

  const onSubmit = () => {};

  return (
    <ModalCard
      className="bidding-modal"
      title={`${currentBid ? "Adjust" : "Create"} bid`}
      {...props}
    >
      <Form onSubmit={onSubmit}>
        <Form.Label>Bid:</Form.Label>
        <CurrencyInput
          className="form-control"
          ref={bid}
          required
          prefix="£"
          onChange={() => {}}
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
                min={0}
                max={300}
              />
            </Col>
            <Col>
              <Form.Select ref={}>
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
          ref={proposal}
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
