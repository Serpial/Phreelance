import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/row";

import FilterCard from "../components/FilterCard";
import BasicCard from "../../shared/components/BasicCard";
import { useAuth } from "../../shared/contexts/AuthContext";

const Auctions = () => {
  const { activeUser } = useAuth();
  return (
    <Container fluid="sm">
      <Col>
        <FilterCard />
      </Col>
      <Col>
        <Row>
          <BasicCard>asdf</BasicCard>
        </Row>
      </Col>
    </Container>
  );
};

export default Auctions;
