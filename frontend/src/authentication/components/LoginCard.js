import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import "./LoginCard.css";

const LoginCard = (props) => {
  return (
    <Card className="login-card">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Form className="login-form" onSubmit={props.onSubmit}>{props.children}</Form>
      </Card.Body>
    </Card>
  );
};

export default LoginCard;
