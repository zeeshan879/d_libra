import { Typography } from "@material-ui/core";
import { ArrowBack } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Bookmark_blue from "../../assests/SVG_Files/New folder/Bookmark_blue.svg";
import Bookmark_grey from "../../assests/SVG_Files/New folder/Bookmark_gray.svg";
import Bookmark_green from "../../assests/SVG_Files/New folder/Bookmark_green.svg";
import Bookmark_red from "../../assests/SVG_Files/New folder/Bookmark_red.svg";
import Bookmark_yellow from "../../assests/SVG_Files/New folder/Bookmark_yellow.svg";
import Green_Bookmark from "../../assests/SVG_Files/New folder/Green_Bookmark.svg";
import Tag_dark from "../../assests/SVG_Files/Tag_dark.svg";
import Tag_light from "../../assests/SVG_Files/Tag_light.svg";
import { development } from "../../endpoints";
import {
  addContentBookmark,
  showAllBoomark,
} from "../../Redux/Actions/bookmark.action";
import Grid from "@mui/material/Grid";
import { addRecenetViewContent } from "../../Redux/Actions/Client Side/content.action";
import { searchAction } from "../../Redux/Actions/Client Side/search.action";
import "../Guest/LandingPG/Lp.css";
import FooterButtons from "../User/FooterButtons";
import TgpageData from "./TgpageData";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const Tagpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { path } = useLocation();
  const location = useLocation();
  const params = useParams();
  const role = useSelector((state) => state.auth.role);
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const [data, setdata] = useState([]);
  const [message, setmessage] = useState("");
  const [bookmark, setBookmark] = useState("");
  const [showAllBookmark, setShowAllBookmark] = useState([]);

  console.log("data", data);

  const handleBack = () => {
    navigate(state?.path === undefined ? "/" : state?.path, {
      state: { path: state?.previous, search: state?.search },
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
          path: location.pathname,
          previous: state?.previous,
          search: state?.search,
        },
      }
    );
    await dispatch(addRecenetViewContent(postId, role, token));
  };

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

  const handleShowAllBookmark = async () => {
    const response = await dispatch(showAllBoomark(role, token));
    // console.log(response);
    setShowAllBookmark(response);
  };

  useEffect(() => {
    const searchResult = async () => {
      const response = await dispatch(
        searchAction(role, params?.tag?.replace("-", " "), token)
      );
      // console.log("response", response);
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
  }, [params, bookmark, state]);

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 4,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1120px)": {
        slides: {
          perView: 3,
          spacing: 15,
        },
      },
      "(max-width: 1060px)": {
        slides: {
          perView: 4.3,
          spacing: 10,
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
                <img src={Tag_light} alt="" className="recentlyviewedimage" />
              ) : (
                <img src={Tag_dark} alt="" className="recentlyviewedimage" />
              )}
              <span
                className={
                  theme ? " recentlyviewedheading" : "recentlyviewedheadingtwo"
                }
              >
                Tag '{params?.tag?.replace("-", " ")}'
              </span>
            </div>
          </div>
        </div>
      </div>
      {data?.length > 0 ? (
        <div className="searchresult_slider_container">
          {data?.map((item) => {
            return (
              <div className="content_root_container">
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
                          src={`${development}/media/${e.images}`}
                          className="landingpage_images"
                          // style={{
                          //   // filter: `${e.disable ? "brightness(15%)" : ""}`,
                          // }}
                          alt=""
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
                                {e.title}
                              </Typography>
                            </Typography>
                            {/* <div className="mycontenttagscontainer">
                {token ? (
                  <img
                    src={
                      e?.PriorityType === "highpriority"
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
                    onClick={() => handleBookMark(e?.id)}
                    style={{ cursor: "pointer" }}
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
            );
          })}
        </div>
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

      <div className="second_tagpage_container">
        {data.map((item) => {
          return (
            <>
              {item.items.map((e) => {
                return (
                  <div
                    className="W-main-map"
                    style={{
                      marginTop: "2px",
                      backgroundColor: `${theme ? "#f3f6ff" : "   #4f4f4f "}`,
                    }}
                  >
                    <div className="left">
                      <p
                        className="left_p"
                        style={{ color: theme ? " #363636" : "  #ffffff" }}
                      >
                        {e.title}
                      </p>
                    </div>
                    <div className="right">
                      <img
                        className="right_image"
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
                        src={`${development}/media/${e.images}`}
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
      </div>

      <FooterButtons />
    </>
  );
};
export default Tagpage;
