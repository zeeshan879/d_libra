import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./Lp.css";
import LandingPageImage1 from "../../../assests/SVG_Files/LandingPageImage1.svg";
import darkmode_logo from "../../../assests/SVG_Files/New folder/darkmode_logo.svg";
import lightmode_logo from "../../../assests/SVG_Files/New folder/lightmode_logo.svg";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { courseView } from "../../../Redux/Actions/Client Side/course.view.action";
import { addToRecentViewCourses } from "../../../Redux/Actions/Client Side/course.action";
import { home } from "../../../Redux/Actions/Client Side/home.action";
import { development } from "../../../endpoints";
import FooterButtons from "../../User/FooterButtons";
import { searchCourse } from "../../../Redux/Actions/Client Side/search.action";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const { state } = useLocation();
  const [data, setdata] = useState([]);
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 5.2,
      spacing: 5,
      // dragSpeed: 50,
    },
    breakpoints: {
      "(max-width: 1600px)": {
        slides: {
          perView: 4.6,
          spacing: 5,
        },
      },
      "(max-width: 1370px)": {
        slides: {
          perView: 4.4,
          spacing: 5,
        },
      },
      "(max-width: 1260px)": {
        slides: {
          perView: 4.8,
          spacing: 5,
        },
      },
      "(max-width: 1160px)": {
        slides: {
          perView: 4.6,
          spacing: 5,
        },
      },
      "(max-width: 1060px)": {
        slides: {
          perView: 4.3,
          spacing: 5,
        },
      },
      "(max-width: 1030px)": {
        slides: {
          perView: 3.8,
          spacing: 5,
        },
      },
      "(max-width: 1000px)": {
        slides: {
          perView: 3.6,
          spacing: 5,
        },
      },
      "(max-width: 940px)": {
        slides: {
          perView: 3.4,
          spacing: 5,
        },
      },
      "(max-width: 880px)": {
        slides: {
          perView: 3.4,
          spacing: 5,
        },
      },
      "(max-width: 760px)": {
        slides: {
          perView: 3.3,
          spacing: 5,
        },
      },
      "(max-width: 680px)": {
        slides: {
          perView: 2.9,
          spacing: 5,
        },
      },
      "(max-width: 660px)": {
        slides: {
          perView: 2.7,
          spacing: 5,
        },
      },
      "(max-width: 540px)": {
        slides: {
          perView: 2.4,
          spacing: 5,
        },
      },
      "(max-width: 500px)": {
        slides: {
          perView: 2.3,
          spacing: 5,
        },
      },
      "(max-width: 470px)": {
        slides: {
          perView: 2.1,
          spacing: 5,
        },
      },
      "(max-width: 435px)": {
        slides: {
          perView: 1.9,
          spacing: 5,
        },
      },
      "(max-width: 396px)": {
        slides: {
          perView: 1.8,
          spacing: 5,
        },
      },
      "(max-width: 370px)": {
        slides: {
          perView: 1.6,
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

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5.3,
      slidesToSlide: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4.3,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2.3,
      slidesToSlide: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1.3,
      slidesToSlide: 4,
    },
  };
  const searchOnCourse = async () => {
    const response = await dispatch(searchCourse(state?.search));
    setdata(response);
  };

  const MainCategory = async () => {
    const response = await dispatch(home(token));
    setdata(response);
  };

  useEffect(() => {
    state?.searchKey ? searchOnCourse() : MainCategory();
  }, [state, params, window]);

  const handleViewRecentCourses = async (course) => {
    let hyphenValue = course?.unique_identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");
    await dispatch(addToRecentViewCourses(course?.id, role, token));
    await dispatch(courseView(course?.id, role, token));
    navigate(
      `/course/${hyphenValue}_${course?.CategoryName}/${course?.id}`
        ?.replace(/\s+/g, "-")
        ?.replace("?", ""),
      { state: course?.image }
    );
  };

  return (
    <>
      <div
        className="mainContentContainer"
        style={
          theme === true && location.pathname === "/editcoursestructure"
            ? {
                background: "#F3F6FF",
                height: "100%",
                marginTop: "20px",
                // marginLeft: "52px",
              }
            : { marginTop: "20px" }
        }
      >
        <div className="underimagecontent">
          {theme ? (
            <img src={lightmode_logo} alt="" width="150px" height="30.7" />
          ) : (
            <img src={darkmode_logo} alt="" width="150px" height="30.7" />
          )}
        </div>
        <span
          className={theme ? "mycontentheadingtwoo" : "mycontentheadingthree"}
        >
          A web book based learning content library for digital skill
          development
        </span>

        <div className="landingpagesection">
          <img style={{ width: "230px" }} src={LandingPageImage1} alt="" />
        </div>
      </div>
      {!token && (
        <div className="mainContentContainer" style={{ marginTop: 0 }}>
          <div style={{ display: "flex" }}>
            {" "}
            <button
              className="Signup_button Signup"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
            <button
              className="Signup_button"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      )}
      {data?.length > 0 ? (
        <div className="landingpage_slider_container">
          {data[0]?.data?.map((item, index) => {
            return (
              <>
                {item?.items?.length !== 0 && (
                  <div className="content_root_container" key={item?.id}>
                    <div>
                      <span
                        className={
                          theme ? "chapternameclass" : "chapternameclasstwo"
                        }
                      >
                        {item?.chaptername.charAt(0).toUpperCase() +
                          item?.chaptername.slice(1)}
                      </span>
                    </div>
                    {window.innerWidth < 800 ? (
                      <div className="navigation-wrapper">
                        <div className="keen-slider" ref={sliderRef}>
                          {item?.items?.map((e) => {
                            return (
                              <div className=" keen-slider__slide">
                                <img
                                  src={`${development}/media/${e.image}`}
                                  // onClick={() => navigate("/coursepageguest")}
                                  onClick={() => handleViewRecentCourses(e)}
                                  className="landingpage_images_home"
                                  // style={{
                                  //   filter: `${e.disable ? "brightness(15%)" : ""}`,
                                  // }}
                                  alt="No Image"
                                />
                                {e.image ? (
                                  <div className="landingpagesubsection">
                                    <Typography
                                      noWrap
                                      component="div"
                                      className="subcoursename"
                                      style={{
                                        color: theme ? "#363636" : "#FFFFFF",
                                      }}
                                    >
                                      {e?.CategoryName.charAt(0).toUpperCase() +
                                        e?.CategoryName.slice(1)}
                                    </Typography>
                                  </div>
                                ) : (
                                  ""
                                )}

                                <div
                                  style={{
                                    padding: "10px 0px 0px 10px",
                                  }}
                                >
                                  <span
                                    className="Author"
                                    style={{
                                      color: theme ? "#363636" : "#C8C8C8",
                                    }}
                                  >
                                    Author: {e?.authorname}
                                  </span>
                                  <Box
                                    sx={{
                                      width: 200,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span style={{ marginTop: "4px" }}>
                                      {e?.totalratinng === null
                                        ? 0
                                        : e?.totalratinng?.toFixed(1)}
                                    </span>
                                    <Rating
                                      sx={{ ml: 1 }}
                                      name="read-only"
                                      readOnly
                                      precision={0.5}
                                      value={e?.totalratinng}
                                      className="secondratingcomponent"
                                      emptyIcon={
                                        <StarIcon
                                          style={{ color: "#C4C4C4" }}
                                          fontSize="inherit"
                                        />
                                      }
                                    />
                                    <div
                                      className="rating_text"
                                      style={{
                                        paddingLeft: "10px",
                                        color: theme ? "#363636" : "#C8C8C8",
                                      }}
                                    >
                                      ({e?.views})
                                    </div>
                                  </Box>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* {loaded && instanceRef.current && (
                        <>
                          <Arrow
                            left
                            onClick={(e) => {
                              console.log(
                                "clicked",
                                instanceRef.current,
                                instanceRef.current?.prev()
                              );
                              e.stopPropagation() ||
                                instanceRef.current?.prev();
                            }}
                            disabled={currentSlide === 0}
                          />

                          <Arrow
                            onClick={(e) => {
                              console.log(
                                "clicked",
                                instanceRef.current,
                                instanceRef.current?.next()
                              );
                              e.stopPropagation() ||
                                instanceRef.current?.next();
                              // slider.moveToSlide(slider.details().absoluteSlide - 2)
                            }}
                            disabled={
                              currentSlide ===
                              instanceRef.current.track.details.slides.length -
                                1
                            }
                          />
                        </>
                      )} */}
                      </div>
                    ) : (
                      <>
                        <Slider className="intro-slick" {...settings}>
                          {item?.items?.map((e) => {
                            return (
                              <div
                                style={{ padding: "3px" }}
                                className="intro-slides"
                              >
                                <img
                                  src={`${development}/media/${e.image}`}
                                  // onClick={() => navigate("/coursepageguest")}
                                  onClick={() => handleViewRecentCourses(e)}
                                  className="landingpage_images_home"
                                  // style={{
                                  //   filter: `${e.disable ? "brightness(15%)" : ""}`,
                                  // }}
                                  alt="No Image"
                                />
                                {e.image ? (
                                  <div className="landingpagesubsection">
                                    <Typography
                                      noWrap
                                      component="div"
                                      className="subcoursename"
                                      style={{
                                        color: theme ? "#363636" : "#FFFFFF",
                                      }}
                                    >
                                      {e?.CategoryName.charAt(0).toUpperCase() +
                                        e?.CategoryName.slice(1)}
                                    </Typography>
                                  </div>
                                ) : (
                                  ""
                                )}

                                <div
                                  style={{
                                    padding: "10px 0px 0px 10px",
                                  }}
                                >
                                  <span
                                    className="Author"
                                    style={{
                                      color: theme ? "#363636" : "#C8C8C8",
                                    }}
                                  >
                                    Author: {e?.authorname}
                                  </span>
                                  <Box
                                    sx={{
                                      width: 200,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span style={{ marginTop: "4px" }}>
                                      {e?.totalratinng === null
                                        ? 0
                                        : e?.totalratinng?.toFixed(1)}
                                    </span>
                                    <Rating
                                      sx={{ ml: 1 }}
                                      name="read-only"
                                      readOnly
                                      precision={0.5}
                                      value={e?.totalratinng}
                                      className="secondratingcomponent"
                                      emptyIcon={
                                        <StarIcon
                                          style={{ color: "#C4C4C4" }}
                                          fontSize="inherit"
                                        />
                                      }
                                    />
                                    <div
                                      className="rating_text"
                                      style={{
                                        paddingLeft: "10px",
                                        color: theme ? "#363636" : "#C8C8C8",
                                      }}
                                    >
                                      ({e?.views})
                                    </div>
                                  </Box>
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      </>
                    )}
                  </div>
                )}
              </>
            );
          })}
        </div>
      ) : (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
        >
          <CircularProgress color="inherit" size={60} />
        </Box>
      )}

      <FooterButtons />
    </>
  );
};

export default LandingPage;
