import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import LoginCard from "../components/LoginCard";

const Login = () => {
  return (
    <>
      <LoginCard title="Login">
        <Form.Control type="email" placeholder="Email address" />
        <Form.Control type="password" placeholder="Password" />
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="outline-secondary" type="button">
          Forgot password?
        </Button>
      </LoginCard>
      <LoginCard>
        <Button variant="primary" type="button">
          Register
        </Button>
      </LoginCard>
    </>
  );
};

export default Login;
