import React, { useState, useEffect } from "react";
import "./MyContents.css";
import ContentData from "./ContentData";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./MyContents.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getDashboardData,
  GetDashboardDataWithAuthorization,
} from "../../../Redux/Actions/Dashboard.Data.action";
import { Typography } from "@material-ui/core";
import { ArrowBack } from "@mui/icons-material";
import { addRecenetViewContent } from "../../../Redux/Actions/Client Side/content.action";
import Bookmark_blue from "../../../assests/SVG_Files/New folder/Bookmark_blue.svg";
import Bookmark_yellow from "../../../assests/SVG_Files/New folder/Bookmark_yellow.svg";
import Bookmark_red from "../../../assests/SVG_Files/New folder/Bookmark_red.svg";
import Bookmark_green from "../../../assests/SVG_Files/New folder/Bookmark_green.svg";
import Bookmark_grey from "../../../assests/SVG_Files/New folder/Bookmark_gray.svg";
import Green_Bookmark from "../../../assests/SVG_Files/New folder/Green_Bookmark.svg";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { development } from "../../../endpoints";
import {
  librarybookmark,
  setBookMarkPriority,
} from "../../../Redux/Actions/Client Side/librar.y.action";
import {
  addContentBookmark,
  showAllBoomark,
} from "../../../Redux/Actions/bookmark.action";
import Swal from "sweetalert2";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const MyContents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { state } = useLocation();
  const [data, setdata] = useState([]);
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [bookmark, setBookmark] = useState();
  const [count, setCount] = useState(0);
  const [priority, setPriority] = useState("highpriority");
  const [showAllBookmark, setShowAllBookmark] = useState([]);

  const [coursesWithTopics, setCoursesWithTopics] = useState([]);
  const [chaptersWithTopics, setChaptersWithTopics] = useState([]);

  console.log("coursesWithTopics", coursesWithTopics);
  console.log("chaptersWithTopics", chaptersWithTopics);

  console.log(data);

  const handleBack = () => {
    // navigate(state?.path);
    navigate("/editormainpage");
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
  //   speed: 1300,
  //   infinite: false,
  //   initialSlide: 0,
  //   slidesToShow: 4,
  //   autoplay: false,
  //   slidesToScroll: 1,
  //   centerMode: false,
  //   arrows: false,
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

  const handleShowAllBookmark = async () => {
    const response = await dispatch(showAllBoomark(role, token));
    // console.log(response);
    setShowAllBookmark(response);
  };

  const dashboardData = async () => {
    const response = await dispatch(
      GetDashboardDataWithAuthorization(params?.id, role, token)
    );
    // console.log("response", response);

    const responseChapter = await dispatch(
      GetDashboardDataWithAuthorization(params?.id, role, token)
    );

    setChaptersWithTopics(response?.data?.slice(1));
    console.log("response?.data?.slice", response?.data?.slice(1));

    setCoursesWithTopics(responseChapter?.data[0]);
    setdata(response);
  };

  useEffect(() => {
    handleShowAllBookmark();
    dashboardData();
  }, [bookmark, params, priority]);

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

  const handleDetailPageNavigate = async (
    identifier,
    title,
    categoryid,
    postId,
    courseId,
    meta,
    img
  ) => {
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

    await dispatch(addRecenetViewContent(postId, role, token));
    // console.log("History", response);
  };

  return (
    <>
      <div
        className={
          theme ? "mainmycontentcontainer" : "mainmycontentcontainertwo"
        }
      >
        <div>
          <div className="mycontentcontainerbackbutton">
            <button
              onClick={handleBack}
              className="back_button"
              style={{
                color: `${theme ? " #363636" : "  #C8C8C8"}`,
                cursor: "pointer",
              }}
            >
              <ArrowBack className="backbutton_icon" />{" "}
              <span className="backbutton_text">Back</span>
            </button>
          </div>
          <div className="mainContentContainertwotwo">
            <span
              className={theme ? "mycontentheadthreeee" : "mycontentheadtwoooo"}
            >
              {data?.dropdown?.parent?.CategoryName !== undefined
                ? data?.dropdown?.parent?.CategoryName?.charAt(
                    0
                  ).toUpperCase() +
                  data?.dropdown?.parent?.CategoryName?.slice(1)
                : null}
            </span>
          </div>

          <div className={theme ? "contentforedittext" : ""}>
            <div
              className="mainContentContainersub "
              style={{
                boxShadow: theme ? "" : "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <span
                className={
                  theme ? "mycontentheadthreee" : " mycontentheadtwooo"
                }
              >
                Select a Content for Edit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* : (
                    <h3 style={{ textAlign: "center", marginTop: "10px" }}>
                      No content found
                    </h3>
                  ) */}

      {data?.data?.length > 0 ? (
        <>
          <div className="landingpage_slider_container">
            <>
              {coursesWithTopics?.lecture?.length > 0 && (
                <div
                  className="content_root_container"
                  key={coursesWithTopics?.id}
                >
                  <div>
                    <span
                      className={
                        theme ? "chapternameclass" : "chapternameclasstwo"
                      }
                    >
                      {coursesWithTopics?.CategoryName?.charAt(
                        0
                      ).toUpperCase() +
                        coursesWithTopics?.CategoryName?.slice(1)}
                    </span>
                  </div>

                  {coursesWithTopics?.lecture?.length > 0 && (
                    <div>
                      <div className="keen-slider" ref={sliderRef}>
                        {coursesWithTopics?.lecture?.map((e) => {
                          return (
                            <div className="keen-slider__slide" key={e?.id}>
                              <img
                                onClick={() =>
                                  handleDetailPageNavigate(
                                    e?.unique_identifier,
                                    e?.title,
                                    coursesWithTopics.id,
                                    e?.id,
                                    e?.courseid,
                                    e?.meta_description,
                                    e.images?.replaceAll("/", "|")
                                  )
                                }
                                src={`${development}/media/${e.images}`}
                                className="landingpage_images"
                                alt=""
                              />
                              {e.images ? (
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
                                      {e.title?.charAt(0).toUpperCase() +
                                        e.title?.slice(1)}
                                    </Typography>
                                  </Typography>
                                  <div className="mycontenttagscontainer">
                                    {token ? (
                                      <img
                                        src={
                                          e.PriorityType === null
                                            ? Bookmark_grey
                                            : e?.PriorityType ===
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
                                            : e.PriorityType === "null"
                                            ? Bookmark_grey
                                            : Bookmark_grey
                                        }
                                        alt=""
                                        onClick={() => handleBookMark(e?.id)}
                                        className="bookmark_icon"
                                      />
                                    ) : (
                                      <img
                                        src={Bookmark_grey}
                                        alt=""
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleBookMark(e?.id)}
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          </div>

          {chaptersWithTopics?.length > 0 ? (
            <div className="landingpage_slider_container">
              {chaptersWithTopics?.map((item) => {
                return (
                  <>
                    <div className="content_root_container" key={item?.id}>
                      <div>
                        <span
                          className={
                            theme ? "chapternameclass" : "chapternameclasstwo"
                          }
                        >
                          {item?.CategoryName?.charAt(0).toUpperCase() +
                            item?.CategoryName?.slice(1)}
                        </span>
                      </div>

                      {item?.lecture?.length > 0 ? (
                        <div>
                          <div className="keen-slider" ref={sliderRef}>
                            {item?.lecture?.map((e) => {
                              return (
                                <div className="keen-slider__slide" key={e?.id}>
                                  <img
                                    onClick={() =>
                                      handleDetailPageNavigate(
                                        e?.unique_identifier,
                                        e?.title,
                                        item.id,
                                        e?.id,
                                        e?.courseid,
                                        e?.meta_description,
                                        e.images?.replaceAll("/", "|")
                                      )
                                    }
                                    src={`${development}/media/${e.images}`}
                                    className="landingpage_images"
                                    alt=""
                                  />
                                  {e.images ? (
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
                                          {e.title?.charAt(0).toUpperCase() +
                                            e.title?.slice(1)}
                                        </Typography>
                                      </Typography>
                                      <div className="mycontenttagscontainer">
                                        {token ? (
                                          <img
                                            src={
                                              e.PriorityType === null
                                                ? Bookmark_grey
                                                : e?.PriorityType ===
                                                  "highpriority"
                                                ? Bookmark_blue
                                                : e?.PriorityType ===
                                                  "reviewlist"
                                                ? Bookmark_green
                                                : e?.PriorityType ===
                                                  "futureread"
                                                ? Bookmark_red
                                                : e?.PriorityType ===
                                                  showAllBookmark[0]?.name
                                                ? Bookmark_yellow
                                                : e?.PriorityType ===
                                                  showAllBookmark[1]?.name
                                                ? Green_Bookmark
                                                : e.PriorityType === "null"
                                                ? Bookmark_grey
                                                : Bookmark_grey
                                            }
                                            alt=""
                                            onClick={() =>
                                              handleBookMark(e?.id)
                                            }
                                            className="bookmark_icon"
                                          />
                                        ) : (
                                          <img
                                            src={Bookmark_grey}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleBookMark(e?.id)
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <h3 style={{ textAlign: "center", marginTop: "10px" }}>
                          No content found
                        </h3>
                      )}
                    </div>
                  </>
                );
              })}
            </div>
          ) : (
            <h3 style={{ textAlign: "center", marginTop: "10px" }}>
              No content found
            </h3>
          )}
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" size={30} />
        </Box>
      )}
    </>
  );
};

export default MyContents;
