import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import "./LoginCard.css";

/**
 * Basic template for a logic card to be used by
 * main components on the login and register
 * pages.
 *
 * @param {String} title
 * Title of the page
 *
 * @param {JSX.Element} children
 * Children element(s)
 *
 * @param {Function} onSubmit
 * Callback function for when the form contained
 * is submitted.
 *
 * @returns Basic login card.
 */
const LoginCard = ({ title, children, onSubmit }) => {
  return (
    <Card className="login-card">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Form className="login-form" onSubmit={onSubmit}>
          {children}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginCard;
