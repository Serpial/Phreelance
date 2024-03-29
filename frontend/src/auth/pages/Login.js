import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import LoginCard from "../components/LoginCard";
import { useAuth } from "../../shared/contexts/AuthContext";

/**
 * Page that allows the user to login to the
 * application.
 *
 * @returns Login page
 */
const Login = () => {
  const email = useRef();
  const password = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    login(email.current.value, password.current.value)
      .then((_res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  return (
    <>
      <LoginCard title="Login" onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Control
          type="email"
          name="email"
          placeholder="Email address"
          ref={email}
          required
        />
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          ref={password}
          required
        />
        <Button
          as="input"
          className="login_submit-button"
          variant="primary"
          type="submit"
          value="Submit"
          disabled={isLoading}
        />
        <Button
          as="input"
          className="login_forgot-button"
          variant="outline-secondary"
          type="button"
          value={"Forgot password?"}
          onClick={() => navigate("/password-reset")}
        />
      </LoginCard>
      <LoginCard>
        <Button
          as="input"
          className="login_register-button"
          variant="primary"
          type="button"
          value="Register"
          onClick={() => navigate("/register")}
        />
      </LoginCard>
    </>
  );
};

export default Login;
