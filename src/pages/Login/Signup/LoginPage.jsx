import React, { useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import MyCheckbox from "../../../helperFunctions/checkbox";

const LoginPage = ({ content }) => {
  const { heading, page, alternate } = content;
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here
  };

  return (
    <div className="login-page">
      <div className="logo-section">
        <img src={require("../../../Assets/LogoHalf.png")} alt="Logo" />
        <img
          src={require("../../../Assets/DeepreadText.png")}
          style={{ width: "450px" }}
        />

        <h2>Leverage your reading</h2>
      </div>
      <div className="login-form-section">
        <div className="login-form">
          <div className="container-login">
            <span className="Sub-heading">{heading}</span>
            <span className="xtra-small">
              <Link to={`${page === "signUp" ? "/login" : "/register"}`}>
                {alternate}
              </Link>{" "}
              instead
            </span>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="form-inputs">
                <label htmlFor="email">
                  {" "}
                  <span className="bold">Email</span>
                  {page !== "signUp" && (
                    <span className="bold"> or Username</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  required
                />
                {page === "signUp" && (
                  <>
                    <label>
                      <span className="bold">Username</span>
                    </label>
                    <input type="text" placeholder="Enter username" required />
                  </>
                )}

                <label
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span className="bold">Password</span>{" "}
                  <span
                    className="xtra-small cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "hide" : "show"}
                  </span>{" "}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-footer">
                <div className="stay-signed-in">
                  <MyCheckbox label="Stay signed in" />{" "}
                  <p className="forgot-password xtra-small">
                    <a href="/ForgotPassword">Forgot your Password ? </a>
                  </p>
                </div>

                <button type="submit">
                  {" "}
                  <strong>{heading}</strong>{" "}
                </button>
                <p
                  className="small-text"
                  style={{ color: "var(--fontColor)", fontSize: "14px" }}
                >
                  <span>By continuing, you agree to DeepRead’s </span>
                  <a href="https://app.websitepolicies.com/policies/view/AhYljQDq">
                    Conditions of Use
                  </a>{" "}
                  and{" "}
                  <a href="https://www.freeprivacypolicy.com/live/0d4d6979-267f-4f0e-9806-b2901ea39f65">
                    Privacy Notice
                  </a>
                  .
                </p>
              </div>
            </form>
            <div
              style={{ marginTop: page !== "signUp" ? "80px" : "25px" }}
              className="form-buttons"
            >
              <button className="create-account-button">
                <strong>Go to Demo App</strong> (no Sign in required)
              </button>

              <div className="login-seperator">
                <hr />
                <span style={{ margin: "0 10px" }}> or </span>
                <hr />
              </div>

              <div className="third-party-login">
                <button className="google-login-button">
                  <img
                    className="button-icon"
                    src={require("../../../Assets/google logo.jpg")}
                    alt="Google Icon"
                  />
                  <strong>Sign in with Google </strong>
                </button>
                <button className="amazon-login-button">
                  <img
                    className="button-icon"
                    src={require("../../../Assets/amazon logo.jpg")}
                    alt="Amazon Icon"
                  />
                  <strong>Sign in with Amazon</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
