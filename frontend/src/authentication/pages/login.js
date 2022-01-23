import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import LoginCard from "../components/LoginCard";
import { useAuth } from "../../shared/contexts/AuthContext";

const Login = () => {
  const email = useRef();
  const password = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setIsLoading(true);
      await login(email.current.value, password.current.value);
      setIsLoading(false);
      navigate("/auctions");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      <LoginCard title="Login" onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Control
          type="email"
          placeholder="Email address"
          ref={email}
          required
        />
        <Form.Control
          type="password"
          placeholder="Password"
          ref={password}
          required
        />
        <Button
          as="input"
          variant="primary"
          type="submit"
          value="Submit"
          disabled={isLoading}
        />
        <Button
          as="input"
          variant="outline-secondary"
          type="button"
          value={"Forgot password?"}
          onClick={() => navigate("/password-reset")}
        />
      </LoginCard>
      <LoginCard>
        <Button
          as="input"
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
