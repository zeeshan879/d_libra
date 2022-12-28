import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Popup_CloseArrow from "../../assests/SVG_Files/New folder/Popup_CloseArrow.svg";
import Popup_OpenArrow from "../../assests/SVG_Files/New folder/Popup_OpenArrow.svg";
import Rating from "../../assests/SVG_Files/Rating.svg";
import MyLibrary from "../../assests/SVG_Files/MyLibrary.svg";
import MyLibrary_off from "../../assests/SVG_Files/MyLibrary_off.svg";
import Rating_off from "../../assests/SVG_Files/Rating_off.svg";
import History from "../../assests/SVG_Files/History.svg";
import Share from "../../assests/SVG_Files/Share.svg";
import Icon_messages from "../../assests/SVG_Files/New folder/icons/Icon_messages.svg";
import Icon_facebook from "../../assests/SVG_Files/New folder/icons/Icon_facebook.svg";
import Icon_gmail from "../../assests/SVG_Files/New folder/icons/Icon_gmail.svg";
import Icon_telegram from "../../assests/SVG_Files/New folder/icons/Icon_telegram.svg";
import Icon_whatsapp from "../../assests/SVG_Files/New folder/icons/Icon_whatsapp.svg";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import History_off from "../../assests/SVG_Files/New folder/icons/Popup_History_off.svg";
import { viewCourseStatus } from "../../Redux/Actions/Client Side/course.action";
const drawerBleeding = 56;
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const FooterButtons = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const link = "https://api.libraa.ml";
  const name = "D_Libra";

  const [footerbutton, setFooterButton] = React.useState(false);
  const handleFotterButton = () => {
    setFooterButton(true);
    if (footerbutton === true) {
      setFooterButton(false);
    }
  };
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const [open, setOpen] = React.useState(false);
  const [mobileView, setMobileView] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  React.useEffect(() => {
    if (window.innerWidth > 425) {
      setMobileView(false);
    } else {
      setMobileView(true);
    }
  }, []);

  const handleWhatsApp = () => {
    // console.log("whatsapp");
    const url = `https://api.whatsapp.com/send?text=${window.location.href}`;
    window.open(url, "_blank");
  };

  const handleFacebook = () => {
    // console.log("facebook");
    const url = `https://www.facebook.com/sharer/sharer.php?u=${link}&quote=${name}&hashtag=Libra`;
    window.open(url, "_blank");
  };

  const handleMail = () => {
    // console.log("mail");
    const url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${name}&body=${link}`;
    window.open(url, "_blank");
  };

  const handleTelegram = () => {
    // console.log("telegram web");
    const url = `https://telegram.me/share/url?url=${link}&text=${link}`;
    window.open(url, "_blank");
  };

  const hanldeNavigateToHistory = () => {
    navigate("/recentlyviewed");
  };

  const hanldeRatingNavigate = () => {
    navigate("/ratingsidebar");
  };

  useEffect(() => {
    const recentViewedCourses = async () => {
      const response = await dispatch(viewCourseStatus(token, role));
      // console.log("response", response);
      setHistory(response);
    };
    recentViewedCourses();
  }, []);

  return (
    <>
      <div>
        <div
          className={
            role === "normaluser"
              ? "footer_buttons_container_user"
              : "footer_buttons_container"
          }
        >
          {history?.length > 0 ? (
            <>
              <img
                src={History}
                alt=""
                className="footerbuttonimages"
                onClick={hanldeNavigateToHistory}
              />
              <img
                src={MyLibrary}
                alt=""
                className="footerbuttonimages"
                onClick={() => navigate("/mylibrarycourses")}
              />
              <img
                src={Rating}
                alt=""
                className="footerbuttonimages"
                onClick={hanldeRatingNavigate}
              />
            </>
          ) : (
            <>
              <img src={History_off} alt="" className="footerbuttonimages" />
              <img src={MyLibrary_off} alt="" className="footerbuttonimages" />
              <img src={Rating_off} alt="" className="footerbuttonimages" />
            </>
          )}

          <img
            src={Share}
            onClick={toggleDrawer(true)}
            alt=""
            className="footerbuttonimages"
          />
        </div>
        <div className="mobile_view_button">
          <div style={{ display: footerbutton ? "block" : "none" }}>
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                marginLeft: "30px",
              }}
            >
              {history?.length > 0 ? (
                <>
                  <img
                    src={History}
                    alt=""
                    style={{ cursor: "pointer" }}
                    width="50px"
                    height="50px"
                    onClick={hanldeNavigateToHistory}
                  />
                  <img
                    src={MyLibrary}
                    alt=""
                    style={{ cursor: "pointer" }}
                    width="50px"
                    height="50px"
                    onClick={() => navigate("/mylibrarycourses")}
                  />
                  <img
                    src={Rating}
                    alt=""
                    style={{ cursor: "pointer" }}
                    width="50px"
                    height="50px"
                    onClick={hanldeRatingNavigate}
                  />
                </>
              ) : (
                <>
                  <img
                    src={History_off}
                    alt=""
                    style={{ cursor: "pointer" }}
                    width="50px"
                    height="50px"
                  />
                  <img
                    src={MyLibrary_off}
                    alt=""
                    style={{ cursor: "pointer" }}
                    width="50px"
                    height="50px"
                  />
                  <img
                    src={Rating_off}
                    alt=""
                    style={{ cursor: "pointer" }}
                    width="50px"
                    height="50px"
                  />
                </>
              )}

              <img
                src={Share}
                onClick={toggleDrawer(true)}
                alt=""
                style={{ cursor: "pointer" }}
                width="50px"
                height="50px"
              />
            </div>
            <SwipeableDrawer
              className="footer-drawer"
              anchor="bottom"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              swipeAreaWidth={drawerBleeding}
              disableSwipeToOpen={true}
              ModalProps={{
                keepMounted: true,
              }}
            >
              <div className="bottomnavigator">
                <StyledBox
                  sx={{
                    px: 10,
                    pb: 24,
                    height: "100%",
                    overflow: "auto",
                  }}
                  style={{
                    paddingTop: "10px",
                    background: "#363636",
                    borderRadius: mobileView ? "10px" : "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {mobileView ? (
                        <>
                          <img
                            src={Icon_messages}
                            alt=""
                            style={{ paddingLeft: "0px" }}
                          />
                          <img
                            src={Icon_whatsapp}
                            alt=""
                            style={{ paddingLeft: "15px", cursor: "pointer" }}
                            onClick={handleWhatsApp}
                          />
                          <img
                            src={Icon_facebook}
                            alt=""
                            style={{ paddingLeft: "15px", cursor: "pointer" }}
                            onClick={handleFacebook}
                          />
                          <img
                            src={Icon_gmail}
                            alt=""
                            style={{ paddingLeft: "15px", cursor: "pointer" }}
                            onClick={handleMail}
                          />
                          <img
                            src={Icon_telegram}
                            alt=""
                            style={{ paddingLeft: "15px", cursor: "pointer" }}
                            onClick={handleTelegram}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={Icon_messages}
                            alt=""
                            style={{
                              position: "relative",
                              bottom: "-90px",
                              left: "-45px",
                            }}
                          />
                          <img
                            src={Icon_whatsapp}
                            alt=""
                            onClick={handleWhatsApp}
                            style={{
                              position: "relative",
                              bottom: "-40px",
                              left: "-22px",
                              cursor: "pointer",
                            }}
                          />
                          <img
                            src={Icon_facebook}
                            alt=""
                            style={{
                              position: "relative",
                              bottom: "-26px",
                              left: "8px",
                              cursor: "pointer",
                            }}
                            onClick={handleFacebook}
                          />
                          <img
                            src={Icon_gmail}
                            alt=""
                            style={{
                              position: "relative",
                              bottom: "-40px",
                              left: "40px",
                              cursor: "pointer",
                            }}
                            onClick={handleMail}
                          />
                          <img
                            src={Icon_telegram}
                            alt=""
                            style={{
                              position: "relative",
                              bottom: "-90px",
                              left: "52px",
                              cursor: "pointer",
                            }}
                            onClick={handleTelegram}
                          />
                        </>
                      )}
                    </div>
                    <Typography
                      className="sharingthispagetext"
                      variant="h6"
                      style={{
                        color: "white",
                        position: "absolute",
                        bottom: "150px",
                      }}
                    >
                      {" "}
                      sharing this Page
                    </Typography>
                  </div>
                </StyledBox>
              </div>
            </SwipeableDrawer>
          </div>
          <Button className="footer_buttons" onClick={handleFotterButton}>
            <div className="footer_sub">
              {footerbutton ? (
                <img src={Popup_CloseArrow} alt="logo" />
              ) : (
                <img src={Popup_OpenArrow} alt="logo" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

FooterButtons.propTypes = {
  window: PropTypes.func,
};

export default FooterButtons;
