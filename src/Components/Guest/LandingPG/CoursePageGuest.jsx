import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import { GetDashboardDataWithAuthorization } from "../../../Redux/Actions/Dashboard.Data.action";
import { development } from "../../../endpoints";
import FooterButtons from "../../User/FooterButtons";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { addRecenetViewContent } from "../../../Redux/Actions/Client Side/content.action";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CoursePageGuest = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.state);
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const [data, setdata] = useState([]);

  const [coursesWithTopics, setCoursesWithTopics] = useState([]);
  const [chaptersWithTopics, setChaptersWithTopics] = useState([]);

  const handleBack = () => {
    navigate("/");
  };

  // console.log("coursesWithTopics", coursesWithTopics);
  // console.log("chaptersWithTopics", chaptersWithTopics);

  useEffect(() => {
    const authDashboardData = async () => {
      const response = await dispatch(
        GetDashboardDataWithAuthorization(params?.id, role, token)
      );
      console.log("Get Dashboard Data Response", response);

      const responseChapter = await dispatch(
        GetDashboardDataWithAuthorization(params?.id, role, token)
      );

      setChaptersWithTopics(response?.data?.slice(1));
      console.log("response?.data?.shift()", response?.data?.slice(1));

      setCoursesWithTopics(responseChapter?.data[0]);
      setdata(response);
    };
    authDashboardData();
  }, [params]);

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

    const settings = {
    dots: false,
    adaptiveHeight: false,
    speed: 1300,
    infinite: false,
    initialSlide: 0,
    slidesToShow: 4.3,
    autoplay: false,
    slidesToScroll: 4,
    centerMode: false,
    arrows: true,

    responsive: [
      {
        breakpoint: 1120,
        settings: {
          slidesToShow: 4.3,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 860,
        settings: {
          slidesToShow: 3.14,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3.1,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 2.75,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 430,
        settings: {
          slidesToShow: 2.19,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 380,
        settings: {
          slidesToShow: 1.21,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 361,
        settings: {
          slidesToShow: 1.24,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 338,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 3,
          centerMode: false,
        },
      },
    ],
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
      <div className="mainContentContainer">
        <div className="mainContentContainer " style={{ marginTop: "20px" }}>
          {data?.slugimg ? (
            <div className="slugImage">
              <img
                src={`${development}/media/${data?.slugimg}`}
                alt=""
                className="coursemainimage "
              />
            </div>
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

          <span
            style={{ marginTop: "10px" }}
            className={theme ? "mycontentheadtwoo" : "mycontentheadthree"}
          >
            {data?.dropdown?.parent?.CategoryName !== undefined
              ? data?.dropdown?.parent?.CategoryName?.charAt(0).toUpperCase() +
                data?.dropdown?.parent?.CategoryName?.slice(1)
              : null}
          </span>
        </div>
      </div>
      {data?.data?.length > 0 ? (
        <>
          <div className="landingpage_slider_container coursemainpage_container">
            {coursesWithTopics?.lecture?.length > 0 && (
              <div className="content_root_container">
                {/* <>
                  {item?.lecture?.length > 0 && ( */}
                <div>
                  <span
                    className={
                      theme ? "chapternameclass" : "chapternameclasstwo"
                    }
                  >
                    {coursesWithTopics?.CategoryName?.charAt(0).toUpperCase() +
                      coursesWithTopics?.CategoryName?.slice(1)}
                  </span>
                </div>

                {coursesWithTopics?.lecture?.length !== 0 ? (
                  <div>
                    <div className="keen-slider" ref={sliderRef}>
                      {coursesWithTopics?.lecture?.map((e) => {
                        console.log(e?.meta_description);
                        return (
                          <div className=" keen-slider__slide">
                            <img
                              onClick={() =>
                                handleDetailPageNavigate(
                                  e?.unique_identifier,
                                  e?.title,
                                  coursesWithTopics?.id,
                                  e?.id,
                                  e?.courseid,
                                  e?.meta_description,
                                  e.images?.replaceAll("/", "|")
                                )
                              }
                              src={`${development}/media/${e.images}`}
                              className="landingpage_images"
                              // style={{
                              //   filter: `${e.disable ? "brightness(15%)" : ""}`,
                              // }}
                              alt=""
                            />
                            {e.images ? (
                              <div className="coursepageguestsection">
                                <p
                                  className="coursepageguesttext"
                                  style={{
                                    color: theme ? "#363636" : "#FFFFFF",
                                  }}
                                >
                                  {e?.title?.charAt(0).toUpperCase() +
                                    e?.title?.slice(1)}
                                </p>
                                {/* <Typography
                                          noWrap
                                          component="div"
                                          className="subcoursename"
                                          style={{
                                            color: theme
                                              ? "#363636"
                                              : "#FFFFFF",
                                          }}
                                        >
                                          {e?.title?.charAt(0).toUpperCase() +
                                            e?.title?.slice(1)}
                                        </Typography> */}
                                <div></div>
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
                  <h5
                    style={{
                      textAlign: "center",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    className={theme ? "two" : "one"}
                  >
                    No content found
                  </h5>
                )}
              </div>
            )}
          </div>

          {chaptersWithTopics?.length > 0 ? (
            <div className="landingpage_slider_container coursemainpage_container">
              {chaptersWithTopics?.map((item) => {
                return (
                  <div className="content_root_container">
                    {/* <>
                  {item?.lecture?.length > 0 && ( */}
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

                    {item?.lecture?.length !== 0 ? (
                      <>
                        {window.innerWidth < 800 ? <div className="keen-slider" ref={sliderRef}>
                          {item?.lecture?.map((e) => {
                            // console.log(e?.meta_description)
                            return (
                              <div className=" keen-slider__slide">
                                <img
                                  onClick={() =>
                                    handleDetailPageNavigate(
                                      e?.unique_identifier,
                                      e?.title,
                                      item?.id,
                                      e?.id,
                                      e?.courseid,
                                      e?.meta_description,
                                      e.images?.replaceAll("/", "|")
                                    )
                                  }
                                  src={`${development}/media/${e.images}`}
                                  className="landingpage_images"
                                  // style={{
                                  //   filter: `${e.disable ? "brightness(15%)" : ""}`,
                                  // }}
                                  alt=""
                                />
                                {e.images ? (
                                  <div className="coursepageguestsection">
                                    <p
                                      className="coursepageguesttext"
                                      style={{
                                        color: theme ? "#363636" : "#FFFFFF",
                                      }}
                                    >
                                      {e?.title?.charAt(0).toUpperCase() +
                                        e?.title?.slice(1)}
                                    </p>
                                    {/* <Typography
                                          noWrap
                                          component="div"
                                          className="subcoursename"
                                          style={{
                                            color: theme
                                              ? "#363636"
                                              : "#FFFFFF",
                                          }}
                                        >
                                          {e?.title?.charAt(0).toUpperCase() +
                                            e?.title?.slice(1)}
                                        </Typography> */}
                                    <div></div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            );
                          })}
                        </div> :  <Slider className="intro-slick" {...settings}>
                        {item?.lecture?.map((e) => {
                            // console.log(e?.meta_description)
                            return (
                              <div style={{ padding: "3px" }}
                              className="intro-slides">
                                <img
                                  onClick={() =>
                                    handleDetailPageNavigate(
                                      e?.unique_identifier,
                                      e?.title,
                                      item?.id,
                                      e?.id,
                                      e?.courseid,
                                      e?.meta_description,
                                      e.images?.replaceAll("/", "|")
                                    )
                                  }
                                  src={`${development}/media/${e.images}`}
                                  className="landingpage_images"
                                  // style={{
                                  //   filter: `${e.disable ? "brightness(15%)" : ""}`,
                                  // }}
                                  alt=""
                                />
                                {e.images ? (
                                  <div className="coursepageguestsection">
                                    <p
                                      className="coursepageguesttext"
                                      style={{
                                        color: theme ? "#363636" : "#FFFFFF",
                                      }}
                                    >
                                      {e?.title?.charAt(0).toUpperCase() +
                                        e?.title?.slice(1)}
                                    </p>
                                    {/* <Typography
                                          noWrap
                                          component="div"
                                          className="subcoursename"
                                          style={{
                                            color: theme
                                              ? "#363636"
                                              : "#FFFFFF",
                                          }}
                                        >
                                          {e?.title?.charAt(0).toUpperCase() +
                                            e?.title?.slice(1)}
                                        </Typography> */}
                                    <div></div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            );
                          })}
                        </Slider>} 
                      </>
                    ) : (
                      <h5
                        style={{
                          textAlign: "center",
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                        className={theme ? "two" : "one"}
                      >
                        No content found
                      </h5>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <h5
              style={{
                textAlign: "center",
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
              className={theme ? "two" : "one"}
            >
              No content found
            </h5>
          )}
        </>
      ) : (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
        >
          <CircularProgress color="inherit" size={30} />
        </Box>
      )}

      <FooterButtons />
    </>
  );
};
export default CoursePageGuest;
