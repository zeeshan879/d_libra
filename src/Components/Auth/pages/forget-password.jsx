import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Stylesheet/stylesheet.css";
import {
  forgetPassword,
  sendVerificationCode,
} from "../../../Redux/Actions/auth.action";
import UpdatePassword from "./update-password";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);

  const [code, setCode] = useState(new Array(4).fill(""));
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [status, setStatus] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [changePasswordForm, setChangePasswordForm] = useState(false);

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleCodeChange = (element, index) => {
    if (isNaN(element.value)) return false;
    // console.log(element.value);
    setCode([...code?.map((d, i) => (i === index ? element.value : d))]);

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // ['2', '4', '6', '8']

  let OTPCode = code?.toString()?.replaceAll(",", "");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    const response = await dispatch(forgetPassword(email, OTPCode, token));
    setValidation(true);
    setMessage(response?.message);
    setStatus(response?.status);
    console.log("response", response);

    if (response?.status === true) {
      setMessage("Code verified successfully");
      setIsVerifying(false);

      const timer = setTimeout(() => {
        setMessage("");
        setChangePasswordForm(true);
      }, 5000);
      setIsVerifying(false);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setValidation(false);
      setMessage("");
      if (response?.message === "Code is expire") {
        setShowCodeInput(false);
      }
    }, 5000);
    setIsVerifying(false);

    return () => clearTimeout(timer);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email) {
      setMessage("Email is required");
      setValidation(true);
      const timer = setTimeout(() => {
        setValidation(false);
        setMessage("");
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Email is not valid");
      setValidation(true);
      const timer = setTimeout(() => {
        setValidation(false);
        setMessage("");
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    const response = await dispatch(sendVerificationCode(email, token));
    console.log(response);

    if (response?.message === "Please Check Your Email") {
      setShowCodeInput(true);
      setValidation(true);
      setMessage(response?.message);
    }
    if (response?.message === "Email Doesnot Exist") {
      setValidation(true);
      setMessage(response?.message);
    }

    const timer = setTimeout(() => {
      setValidation(false);
      setMessage("");
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="back_button"
        style={{ color: `${theme ? " #363636" : "  #C8C8C8"}` }}
      >
        <ArrowBack className="backbutton_icon" />
        <span className="backbutton_text">Back</span>
      </button>
      {changePasswordForm ? (
        <UpdatePassword email={email} />
      ) : (
        <div className="editormainpage_root_contianer forgetPassword">
          <div
            className="editormainpage_container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "130px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                textDecoration: "center",
                padding: "20px",
              }}
            >
              <h1>Forget Your Passowrd?</h1>
              {showCodeInput ? (
                <h5>
                  Do not worry. We are here to help you. Please enter the <br />{" "}
                  code to get verified.
                </h5>
              ) : (
                <h5>
                  Do not worry. We are here to help you. Please enter your{" "}
                  <br /> registered email to get verification code
                </h5>
              )}
            </div>
            {validation ? (
              message === "Invalid Code" ? (
                <div className="errorMessage">{message}</div>
              ) : message === "Please Check Your Email" ? (
                <div className={theme ? "successMessage" : "successMessageTwo"}>
                  An email with verification code has been sent to
                  <h4 style={{ color: theme ? "blue" : "yellow" }}>{email}</h4>
                </div>
              ) : message === "Code is expire" ? (
                <div className="errorMessage">{message}</div>
              ) : message === "Email is required" ? (
                <div className="errorMessage">
                  Email is required to get verification code
                </div>
              ) : message === "Email is not valid" ? (
                <div className="errorMessage">
                  Please enter an valid email address
                </div>
              ) : message === "Email Doesnot Exist" ? (
                <div className="errorMessage">
                  Please enter your registered email
                </div>
              ) : message === "Code verified successfully" ? (
                <div className={theme ? "successMessage" : "successMessageTwo"}>
                  Code verified successfully. Wait you are redirecting...
                </div>
              ) : null
            ) : null}
            {showCodeInput ? (
              <>
                <input
                  className={
                    theme ? "addcategory_input_sub" : "addcategory_input"
                  }
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  value={email}
                />
                <div style={{ display: "flex", gap: "13px" }}>
                  {code?.map((item, index) => {
                    return (
                      <input
                        className={
                          theme
                            ? "addcategory_input_sub_Otp"
                            : "addcategory_input_Otp"
                        }
                        // type="number"
                        // placeholder="Verification Code"
                        value={item}
                        key={index}
                        maxLength={1}
                        onChange={(e) => handleCodeChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <input
                className={
                  theme ? "addcategory_input_sub" : "addcategory_input"
                }
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </div>

          <>
            {showCodeInput ? (
              isVerifying ? (
                <Button className="update_button">Verifying...</Button>
              ) : (
                <Button className="update_button" onClick={handleVerifyCode}>
                  Verify
                </Button>
              )
            ) : isLoading ? (
              <Box
                className="loginbuttontext"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CircularProgress color="inherit" size={30} />
              </Box>
            ) : (
              <Button className="update_button" onClick={handleSendCode}>
                Send Code
              </Button>
            )}
          </>
        </div>
      )}

      <div
        className="footer_copyright editor_mainPage_footer"
        style={{ color: theme ? " #000000" : " #C8C8C8 " }}
      >
        <span style={{ fontSize: "12px" }}>
          &copy; D-Libra All Rights Reserved
        </span>
      </div>
    </>
  );
};

export default ForgetPassword;
