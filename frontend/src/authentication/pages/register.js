import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import LoginCard from "../components/LoginCard";
import LoginPageContainer from "../components/LoginPageContainer";
import { useAuth } from "../../shared/contexts/AuthContext";

const Register = () => {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();

  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.current.value !== passwordConfirm.current.value) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await signup(email.current.value, password.current.value);
    } catch (error) {
      console.log(error);
      setError("Could not create user");
    }
    setLoading(false);
  };

  return (
    <LoginPageContainer>
      <LoginCard title="Register" onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" ref={name} />
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" ref={email} />
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" ref={password} />
        <Form.Label>Re-type password</Form.Label>
        <Form.Control type="password" ref={passwordConfirm} />
        <Button variant="primary" type="submit" disabled={loading}>
          Register
        </Button>
        <Button variant="outline-secondary" type="button">
          Already have an account? Log in
        </Button>
      </LoginCard>
    </LoginPageContainer>
  );
};

export default Register;
