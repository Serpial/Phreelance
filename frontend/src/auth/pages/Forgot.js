import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../shared/contexts/AuthContext";
import LoginCard from "../components/LoginCard";

/**
 * Components set up to allow the user to reset
 * their password.
 *
 * @returns Forgot page
 */
const Forgot = () => {
  const email = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { resetPassword } = useAuth();
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsLoading(true);

    resetPassword(email.current.value)
      .then((_res) => {
        setIsLoading(false);
        setMessage(
          "Check your inbox for instructions on updating your password."
        );
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Issue found resetting password.");
      });
  };

  return (
    <LoginCard title="Password Reset" onSubmit={handleSubmit}>
      {message && <Alert variant="danger">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Control
        type="email"
        className="forgot_email-input"
        ref={email}
        placeholder="john@doe.com"
        required
      />
      <Button
        as="input"
        className="forgot_submit-button"
        variant="primary"
        type="submit"
        value="Send reset request"
        disabled={isLoading}
      />
      <Button
        as="input"
        className="forgot_back-button"
        variant="outline-secondary"
        type="submit"
        value="Return to login"
        onClick={() => navigate("/login")}
      />
    </LoginCard>
  );
};

export default Forgot;
