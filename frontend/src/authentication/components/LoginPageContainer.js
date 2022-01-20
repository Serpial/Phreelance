import React from "react";

import logo from "../../shared/res/logo.svg"

import "./LoginPageContainer.css";

const LoginPageContainer = (props) => {
  return (
    <main className="login">
      <div className="logo-container">
        <img className="logo" src={logo} alt="Phreelance in lowercase text" />
      </div>
      <div className="login-container">{props.children}</div>
    </main>
  );
};

export default LoginPageContainer;
