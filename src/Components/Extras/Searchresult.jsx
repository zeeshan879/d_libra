import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Bookmark_blue from "../../assests/SVG_Files/New folder/Bookmark_blue.svg";
import Bookmark_grey from "../../assests/SVG_Files/New folder/Bookmark_gray.svg";
import Bookmark_green from "../../assests/SVG_Files/New folder/Bookmark_green.svg";
import Bookmark_red from "../../assests/SVG_Files/New folder/Bookmark_red.svg";
import Bookmark_yellow from "../../assests/SVG_Files/New folder/Bookmark_yellow.svg";
import Green_Bookmark from "../../assests/SVG_Files/New folder/Green_Bookmark.svg";
import Search from "../../assests/SVG_Files/New folder/icons/Search.svg";
import Search_dark from "../../assests/SVG_Files/New folder/icons/Search_dark.svg";
import { searchAction } from "../../Redux/Actions/Client Side/search.action";
import "../Guest/LandingPG/Lp.css";
import FooterButtons from "../User/FooterButtons";
import Searchdata from "./Searchdata";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { development } from "../../endpoints";
import {
  addContentBookmark,
  showAllBoomark,
} from "../../Redux/Actions/bookmark.action";
import { addRecenetViewContent } from "../../Redux/Actions/Client Side/content.action";

import { ArrowBack } from "@mui/icons-material";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const Searchresult = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [data, setdata] = useState([]);
  const [message, setmessage] = useState("");
  const [bookmark, setBookmark] = useState("");
  const [showAllBookmark, setShowAllBookmark] = useState([]);
  // console.log(data);
  console.log("data", data);
  // console.log("state", showAllBookmark[1]?.name);
  // console.log(location.state.search);
  // console.log(location.search?.split("=")[2].replace("-", " "));

  const handleBack = () => {
    navigate(state?.path ? state.path : "/");
  };

  // const [sliderRef] = useKeenSlider({
  //   loop: false,
  //   mode: "free-snap",
  //   slides: {
  //     perView: 4,
  //     spacing: 15,
  //   },
  //   breakpoints: {
  //     "(max-width: 1120px)": {
  //       slides: {
  //         perView: 3,
  //         spacing: 15,
  //       },
  //     },
  //     "(max-width: 1060px)": {
  //       slides: {
  //         perView: 4.3,
  //         spacing: 10,
  //       },
  //     },
  //     "(max-width: 860px)": {
  //       slides: {
  //         perView: 2.14,
  //         spacing: 5,
  //       },
  //     },
  //     "(max-width: 700px)": {
  //       slides: {
  //         perView: 2,
  //         spacing: 5,
  //       },
  //     },
  //     "(max-width: 510)": {
  //       slides: {
  //         perView: 1.15,
  //         spacing: 5,
  //       },
  //     },
  //     "(max-width: 430px)": {
  //       slides: {
  //         perView: 1.19,
  //         spacing: 5,
  //       },
  //     },
  //     "(max-width: 380px)": {
  //       slides: {
  //         perView: 1.21,
  //         spacing: 5,
  //       },
  //     },
  //     "(max-width: 361px)": {
  //       slides: {
  //         perView: 1.24,
  //         spacing: 5,
  //       },
  //     },
  //     "(max-width: 338px)": {
  //       slides: {
  //         perView: 1.3,
  //         spacing: 5,
  //       },
  //     },
  //   },
  // });

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
  //       breakpoint: 760,
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
  //   ],
  // };

  const handleShowAllBookmark = async () => {
    const response = await dispatch(showAllBoomark(role, token));
    // console.log(response);
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

  const hanldeDetails = async (
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
          path: `${location.pathname}${location.search}`,
          state: location.state.search,
        },
      }
    );

    await dispatch(addRecenetViewContent(postId, role, token));
  };

  useEffect(() => {
    const searchResult = async () => {
      const response = await dispatch(
        searchAction(
          role,
          location.state.search
            ? location.search?.split("=")[2]?.replace("-", " ")
            : location.state.search,
          token
        )
      );
      if (response?.data[0]?.items?.length === 0) {
        setmessage("No Content Found");
        setdata([]);
      } else {
        setmessage("");
        setdata(response?.data);
      }
    };
    searchResult();
    handleShowAllBookmark();
  }, [window.location.search, token, params, bookmark]);

  return (
    <>
      <div className={theme ? "" : "recentlyviewedmaincontainer"}>
        <button
          onClick={handleBack}
          className="back_button"
          style={{ color: `${theme ? " #363636" : "  #C8C8C8"}` }}
        >
          <ArrowBack className="backbutton_icon" />{" "}
          <span className="backbutton_text">Back</span>
        </button>
        <div className="mainContentContainer recentlyreviewed">
          <div className="searchresultsection">
            <div style={{ display: "flex", alignItems: "center" }}>
              {theme ? (
                <img src={Search} alt="error" className="recentlyviewedimage" />
              ) : (
                <img
                  src={Search_dark}
                  alt="error"
                  className="recentlyviewedimage"
                />
              )}
              <span
                className={
                  theme ? " recentlyviewedheading" : "recentlyviewedheadingtwo"
                }
              >
                Results for '
                {location.search?.split("=")[2]?.replace(/[^a-zA-Z ]/g, " ")}'
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="searchresult_slider_container">
        {message === "No Content Found" ? (
          <h1 style={{ textAlign: "center" }}>No Content Found</h1>
        ) : (
          <>
            {data?.length > 0 ? (
              <>
                {data?.map((item) => {
                  // console.log("item", item);
                  return (
                    <div className="content_root_container">
                      <div>
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid
                            container
                            spacing={{ xs: 1, md: 1 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                          >
                            {item?.items?.map((e) => (
                              <Grid
                                item
                                xs={2}
                                sm={2.6}
                                md={3}
                                style={{
                                  marginBottom: "50px",
                                }}
                              >
                                <img
                                  src={`${development}/media/${e.images}`}
                                  onClick={() =>
                                    hanldeDetails(
                                      e?.unique_identifier,
                                      e?.title,
                                      e.chapterid,
                                      e?.id,
                                      e?.courseid,
                                      e?.meta_description,
                                      e.images?.replaceAll("/", "|")
                                    )
                                  }
                                  className="landingpage_images"
                                  style={{
                                    filter: `${
                                      e.disabled ? "brightness(15%)" : ""
                                    }`,
                                    cursor: "pointer",
                                  }}
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
                                        {e.title}
                                      </Typography>
                                    </Typography>
                                    {/* <div className="mycontenttagscontainer">
                                      {token ? (
                                        <img
                                          src={
                                            e.PriorityType === null
                                              ? Bookmark_grey
                                              : e?.PriorityType ===
                                                "highpriority"
                                              ? Bookmark_blue
                                              : e?.PriorityType === "reviewlist"
                                              ? Bookmark_green
                                              : e?.PriorityType === "futureread"
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
                                          className="tagstwocontainer"
                                          onClick={() => handleBookMark(e?.id)}
                                          style={{ cursor: "pointer" }}
                                        />
                                      ) : (
                                        <img
                                          src={Bookmark_grey}
                                          alt=""
                                          className="tagstwocontainer"
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            handleBookMark(e?.Contentid)
                                          }
                                        />
                                      )}
                                    </div> */}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </div>
                    </div>
                  );
                })}
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
          </>
        )}
      </div>

      <div className="second_tagpage_container">
        {message === "No Content Found" ? (
          <h4 style={{ textAlign: "center" }}>No Content Found</h4>
        ) : (
          <>
            {data?.length > 0 ? (
              <>
                {data?.map((item) => {
                  return (
                    <>
                      {item?.items?.map((e) => {
                        return (
                          <div
                            className="W-main-map"
                            style={{
                              marginTop: "2px",
                              backgroundColor: `${
                                theme ? "#f3f6ff" : "   #4f4f4f "
                              }`,
                            }}
                          >
                            <div className="left">
                              <p
                                className="left_p"
                                style={{
                                  color: theme ? " #363636" : "  #ffffff",
                                }}
                              >
                                {e.title}
                              </p>
                            </div>
                            <div className="right">
                              <img
                                className="right_image"
                                src={`${development}/media/${e.images}`}
                                onClick={() =>
                                  hanldeDetails(
                                    e?.unique_identifier,
                                    e?.title,
                                    e.chapterid,
                                    e?.id,
                                    e?.courseid,
                                    e?.meta_description,
                                    e.images?.replaceAll("/", "|")
                                  )
                                }
                                alt=""
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })}
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                }}
              >
                <CircularProgress color="inherit" size={30} />
              </Box>
            )}
          </>
        )}
      </div>
      <FooterButtons />
    </>
  );
};
export default Searchresult;
