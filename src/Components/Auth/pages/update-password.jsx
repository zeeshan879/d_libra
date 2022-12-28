import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Stylesheet/stylesheet.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { resetPassword } from "../../../Redux/Actions/auth.action";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const UpdatePassword = ({ email }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await dispatch(resetPassword(email, password, token));
    console.log("response", response);
    setMessage(response?.message);
    if (response?.status === true) {
      navigate("/login");
    }
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timer);
  };

  const hanldeShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="editormainpage_root_contianer">
        <div
          style={{
            textAlign: "center",
            textDecoration: "center",
            padding: "20px",
          }}
        >
          <h1>Verified Successfully </h1>
          <h4>
            You are successfully verified. Please enter <br />
            the new password
          </h4>
        </div>
        <div className="editormainpage_container">
          {message === "All Fields are Required" ? (
            <div className="errorMessage">Kindly provide new password.</div>
          ) : message === "Password must be 8 or less than 20 characters" ? (
            <div className="errorMessage">
              Password must be 8 or less than 20 characters.
            </div>
          ) : null}
          <input
            className={theme ? "addcategory_input_sub" : "addcategory_input"}
            type="email"
            placeholder="Email"
            value={email}
          />
          <div style={{ display: "flex", position: "relative" }}>
            <input
              className={theme ? "addcategory_input_sub" : "addcategory_input"}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <VisibilityOutlinedIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "13px",
                  cursor: "pointer",
                }}
                onClick={hanldeShowPassword}
              />
            ) : (
              <VisibilityOffOutlinedIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "13px",
                  cursor: "pointer",
                }}
                onClick={hanldeShowPassword}
              />
            )}
          </div>
        </div>

        {isLoading ? (
          <Box
            className="loginbuttontext"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <CircularProgress color="inherit" size={30} />
          </Box>
        ) : (
          <Button className="update_button" onClick={handleResetPassword}>
            Reset Password
          </Button>
        )}
      </div>
    </>
  );
};

export default UpdatePassword;
