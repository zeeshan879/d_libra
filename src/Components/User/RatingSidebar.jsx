import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { ArrowBack } from "@mui/icons-material";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import FooterButtons from "./FooterButtons";
import { useSelector, useDispatch } from "react-redux";
import "./RatingForm.css";
import StarIcon from "@mui/icons-material/Star";
import Select from "react-select";
import {
  getAllCourses,
  getMainCategory,
  getParentChildCategories,
} from "../../Redux/Actions/Editor/Category";
import { ratingCourse } from "../../Redux/Actions/Client Side/Rating.action";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { home } from "../../Redux/Actions/Client Side/home.action";
import Swal from "sweetalert2";

const RatingSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);

  const [ratingValue, setValue] = React.useState(0);
  const [comment, setComment] = useState("");
  const [parentCategory, setParentCategory] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isArray, setIsArray] = useState();

  const handleBack = () => {
    navigate("/");
  };

  const handleParentChildeCategory = async () => {
    const response = await dispatch(getAllCourses(role, token));
    // console.log(" response", response)
    setParentCategory(response);
  };

  const MainCategory = async () => {
    const response = await dispatch(home());
    // console.log("MainCategory response", response);
    let array = [];
    response?.map((item) => {
      return item?.data?.map((item2) => {
        return item2?.items?.map((item3) => {
          // console.log("item3", item3);
          return array.push({
            id: item3?.id,
            label: item3?.CategoryName,
            rating: item3?.totalratinng,
          });
        });
      });
    });

    setIsArray(array);
  };

  useEffect(() => {
    handleParentChildeCategory();
    MainCategory();
  }, []);

  const handleSelector = (selectedOption) => {
    setSelectedOption(selectedOption);
    // console.log("selectedOption", selectedOption);
    setCourseId(selectedOption?.id);
    setValue(selectedOption?.rating);
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await dispatch(
      ratingCourse(role, courseId, ratingValue, comment, token)
    );
    // console.log(response);
    setMessage(response?.message);
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);
    setIsLoading(false);

    !token && Swal.fire({
      title: "Unauthenticated",
      text: "Please login to rate",
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
      <div className="ratingform_root_four_five">
        {message === "Rating Course Sucessfully" ? (
          <div>
            <h4 className={theme ? "successMessage" : "successMessageTwo"}>
              Course rated sucessfully
            </h4>
          </div>
        ) : message === "already rated" ? (
          <div>
            <h4 className={theme ? "successMessage" : "successMessageTwo"}>
              Already rated
            </h4>
          </div>
        ) : message === "All Fields are Required" ? (
          <div>
            <h4 className="errorMessage">{message}</h4>
          </div>
        ) : null}

        <Select
          styles={theme ? customStyles : customStyless}
          className={
            theme ? "addcategory_input_sub_two" : "addcategory_input_two"
          }
          placeholder="Select"
          options={isArray}
          onChange={handleSelector}
          value={selectedOption}
        />

        <div className="ratingsidebarcomponent">
          <Rating
            name="simple-controlled"
            style={{ fontSize: "48px" }}
            emptyIcon={
              <StarIcon style={{ color: "#C4C4C4" }} fontSize="inherit" />
            }
            value={ratingValue}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
      </div>

      <div className="ratingform_root_five">
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
            placeholder="Write your comments here"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="rating_form_sub_four">
          {isLoading ? (
            <Box
              className="user_buttons"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <CircularProgress color="inherit" size={30} />
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
              <HiOutlineArrowNarrowRight
                style={{ color: theme ? "  #111111" : " #C8C8C8" }}
              />
            </span>
          </div>
        </div>
        <div
          className="user_buttons_sub_three_hidden"
          onClick={() => navigate("/feedback")}
        >
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
            <HiOutlineArrowNarrowRight
              style={{ color: theme ? "  #111111" : " #C8C8C8" }}
            />
          </span>
        </div>
        <div
          className="footer_copyright ratingsidebar_footer"
          style={{ color: theme ? " #000000" : " #C8C8C8 " }}
        >
          <span style={{ fontSize: "12px" }}>
            &copy; D-Libra All Rights Reserved
          </span>
        </div>
      </div>
      <div>
        <FooterButtons />
      </div>
    </>
  );
};

export default RatingSidebar;
