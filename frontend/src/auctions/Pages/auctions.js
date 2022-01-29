import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/row";

import FilterCard from "../components/FilterCard";
import BasicCard from "../../shared/components/BasicCard";

import "./Auction.css";

const Auctions = () => {
  return (
    <Container fluid="sm">
      <Row xs={1} md={2} >
        <Col md={4}>
          <Row>
            <FilterCard />
          </Row>
        </Col>
        <Col md={7} lg={8}>
          <Row>
            <BasicCard>asdf</BasicCard>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Auctions;
