import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import LoginCard from "../components/LoginCard";

const Forgot = () => {
  return (
    <>
      <LoginCard title="Forgot your password?">
        <Form.Control type="email" placeholder="Email address" />
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="outline-secondary" type="button">
          Return to login
        </Button>
      </LoginCard>
    </>
  );
};

export default Forgot;
