import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../shared/contexts/AuthContext";
import LoginCard from "../components/LoginCard";

const Forgot = () => {
  const email = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { resetPassword } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");
      setIsLoading(true);
      await resetPassword(email.current.value);
      setIsLoading(false);
      setMessage(
        "Check your inbox for instructions on updating your password."
      );
    } catch (err) {
      setIsLoading(false);
      setError("Issue found resetting password.");
    }
  };

  return (
    <LoginCard title="Password Reset" onSubmit={handleSubmit}>
      {message && <Alert variant="danger">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Control
        type="email"
        ref={email}
        placeholder="john@doe.com"
        required
      />
      <Button
        as="input"
        variant="primary"
        type="submit"
        value="Send reset request"
        disabled={isLoading}
      />
      <Button
        as="input"
        variant="outline-secondary"
        type="submit"
        value="Return to login"
        onClick={() => navigate("/login")}
      />
    </LoginCard>
  );
};

export default Forgot;
