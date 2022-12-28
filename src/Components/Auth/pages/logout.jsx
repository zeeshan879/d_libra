import React from "react";
import { Button, Typography } from "@material-ui/core";
import { ArrowBack } from "@mui/icons-material";
import { useSelector } from "react-redux";
import "../Stylesheet/stylesheet.css";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.state);

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="back_button"
        style={{ color: `${theme ? " #363636" : "  #C8C8C8"}` }}
      >
        <ArrowBack className="backbutton_icon" />{" "}
        <span className="backbutton_text">Back</span>
      </button>
      <div className="logoutmaincontainer forgetPassword">
        <div className="loginwithgooglecontainer">
          <Typography className={theme ? "logoutTextdark" : " logoutText"}>
            You've successfully logged out.
          </Typography>
        </div>
        <div className="logoutcontainer">
          <div className="continuewithoutlogincontainer">
            <Button className="buttons" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button
              style={{ marginTop: "30px" }}
              className="buttons"
              onClick={() => navigate("/")}
            >
              Continue without login
            </Button>
          </div>
        </div>
        <div
          className="footer_copyright editor_mainPage_footer"
          style={{ color: theme ? " #000000" : " #C8C8C8 " }}
        >
          <span style={{ fontSize: "12px" }}>
            &copy; D-Libra All Rights Reserved
          </span>
        </div>
      </div>
    </>
  );
};

export default Logout;
