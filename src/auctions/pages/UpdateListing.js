import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useAuth } from "../../shared/contexts/AuthContext";
import BasicCard from "../../shared/components/BasicCard";

const BACKEND_HOST = process.env.REACT_APP_RUN_BACK_END_HOST;

const UpdateListing = () => {
  const description = useRef();

  const { auctionID } = useParams();
  const { activeUser } = useAuth();

  const [auction, setAuction] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let cancel = false;

    let userAppId;
    Axios.get(`${BACKEND_HOST}/api/users/auth/${activeUser.uid}`)
      .then((res) => {
        if (cancel) return;
        userAppId = res.data?.user.id;
        return Axios.get(`${BACKEND_HOST}/api/auctions/${auctionID}`);
      })
      .then((res) => {
        if (cancel) return;

        const auctionResponse = res.data?.auction;
        if (userAppId !== auctionResponse.creator) {
          navigate("/auction/" + auctionID, { replace: false });
        }
        setAuction(auctionResponse);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (cancel = true);
  }, [activeUser, auctionID, navigate]);

  return (
    <>
      {loading ? (
        <h3>Please wait...</h3>
      ) : (
        <Container>
          <Row>
            <Col md={8}>
              <BasicCard>
                <Card.Title>About</Card.Title>
                <Card.Body>
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" value={auction.title} readOnly />
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    minLength={10}
                    required
                    ref={description}
                    value={auction.description}
                    placeholder="Please describe the contract..."
                  />
                  {/* {dateWarnings && ( */}
                  <Alert className="create-listing_alert" variant="danger">
                    {/* {dateWarnings} */}
                  </Alert>
                  <Form.Label>Start time</Form.Label>
                  {/* <DateTimeInput
                    defaultDate={DEFAULT_START_DATE}
                    onChange={(date) => {
                      setStartDate(date);
                      applyDateWarning({ newStartDate: date });
                    }}
                    disabled={!useCustomStartTime}
                  /> */}
                  <Form.Label>Finish time</Form.Label>
                  {/* <DateTimeInput
                    defaultDate={new Date(auction)}
                    onChange={(date) => {
                      setEndDate(date);
                      applyDateWarning({ newEndDate: date });
                    }}
                  /> */}
                </Card.Body>
              </BasicCard>
            </Col>
            <Col md={4}>
              <BasicCard></BasicCard>
              <BasicCard></BasicCard>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default UpdateListing;
