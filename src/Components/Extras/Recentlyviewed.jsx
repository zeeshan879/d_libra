import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Guest/LandingPG/Lp.css";
import { development } from "../../endpoints";
import RVector from "../../assests/RVector.png";
import { Typography } from "@material-ui/core";
import Group89Blue from "../../assests/Group89Blue.png";
import FooterButtons from "../User/FooterButtons";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import { viewCourseStatus } from "../../Redux/Actions/Client Side/course.action";
import moment from "moment";
import { courseHistory } from "../../Redux/Actions/history";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import Bookmark_blue from "../../assests/SVG_Files/New folder/Bookmark_blue.svg";
import Bookmark_yellow from "../../assests/SVG_Files/New folder/Bookmark_yellow.svg";
import Bookmark_red from "../../assests/SVG_Files/New folder/Bookmark_red.svg";
import Bookmark_green from "../../assests/SVG_Files/New folder/Bookmark_green.svg";
import Bookmark_grey from "../../assests/SVG_Files/New folder/Bookmark_gray.svg";
import Green_Bookmark from "../../assests/SVG_Files/New folder/Green_Bookmark.svg";

import {
  addContentBookmark,
  showAllBoomark,
} from "../../Redux/Actions/bookmark.action";
import Swal from "sweetalert2";
import { setBookMarkPriority } from "../../Redux/Actions/Client Side/librar.y.action";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const Recentlyviewed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const [history, setHistory] = useState([]);
  const [bookmark, setBookmark] = useState();
  const [count, setCount] = useState(0);
  const [priority, setPriority] = useState("");
  const [showAllBookmark, setShowAllBookmark] = useState([]);

  console.log("showAllBookmark history", history);
  console.log("showAllBookmark", showAllBookmark);

  const handleBack = () => {
    navigate("/");
  };

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 4,
      spacing: 5,
    },
    breakpoints: {
      "(max-width: 1120px)": {
        slides: {
          perView: 3,
          spacing: 5,
        },
      },
      "(max-width: 1060px)": {
        slides: {
          perView: 4.3,
          spacing: 5,
        },
      },
      "(max-width: 860px)": {
        slides: {
          perView: 2.14,
          spacing: 5,
        },
      },
      "(max-width: 700px)": {
        slides: {
          perView: 2,
          spacing: 5,
        },
      },
      "(max-width: 510)": {
        slides: {
          perView: 1.15,
          spacing: 5,
        },
      },
      "(max-width: 430px)": {
        slides: {
          perView: 1.19,
          spacing: 5,
        },
      },
      "(max-width: 380px)": {
        slides: {
          perView: 1.21,
          spacing: 5,
        },
      },
      "(max-width: 361px)": {
        slides: {
          perView: 1.24,
          spacing: 5,
        },
      },
      "(max-width: 338px)": {
        slides: {
          perView: 1.3,
          spacing: 5,
        },
      },
    },
  });

  // const settings = {
  //   dots: false,
  //   adaptiveHeight: false,
  //   initialSlide: 0,
  //   slidesToShow: 4,
  //   autoplay: false,
  //   slidesToScroll: 1,
  //   centerMode: false,
  //   arrows: false,
  //   speed: 1300,
  //   infinite: false,
  //   responsive: [
  //     {
  //       breakpoint: 1120,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 860,
  //       settings: {
  //         slidesToShow: 2.14,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //     {
  //       breakpoint: 700,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //     {
  //       breakpoint: 510,
  //       settings: {
  //         slidesToShow: 1.15,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //     {
  //       breakpoint: 430,
  //       settings: {
  //         slidesToShow: 1.19,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //     {
  //       breakpoint: 380,
  //       settings: {
  //         slidesToShow: 1.21,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //     {
  //       breakpoint: 361,
  //       settings: {
  //         slidesToShow: 1.24,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //     {
  //       breakpoint: 338,
  //       settings: {
  //         slidesToShow: 1.3,
  //         slidesToScroll: 1,
  //         centerMode: false,
  //       },
  //     },
  //   ],
  // };

  const handleDetails = (
    identifier,
    title,
    categoryid,
    postId,
    courseId,
    meta,
    img
  ) => {
    // console.log(category, course, chapter, title, slug, categoryid, postId);

    let hyphenValue = identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");
    navigate(
      `/topic/${hyphenValue}_${title}/${postId}/${categoryid}/${courseId}/${meta}/${img}`
        ?.replace(/\s+/g, "-")
        ?.replace("?", ""),
      {
        state: {
          path: location.pathname,
        },
      }
    );
  };

  const handleShowAllBookmark = async () => {
    const response = await dispatch(showAllBoomark(role, token));
    console.log(response);
    setShowAllBookmark(response);
  };

  // console.log(count);

  const handleBookMark = async (Contentid) => {
    const response = await dispatch(addContentBookmark(Contentid, role, token));
    // console.log("response", response);
    setBookmark(response);
    !token &&
      Swal.fire({
        title: "Unauthenticated",
        text: "Please login to bookmark",
        iconColor: "red",
        icon: "error",
      });
  };

  useEffect(() => {
    const recentViewedCourses = async () => {
      const response = await dispatch(courseHistory(token, role));
      // console.log("response", response);
      setHistory(response);
    };
    recentViewedCourses();
    handleShowAllBookmark();
  }, [bookmark]);

  return (
    <>
      <div
        className={
          theme
            ? "recentlyviewedmaincontainerlight"
            : "recentlyviewedmaincontainer"
        }
      >
        <button
          onClick={handleBack}
          className="back_button"
          style={{ color: `${theme ? " #363636" : "  #C8C8C8"}` }}
        >
          <ArrowBack className="backbutton_icon" />{" "}
          <span className="backbutton_text">Back</span>
        </button>
        <div className="mainContentContainer recentlyreviewed">
          <div className="recentlyviewedsection">
            <div style={{ display: "flex", alignItems: "center" }}>
              {theme ? (
                <img
                  src={Group89Blue}
                  alt="error"
                  className="recentlyviewedimage"
                />
              ) : (
                <img
                  src={RVector}
                  alt="error"
                  className="recentlyviewedimage"
                />
              )}
              <span
                className={
                  theme ? " recentlyviewedheading" : "recentlyviewedheadingtwo"
                }
              >
                Recently Viewed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="recentlyreviewd_slider_container">
        {history?.length > 0 ? (
          <>
            {history?.map((day) => (
              <div className="content_root_container">
                <div>
                  <span
                    className={
                      theme ? "chapternameclass" : "chapternameclasstwo"
                    }
                  >
                    {day?.chapterName}
                  </span>
                </div>
                <div>
                  {day?.items?.length > 0 ? (
                    <div className="keen-slider" ref={sliderRef}>
                      {day?.items?.map((e) => {
                        return (
                          <div className=" keen-slider__slide">
                            <img
                              src={`${development}/media/${e.images}`}
                              className="landingpage_images"
                              // style={{
                              //   filter: `${e.disable ? "brightness(15%)" : ""}`,
                              // }}
                              alt=""
                              onClick={() =>
                                handleDetails(
                                  e?.unique_identifier,
                                  e?.title,
                                  e?.chapterid,
                                  e?.Content_id,
                                  e?.courseid,
                                  e?.meta_description,
                                  e.images?.replaceAll("/", "|")
                                )
                              }
                            />
                            {e?.images ? (
                              <div className="underimagetextcontainer">
                                <Typography
                                  noWrap
                                  component="div"
                                  className="underimagecontent"
                                  style={{
                                    color: theme ? "#363636" : "#FFFFFF",
                                  }}
                                >
                                  <Typography
                                    noWrap
                                    component="div"
                                    className="subcoursenametwo subcoursename"
                                  >
                                    {e?.title}
                                  </Typography>
                                </Typography>
                                <div className="mycontenttagscontainer">
                                  <img
                                    src={
                                      e?.PriorityType ===
                                      showAllBookmark[0]?.name
                                        ? Bookmark_blue
                                        : e?.PriorityType ===
                                          showAllBookmark[1]?.name
                                        ? Bookmark_green
                                        : e?.PriorityType ===
                                          showAllBookmark[2]?.name
                                        ? Bookmark_red
                                        : e?.PriorityType ===
                                          showAllBookmark[3]?.name
                                        ? Bookmark_yellow
                                        : e?.PriorityType ===
                                          showAllBookmark[4]?.name
                                        ? Green_Bookmark
                                        : e.bookmark === "null"
                                        ? Bookmark_grey
                                        : Bookmark_grey
                                    }
                                    alt=""
                                    className="tagstwocontainer"
                                    onClick={() =>
                                      handleBookMark(e?.Content_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h4>No history for {day?.chapterName}</h4>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <CircularProgress color="inherit" size={60} />
          </Box>
        )}
      </div>

      <FooterButtons />
    </>
  );
};
export default Recentlyviewed;
