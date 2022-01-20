import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import LoginCard from "../components/LoginCard";
import LoginPageContainer from "../components/LoginPageContainer";

const Forgot = () => {
  return (
    <LoginPageContainer>
      <LoginCard title="Forgot your password?">
        <Form.Control type="email" placeholder="Email address" />
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="outline-secondary" type="button">
          Return to login
        </Button>
      </LoginCard>
    </LoginPageContainer>
  );
};

export default Forgot;
