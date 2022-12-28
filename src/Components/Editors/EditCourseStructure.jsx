import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EditCourseStructure.css";
import { Grid } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { HiArrowSmRight } from "react-icons/hi";
import { HiArrowSmLeft } from "react-icons/hi";
import Vector from "../../assests/Vector.png";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import Table from "./CustomeTable/Table";
import Select from "react-select";
import {
  importCategoryAndCourse,
  importCoursesAndChapters,
  importTopics,
} from "../../Redux/Actions/Editor/Category";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CourseAndChapter from "./CustomeTable/CourseAndChapter";
import ChapterAndTopics from "./CustomeTable/ChapterAndTopics";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "transparent",
    color: "black",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "rgba(38, 36, 42, 0.7)",
    border: "none",
    color: "black",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const EditCourseStructure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");


  const handleBack = () => {
    navigate("/editormainpage");
  };

  const handleChange = async (e) => {

    if (selectedOption === "categoryCourse") {
      const response = await dispatch(
        importCategoryAndCourse(e.target.files[0], token)
      );
      setMessage(response.message);
    } else if (selectedOption === "coursesChapter") {
      const response = await dispatch(
        importCoursesAndChapters(e.target.files[0], token)
      );
      setMessage(response.message);
    } else if (selectedOption === "topic") {
      const response = await dispatch(importTopics(e.target.files[0], token));
      setMessage(response.message);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "black",
      borderRadius: "5px",
      border: "none",
      color: "#363636",
      boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.25)",
      width: "100%",
      height: "28px !important",
      marginLeft: "5px !important",
      marginTop: "-1px !important",
    }),
    placeholder: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base, state) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "yellow",
      color: " #363636",
    }),
    menuList: (base, state) => ({
      ...base,
      padding: 0,
      background: "white",
      color: " #363636",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: "white",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: " #363636",
    }),
  };

  const handleSelector = (value) => {
    setSelectedOption(value?.value);
  };

  return (
    <div
      style={
        theme === true && location.pathname === "/editcoursestructure"
          ? { background: "#eeeeee", height: "100%" }
          : { color: "#C8C8C8" }
      }
    >
      {message === "Data Upload Successfully"
        ? toast.success(message, {
            toastId: "",
            position: "top-center",
          })
        : message?.includes("already exists")
        ? toast.info(message, {
            toastId: "",
            position: "top-center",
          })
        : message?.includes("xlsx files")
        ? toast.error(message, {
            toastId: "",
            position: "top-center",
          })
        : message === "Column format is incorrect"
        ? toast.error(message, {
            toastId: "",
            position: "top-center",
          })
        : null}
      <button
        onClick={handleBack}
        className="back_button"
        style={{ color: `${theme ? " #363636" : "  #C8C8C8"}` }}
      >
        <ArrowBack className="backbutton_icon" />{" "}
        <span className="backbutton_text">Back</span>
      </button>

      <div className="editcoursestructurecontainer">
        <div>
          <Button
            variant="outlined"
            className="newcategory_main_button"
            onClick={() => navigate("/addnewcategory")}
          >
            Add a New Category, Course or Chapter{" "}
          </Button>
        </div>
        <div className="editcoursestructuretext">
          <Typography variant="h6" noWrap component="div">
            <span
              className={
                theme ? "editors_menu_heading_sub_two" : "editors_menu_heading"
              }
            >
              Edit Course Structure
            </span>
          </Typography>
        </div>
      </div>
      <div className="selectorDiv">
        <Select
          styles={customStyles}
          className="select_file"
          placeholder="Select"
          options={[
            { value: "categoryCourse", label: "Category & Course" },
            { value: "coursesChapter", label: "Course & Chapter" },
            { value: "topic", label: "Chapter & Topic" },
          ]}
          onChange={handleSelector}
        />
      </div>
      <div className="editcoursesection">
        <div className="editcoursesectiontwo">
          <Grid container>
            <Grid item lg={2} md={3} sm={12} xs={12}>
              <span>Select Category to change</span>
            </Grid>
            <Grid item lg={10} md={9} sm={12} xs={12}>
              <div className="button_container">
                <Button
                  variant="contained"
                  className="editcoursestructure_button"
                >
                  Expand Three
                </Button>
                <Button
                  variant="contained"
                  className="editcoursestructure_button"
                >
                  Collapse Three
                </Button>

                <Button
                  variant="contained"
                  className="editcoursestructure_button"
                >
                  Import
                </Button>
                <Button
                  variant="contained"
                  className="editcoursestructure_button"
                  endIcon={<AddIcon />}
                  onClick={() => navigate("/addnewcategory")}
                >
                  Add Category
                </Button>
              </div>
            </Grid>
          </Grid>
          <div
            className="button_container_two"
            style={{ marginTop: "16px", width: "100%" }}
          >
            <Button
              variant="contained"
              className="editcoursestructure_button_two"
              startIcon={<HiArrowSmLeft />}
            >
              Export
            </Button>

            <label htmlFor="contained-button-file">
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleChange(e)}
              />

              {selectedOption === "" ? (
                <Button
                  variant="contained"
                  // component="span"
                  // className="image_button selectanimagebutton"
                  className="editcoursestructure_button_two"
                  startIcon={<HiArrowSmRight />}
                  onClick={() => {
                    selectedOption === "" &&
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Please select a category",
                      });
                  }}
                >
                  Import
                </Button>
              ) : (
                <Button
                  variant="contained"
                  component="span"
                  // className="image_button selectanimagebutton"
                  className="editcoursestructure_button_two"
                  startIcon={<HiArrowSmRight />}
                >
                  Import
                </Button>
              )}
            </label>
          </div>
          <div className="search_main_container">
            <img src={Vector} alt="" className="editcourseimagesection" />
            <input className="editor_input_field" />
            <Button className="editor_submit_button" variant="contained">
              Search
            </Button>
          </div>
        </div>
        <div className="action_container">
          <span>Action:</span>

          <Select
            styles={customStyles}
            className={
              theme
                ? "git_introduction_dropdown_sub"
                : "git_introduction_dropdown"
            }
            placeholder=""
          />

          <Button className="go_button" variant="outlined">
            Go
          </Button>
          <span style={{ paddingLeft: "20px" }}>0 of 9 selected</span>
        </div>
        {message.includes("Successfully") ||
        selectedOption === "coursesChapter" ? (
          <CourseAndChapter />
        ) : message.includes("Successfully") || selectedOption === "topic" ? (
          <ChapterAndTopics />
        ) : (
          <Table />
        )}
      </div>
    </div>
  );
};

export default EditCourseStructure;
