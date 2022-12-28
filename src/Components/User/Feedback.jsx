import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import FooterButtons from "./FooterButtons";
import { useSelector, useDispatch } from "react-redux";
import "./RatingForm.css";
import Select from "react-select";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { getAllCourses } from "../../Redux/Actions/Editor/Category";
import {
  postFeedback,
  topicsOfCourses,
} from "../../Redux/Actions/feedback.action";
import Swal from "sweetalert2";

const Feedback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.state);
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // COURSE HOOKS
  const [parentCourse, setParentCourse] = useState([]);
  const [selectedCourseOption, setSelectedCourseOption] = useState("");
  const [parentID, setParentID] = useState("");

  // TOPIC HOOKS
  const [topics, setTopics] = useState([]);
  const [selectedTopicOption, setSelectedTopicOption] = useState("");
  const [topicID, setTopicID] = useState("");

  // console.log("selectedOption", selectedOption);
  const handleBack = () => {
    navigate("/");
  };

  // GET ALL COURSES
  const handleGetAllCourses = async () => {
    const response = await dispatch(getAllCourses(role, token));
    // console.log("response", response);
    setParentCourse(response);
  };

  const courseOptions = parentCourse?.map((course) => {
    // console.log("course", course);
    return {
      id: course?.id,
      label: course?.category,
      identifier: course?.unique_identifier,
    };
  });

  const handleGetCourseSelector = (selectedChapterOption) => {
    // console.log(selectedChapterOption);
    setParentID(selectedChapterOption?.id);
    setSelectedCourseOption(selectedChapterOption);
  };

  // GET ALL TOPICS
  const handleGetAllTopics = async () => {
    const response = await dispatch(topicsOfCourses(parentID, role, token));
    // console.log("response", response);
    setTopics(response);
  };

  const topicOptions = topics?.map((topics) => {
    // console.log("topics", topics);
    return {
      id: topics?.id,
      label: topics?.title,
    };
  });

  const handleGetTopicSelector = (selectedTopicOption) => {
    // console.log(selectedChapterOption);
    setTopicID(selectedTopicOption?.id);
    setSelectedTopicOption(selectedTopicOption);
  };

  useEffect(() => {
    handleGetAllCourses();
    handleGetAllTopics();
  }, [parentID, topicID]);

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await dispatch(
      postFeedback(topicID, feedback, role, token)
    );
    setMessage(response?.message);

    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);
    setIsLoading(false);

    !token && Swal.fire({
      title: "Unauthenticated",
      text: "Please login to give your feedback",
      iconColor: "red",
      icon: "error",
    });

    return () => clearTimeout(timer);
  };

  const customStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      // console.log({ data, isDisabled, isFocused, isSelected });
      return {
        ...styles,
        backgroundColor: isFocused ? " #FFFFFF" : " #FFFFFF",
        color: " #363636",
      };
    },
    control: (base) => ({
      ...base,
      background: " #FFFFFF",
      borderRadius: "5px",
      border: "none",
      color: " #363636",
      boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.25)",
      height: "50px",
      "@media only screen and (max-width: 425px)": {
        height: "40px",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#111111",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: " #363636",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      background: "white",
      color: " #363636",
    }),
    singleValue: (base) => ({
      ...base,
      color: " #363636",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: " #363636",
    }),
  };

  const customStyless = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      console.log({ data, isDisabled, isFocused, isSelected });
      return {
        ...styles,
        backgroundColor: isFocused ? " #4F4F4F" : " #4F4F4F",
        color: "white",
      };
    },
    control: (base) => ({
      ...base,
      background: " #4F4F4F",
      borderRadius: "5px",
      border: "none",
      color: "white",
      boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.25)",
      height: "50px",
      "@media only screen and (max-width: 425px)": {
        height: "40px",
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: "#FFFFFF",
      opacity: 1,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: "black",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      background: "white",
      color: "black",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#FFFFFF",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "white",
    }),
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
      <div className="ratingform_root_two">
        {message === "topicid,opinion is required" ? (
          <div className="errorMessage">Feilds cannot be empty!</div>
        ) : message === "Response recorded" ? (
          <div className={theme ? "successMessage" : "successMessageTwo"}>
            Feedback recorded successfully
          </div>  
        ) : message === "response already recorded" ? (
          <div className="errorMessage">Response already recorded</div>
        ) : null}
        <Select
          styles={theme ? customStyles : customStyless}
          className={
            theme ? "addcategory_input_sub_two" : "addcategory_input_two"
          }
          placeholder="Select a Course for Feedback"
          value={selectedCourseOption}
          options={courseOptions}
          onChange={handleGetCourseSelector}
        />
        <Select
          styles={theme ? customStyles : customStyless}
          className={
            theme ? "addcategory_input_sub_two" : "addcategory_input_two"
          }
          placeholder="Select a Topic for Feedback"
          value={selectedTopicOption}
          options={topicOptions}
          onChange={handleGetTopicSelector}
        />
      </div>
      <div className="ratingform_root_three">
        <div className="rating_form_sub_span">
          <span
            className="rating_form_span_two"
            style={{ color: `${theme ? "#363636" : "white"}` }}
          >
            Feedback Comments:
          </span>
        </div>
        <div>
          <textarea
            style={{ color: `${theme ? "black" : "white"}`, height: "403px" }}
            className={
              theme ? "rating_form_textarea_sub" : "rating_form_textarea"
            }
            id="message"
            rows="20"
            placeholder="Write your feedback here"
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <div className="submitfeedbackbutton">
          {isLoading ? (
            <Box
              className="user_buttons"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <CircularProgress color="inherit" size={20} />
            </Box>
          ) : (
            <Button
              variant="contained"
              className="user_buttons"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
      <FooterButtons />
    </>
  );
};

export default Feedback;
