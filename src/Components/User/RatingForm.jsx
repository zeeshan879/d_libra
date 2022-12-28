import React from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import FooterButtons from "./FooterButtons";
import { useSelector } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import "./RatingForm.css";
import GitGitHubIntroduction from "../../assests/SVG_Files/Slides/GitGitHubIntroduction.svg";
import StarIcon from "@mui/icons-material/Star";

const RatingForm = () => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.state);
  const [value, setValue] = React.useState(2);
  const handleBack = () => {
    navigate("/ratingsidebar");
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="back_button"
        style={{ color: `${theme ? " #363636" : " #FFFFFF"}` }}
      >
        <ArrowBack className="backbutton_icon" />{" "}
        <span className="backbutton_text">Back</span>
      </button>

      <div className="rating_form_root_container_two">
        <div className="ratingform_root">
          <span
            className={
              theme ? "ratingform_root_span_sub" : "ratingform_root_span"
            }
          >
            Please rate the content of
          </span>
          <img
            src={GitGitHubIntroduction}
            alt=""
            className="ratingform_image"
          />
        </div>

        <div className="ratingform_root_two_two">
          <span
            className="ratingform_root_span_one"
            style={{ color: `${theme ? "black" : "white"}` }}
          >
            Git & GitHub Introduction
          </span>
          <div className="ratingform_root_sub_two_container">
            <Rating
              name="simple-controlled"
              style={{ fontSize: "48px" }}
              className="ratingform_root_sub_two"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              emptyIcon={
                <StarIcon style={{ color: "#C4C4C4" }} fontSize="inherit" />
              }
            />
          </div>
        </div>
      </div>

      <div className="ratingform_root_three_three">
        <div className="rating_form_sub_span">
          <span
            className="rating_form_span_two"
            style={{ color: `${theme ? "#363636" : "#C8C8C8"}` }}
          >
            Rating Comments:
          </span>
        </div>

        <div>
          <textarea
            className={
              theme ? "rating_form_textarea_sub" : "rating_form_textarea"
            }
            style={{ color: `${theme ? "black" : "white"}` }}
            id="message"
            rows="14"
            placeholder=""
            type="text"
          />
        </div>

        <div className="rating_form_sub_four" style={{ marginTop: "20px" }}>
          <Button variant="contained" className="user_buttons">
            Submit
          </Button>

          <div className="user_buttons_sub_three">
            <span style={{ color: theme ? "  #111111" : " #C8C8C8" }}>
              Make a more specific <br /> feedback on contents
            </span>
            <span
              style={{
                paddingLeft: "10px",
                fontSize: "26px",
                color: theme ? "  #111111" : " #C8C8C8",
              }}
            >
              <HiOutlineArrowNarrowRight />
            </span>
          </div>
        </div>
        <div className="user_buttons_sub_three_hidden">
          <span style={{ color: theme ? "  #111111" : " #C8C8C8" }}>
            Make a more specific <br /> feedback on contents
          </span>
          <span
            style={{
              paddingLeft: "10px",
              fontSize: "26px",
              color: theme ? "  #111111" : " #C8C8C8",
            }}
          >
            <HiOutlineArrowNarrowRight />
          </span>
        </div>
      </div>
      <div>
        <FooterButtons />
      </div>
    </>
  );
};

export default RatingForm;
