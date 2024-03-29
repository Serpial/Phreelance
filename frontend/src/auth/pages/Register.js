import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { useAuth } from "../../shared/contexts/AuthContext";
import LoginCard from "../components/LoginCard";

/**
 * Allows the user to register while logging
 * them in.
 *
 * @returns Register page
 */
const Register = () => {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();

  const passwordPopover = (
    <Popover id="popover-basic">
      <Popover.Body>
        Make sure you password is greater than 6 characters long.
      </Popover.Body>
    </Popover>
  );

  const navigate = useNavigate();

  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    if (password.current.value !== passwordConfirm.current.value) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    register(
      name.current.value.trim(),
      email.current.value,
      password.current.value
    )
      .then((_res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  return (
    <LoginCard title="Register" onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Label>Name</Form.Label>
      <Form.Control
        name="display-name"
        type="text"
        ref={name}
        placeholder="You or your company's name."
        required
        minLength={6}
      />
      <Form.Label>Email</Form.Label>
      <Form.Control
        name="email"
        type="email"
        ref={email}
        placeholder="john@doe.com"
        required
      />
      <Form.Label>Password</Form.Label>
      <OverlayTrigger
        trigger="focus"
        placement="auto"
        overlay={passwordPopover}
      >
        <Form.Control
          name="password"
          type="password"
          ref={password}
          required
          minLength={6}
        />
      </OverlayTrigger>
      <Form.Label>Re-type password</Form.Label>
      <Form.Control
        name="password-confirm"
        type="password"
        ref={passwordConfirm}
        required
      />
      <Button
        as="input"
        className="register_register-button"
        variant="primary"
        type="submit"
        value="Register"
        disabled={isLoading}
      />
      <Button
        as="input"
        className="register_to-login-button"
        variant="outline-secondary"
        type="button"
        value="Already have an account? Log in"
        onClick={() => navigate("/login")}
      />
    </LoginCard>
  );
};

export default Register;
