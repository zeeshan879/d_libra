import { Grid } from "@material-ui/core";
import { ArrowBack } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import parse from "html-react-parser";
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
import Next from "../../assests/SVG_Files/New folder/icons/Next.svg";
import Next_dark from "../../assests/SVG_Files/New folder/icons/Next_dark.svg";
import Pin_off from "../../assests/SVG_Files/New folder/icons/Pin_off.svg";
import Pin_on from "../../assests/SVG_Files/New folder/icons/Pin_on.svg";
import Previous from "../../assests/SVG_Files/New folder/icons/Previous.svg";
import Previous_dark from "../../assests/SVG_Files/New folder/icons/Previous_dark.svg";
import { development } from "../../endpoints";
import {
  addContentBookmark,
  showAllBoomark,
} from "../../Redux/Actions/bookmark.action";
import {
  getPostByID,
  udateMetaTags,
} from "../../Redux/Actions/Editor/post.action";
import FooterButtons from "../User/FooterButtons";
import "./EditCourseStructure.css";

import { pinState } from "../../Redux/Actions/auth.action";
import { toast } from "react-toastify";

const DetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { state } = useLocation();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [details, setDetails] = React.useState([]);
  const [tagslength, setTagsLength] = React.useState(true);
  const [bookmark, setBookmark] = React.useState();
  const [showAllBookmark, setShowAllBookmark] = useState([]);
  const [pinstate, setPinState] = useState(false);
  const [transform, setTransform] = React.useState(false);
  const [changeChapter, setChangeChapter] = useState();
  const [previousChapter, setPreviousChapter] = useState();
  const [chapterChange, setChapterChange] = useState(false);

  // console.log("details", details);

  const handleBack = () => {
    navigate(state?.path !== undefined ? state?.path : "/", {
      path: location.pathname,
      search: state?.search,
      state: state?.path?.includes("tagpage")
        ? {
            search: state?.search,
            path: location.pathname,
            previous: state?.previous,
          }
        : state?.path,
      previous: state?.previous,
      search: state?.search,
    });
  };
  const handlePinState = async () => {
    setPinState(!pinstate);
    setTransform(!transform);
    await dispatch(pinState(!pinstate));
  };

  React.useEffect(async () => {
    await dispatch(pinState(pinstate));
  }, []);

  const handleShowAllBookmark = async () => {
    const response = await dispatch(showAllBoomark(role, token));
    setShowAllBookmark(response);
  };

  const nextTopicFilterIndex = details?.all?.map((topic, index) => {
    if (topic.id === Number(params.id)) {
      return details?.all[index + 1];
    }
  });
  const nextTopic = nextTopicFilterIndex?.filter((data) => {
    if (data !== undefined) {
      return data;
    }
  });

  const previousTopicFilterIndex = details?.all?.map((topic, index) => {
    if (topic.id === Number(params.id)) {
      if (index - 1 < 0) {
        return details?.all[details?.all.length - 1];
      } else {
        return details?.all[index - 1];
      }
    }
  });
  const previousTopic = previousTopicFilterIndex?.filter((data) => {
    if (data !== undefined) {
      return data;
    }
  });

  // console.log(previousTopicFilterIndex)
  console.log(previousTopic);

  useEffect(() => {
    const postById = async () => {
      const response = await dispatch(
        getPostByID(
          params?.id,
          role,
          params?.categoryid,
          params?.courseid,
          token
        )
      );

      const nextcategoryResponse = await dispatch(
        getPostByID(
          "",
          "normaluser",
          response?.nextcategory,
          params?.courseid,
          ""
        )
      );
      setChangeChapter(nextcategoryResponse);

      const previouscategoryResponse = await dispatch(
        getPostByID("", "normaluser", response?.previous, params?.courseid, "")
      );
      setPreviousChapter(previouscategoryResponse);

      setDetails(response);
    };

    postById();
    handleShowAllBookmark();
  }, [params, bookmark, state]);

  useEffect(() => {
    details?.post?.tags
      ?.split(",")
      .map((tags, i) => (i <= 2 ? setTagsLength(true) : setTagsLength(false)));
  }, [details]);

  const handleNextMark = () => {
    setPinState(false);
    let hyphenValue = nextTopic[0]?.unique_identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");

    let hyphenValueChapter = changeChapter?.post?.unique_identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");

    const url = `/topic/${hyphenValue}_${nextTopic[0]?.title}/${
      nextTopic[0]?.id
    }/${nextTopic[0]?.Categroyid}/${nextTopic[0]?.courseid}/${
      nextTopic[0]?.meta_description
    }/${nextTopic[0]?.images?.replaceAll("/", "|")}`
      ?.replace(/\s+/g, "-")
      ?.replace("?", "");

    const changeChapterURL = `/topic/${hyphenValueChapter}_${
      changeChapter?.post?.title
    }
    /${changeChapter?.post?.id}/${changeChapter?.post?.Categroyid}/${
      changeChapter?.post?.courseid
    }/${
      changeChapter?.post?.meta_description
    }/${changeChapter?.post?.images?.replaceAll("/", "|")}`
      ?.replace(/\s+/g, "-")
      ?.replace("?", "");

    if (nextTopic?.length === 0) {
      if (changeChapter !== undefined) {
        setChapterChange(true);
        navigate(changeChapterURL, {
          state: { path: state?.path, url: changeChapter?.post },
        });
      }
    } else {
      if (nextTopic[0] !== undefined) {
        setChapterChange(false);
        navigate(url, {
          state: {
            path: state?.path,
            url: nextTopic[0],
          },
        });
      }
    }
  };

  const previousChapterHanler = previousChapter?.all?.map((topic, index) => {
    return previousChapter?.all[previousChapter?.all.length - 1];
  });

  const handlePreviousMark = () => {
    let changeTheChapter = details?.all[0].id === Number(params?.id);
    let hyphenFirstTopic = details?.all[0]?.unique_identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");
    const firstTopic = `/topic/${hyphenFirstTopic}_${details?.all[0]?.title}/${
      details?.all[0]?.id
    }/${details?.all[0]?.Categroyid}/${details?.all[0]?.courseid}/${
      details?.all[0]?.meta_description
    }/${details?.all[0]?.images?.replaceAll("/", "|")}`
      ?.replace(/\s+/g, "-")
      ?.replace("?", "");
    if (details?.all[0] === previousTopic[0]) {
      console.log(3);
      setChapterChange(false);
      navigate(firstTopic, {
        state: { path: state?.path, url: details?.all[0] },
      });
    }

    setPinState(false);
    let hyphenValue = previousTopic[0]?.unique_identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");

    let hyphenValueChapter = previousChapterHanler[0]?.unique_identifier
      ?.toString()
      ?.match(/\d{4}(?=\d{2,3})|\d+/g)
      ?.join("-");

    const previousUrl = `/topic/${hyphenValue}_${previousTopic[0]?.title}/${
      previousTopic[0]?.id
    }/${previousTopic[0]?.Categroyid}/${previousTopic[0]?.courseid}/${
      previousTopic[0]?.meta_description
    }/${previousTopic[0]?.images?.replaceAll("/", "|")}`
      ?.replace(/\s+/g, "-")
      ?.replace("?", "");

    const previousChapterChangeUrl = `/topic/${hyphenValueChapter}_${
      previousChapterHanler[0]?.title
    }/${previousChapterHanler[0]?.id}/${previousChapterHanler[0]?.Categroyid}/${
      previousChapterHanler[0]?.courseid
    }/${
      previousChapterHanler[0]?.meta_description
    }/${previousChapterHanler[0]?.images?.replaceAll("/", "|")}`
      ?.replace(/\s+/g, "-")
      ?.replace("?", "");

    if (changeTheChapter) {
      if (previousChapterHanler[0] !== undefined) {
        setChapterChange(true);
        navigate(previousChapterChangeUrl, {
          state: { path: state?.path, url: previousChapterHanler[0] },
        });
      }
    } else {
      if (previousTopic[0] !== undefined) {
        setChapterChange(false);
        navigate(previousUrl, {
          state: { path: state?.path, url: previousTopic[0] },
        });
      }
    }
  };

  const hanldeBookMarkPriority = async () => {
    const response = await dispatch(
      addContentBookmark(params?.id, role, token)
    );
    setBookmark(response);
    !token &&
      Swal.fire({
        title: "Unauthenticated",
        text: "Please login to bookmark",
        iconColor: "red",
        icon: "error",
      });
  };

  const handleTag = (tag) => {
    navigate(`/tagpage/${tag.replace(/\s+/g, "-")}`, {
      state: {
        search: tag.trim(),
        path: `${location.pathname}${location.search}`,
        previous: state?.path,
      },
    });
  };

  return (
    <>
      {chapterChange &&
        toast.info("Chapter Changed", {
          position: "bottom-center",
          toastId: "",
        })}
      <div
        style={{ position: pinstate ? "fixed" : "", top: pinstate ? "0" : "" }}
      >
        <div className="detailpage_root_container ">
          {role === "editor" && (
            <div className="backbutton_disable">
              <button
                onClick={handleBack}
                className="back_button"
                style={{ color: "#FFFFFF " }}
              >
                <ArrowBack className="backbutton_icon" />{" "}
                <span className="backbutton_text">Back</span>
              </button>
            </div>
          )}
          <span
            className={
              role === "editor" ? "header_text" : "header_text_NormalUser"
            }
          >
            {state?.url !== undefined
              ? state?.url?.title
              : details?.post?.title !== undefined &&
                details?.post?.title?.charAt(0)?.toUpperCase() +
                  details?.post?.title?.slice(1)}
          </span>
        </div>
        {details?.status ? (
          <div>
            <Grid container>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <div
                  className="detailpagesubcontainertwo"
                  style={{
                    transition: "transform .2s",
                    transform: transform && "scale(97%)",
                    padding: `${pinstate ? "0px 0px" : "10px 10px"}`,
                  }}
                >
                  <img
                    src={
                      state?.url !== undefined
                        ? `${development}/media/${state?.url?.images}`
                        : `${development}/media/${details?.post?.images}`
                    }
                    alt=""
                    className={
                      pinstate ? "detail_page_image_two" : "detail_page_image"
                    }
                  />
                </div>

                <div
                  className={
                    role === "normaluser"
                      ? "buttons_container_detail_page_two_two"
                      : "buttons_container_detail_page_two"
                  }
                >
                  <div className="deleteeditcontainer">
                    {role === "editor" && (
                      <>
                        <div className="subcontainerdelete">
                          <button
                            className="detail_delete_button"
                            onClick={() =>
                              navigate(
                                `/delete/${params?.identifier_name}/${params.id}/${params.categoryid}/${params.courseid}/${params.meta}/${params.img}`,
                                { state: { path: state?.path } }
                              )
                            }
                          >
                            Delete
                          </button>
                          <button
                            className="detail_edit_button"
                            onClick={() =>
                              navigate(
                                `/edit/${params?.identifier_name}/${params.id}/${params.categoryid}/${params.courseid}/${params.meta}/${params.img}`,
                                { state: state?.path }
                              )
                            }
                          >
                            Edit
                          </button>
                        </div>

                        <div className="displayFlexForTags">
                          {tagslength && (
                            <div className="tags_wrapper_three">
                              {details?.post?.tags !== "" ? (
                                <>
                                  <span
                                    className="detail_tag_text"
                                    style={{
                                      color: theme ? " #363636" : " #C8C8C8",
                                    }}
                                  >
                                    Tag:
                                  </span>
                                  {details?.post?.tags
                                    ?.split(",")
                                    ?.map((tag) => (
                                      <button
                                        className="detail_tag_button"
                                        onClick={() => handleTag(tag)}
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                </>
                              ) : null}
                            </div>
                          )}

                          {token ? ( // Bookmark For Editor
                            <img
                              src={
                                details?.bookmark === null
                                  ? Bookmark_grey
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[0]?.name
                                  ? Bookmark_blue
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[1]?.name
                                  ? Bookmark_green
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[2]?.name
                                  ? Bookmark_red
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[3]?.name
                                  ? Bookmark_yellow
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[4]?.name
                                  ? Green_Bookmark
                                  : details?.bookmark === "null"
                                  ? Bookmark_grey
                                  : Bookmark_grey
                              }
                              alt=""
                              className="detail_tag_text_two"
                              style={{
                                paddingLeft: "42px",
                                cursor: "pointer",
                                height: "24px",
                                width: "65px",
                              }}
                              onClick={hanldeBookMarkPriority}
                            />
                          ) : (
                            <img
                              src={Bookmark_grey}
                              alt=""
                              className="detail_tag_text_two"
                              style={{ paddingLeft: "24px", cursor: "pointer" }}
                              onClick={hanldeBookMarkPriority}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {role === "normaluser" || role === null ? (
                  <>
                    <div className="normaluser_container">
                      <div className="displayFlexForTags">
                        <span
                          className="detail_tag_text"
                          style={{ color: theme ? " #363636" : " #C8C8C8" }}
                        >
                          Tag:
                        </span>
                        {details?.post?.tags?.split(",")?.map((tag) => (
                          <button
                            className="detail_tag_button"
                            onClick={() => handleTag(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                        {/*  Normal User Bookmark For PC */}
                        {token ? (
                          <img
                            src={
                              details?.bookmark === null
                                ? Bookmark_grey
                                : details?.bookmark?.PriorityType ===
                                  showAllBookmark[0]?.name
                                ? Bookmark_blue
                                : details?.bookmark?.PriorityType ===
                                  showAllBookmark[1]?.name
                                ? Bookmark_green
                                : details?.bookmark?.PriorityType ===
                                  showAllBookmark[2]?.name
                                ? Bookmark_red
                                : details?.bookmark?.PriorityType ===
                                  showAllBookmark[3]?.name
                                ? Bookmark_yellow
                                : details?.bookmark?.PriorityType ===
                                  showAllBookmark[4]?.name
                                ? Green_Bookmark
                                : details?.bookmark === "null"
                                ? Bookmark_grey
                                : Bookmark_grey
                            }
                            alt=""
                            className="detail_tag_text_two"
                            style={{
                              marginLeft: "10px",
                              marginTop: "7px",
                              cursor: "pointer",
                              height: "18px",
                              width: "18px",
                            }}
                            onClick={hanldeBookMarkPriority}
                          />
                        ) : (
                          <img
                            src={Bookmark_grey}
                            alt=""
                            className="detail_tag_text_two"
                            style={{
                              marginLeft: "10px",
                              marginTop: "7px",
                              cursor: "pointer",
                              height: "18px",
                              width: "18px",
                            }}
                            onClick={hanldeBookMarkPriority}
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
                {role === "editor" && !tagslength ? (
                  <div className="tags_wrapper_one">
                    {details?.post?.tags !== "" ? (
                      <>
                        <span
                          className="detail_tag_text"
                          style={{ color: theme ? " #363636" : " #C8C8C8" }}
                        >
                          Tag:
                        </span>
                        {details?.post?.tags?.split(",")?.map((tag) => (
                          <button
                            className="detail_tag_button"
                            onClick={() => handleTag(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <div
                  className="detail_page_content"
                  style={{
                    display: role === "normaluser" ? "none" : "block",
                  }}
                >
                  <div className="scrollable">
                    <span style={{ lineHeight: "35px" }}>
                      <div className={theme ? "contentOne" : "contentTwo"}>
                        {state?.url !== undefined ? (
                          <>
                            {parse(
                              state?.url?.content?.replace(/\&nbsp;/g, "")
                            )}
                          </>
                        ) : (
                          <>
                            {parse(
                              details?.post?.content?.replace(/\&nbsp;/g, "")
                            )}
                          </>
                        )}
                      </div>
                    </span>
                  </div>
                </div>

                {/* Bookmark For Normaluser Mobile View */}

                {role !== "editor" && (
                  <>
                    <div style={{ position: "relative" }}>
                      <div
                        className={
                          pinstate ? "pincontainertwo" : "pincontainer"
                        }
                      >
                        <button
                          style={{
                            marginRight: `${pinstate ? "" : "15px"}`,
                            background: "none",
                            border: "none",
                          }}
                        >
                          {token ? (
                            <img
                              src={
                                details?.bookmark === null
                                  ? Bookmark_grey
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[0]?.name
                                  ? Bookmark_blue
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[1]?.name
                                  ? Bookmark_green
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[2]?.name
                                  ? Bookmark_red
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[3]?.name
                                  ? Bookmark_yellow
                                  : details?.bookmark?.PriorityType ===
                                    showAllBookmark[4]?.name
                                  ? Green_Bookmark
                                  : details?.bookmark === "null"
                                  ? Bookmark_grey
                                  : Bookmark_grey
                              }
                              alt=""
                              className="userdetailpinimage"
                              style={
                                pinstate
                                  ? {
                                      paddingLeft: "40px",
                                      cursor: "pointer",
                                      height: "24px",
                                      width: "65px",
                                    }
                                  : {
                                      paddingLeft: "24px",
                                      cursor: "pointer",
                                      height: "24px",
                                      width: "40px",
                                    }
                              }
                              onClick={hanldeBookMarkPriority}
                            />
                          ) : (
                            <img
                              src={Bookmark_grey}
                              alt=""
                              style={
                                pinstate
                                  ? {
                                      position: "relative",
                                      width: "17px",
                                      top: "-10px",
                                      left: "0px",
                                    }
                                  : {
                                      paddingLeft: "24px",
                                      cursor: "pointer",
                                      height: "30px",
                                      width: "40px",
                                    }
                              }
                              // className="userdetailpinimage"
                              // style={{ position: 'relative' width: '20px', top: '-2px'}}
                              onClick={hanldeBookMarkPriority}
                            />
                          )}
                        </button>
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={handlePinState}
                        >
                          <img
                            className="userdetailpinimage"
                            style={{
                              marginRight: `${
                                pinstate
                                  ? role === "normaluser"
                                    ? "-40px"
                                    : "0px"
                                  : "0px"
                              }`,
                              marginTop: `${
                                pinstate
                                  ? role === "normaluser"
                                    ? "0px"
                                    : "-40px"
                                  : "0px"
                              }`,
                              cursor: "pointer",
                            }}
                            src={pinstate ? Pin_on : Pin_off}
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Mobile View Excluding Bookmarks And Pin Icon For Both Normal User and Null User*/}

                {role === "normaluser" || role === null ? (
                  <>
                    <div className="bookmark_normaluser_null_tablet">
                      {token ? (
                        <img
                          src={
                            details?.bookmark === null
                              ? Bookmark_grey
                              : details?.bookmark?.PriorityType ===
                                showAllBookmark[0]?.name
                              ? Bookmark_blue
                              : details?.bookmark?.PriorityType ===
                                showAllBookmark[1]?.name
                              ? Bookmark_green
                              : details?.bookmark?.PriorityType ===
                                showAllBookmark[2]?.name
                              ? Bookmark_red
                              : details?.bookmark?.PriorityType ===
                                showAllBookmark[3]?.name
                              ? Bookmark_yellow
                              : details?.bookmark?.PriorityType ===
                                showAllBookmark[4]?.name
                              ? Green_Bookmark
                              : details?.bookmark === "null"
                              ? Bookmark_grey
                              : Bookmark_grey
                          }
                          alt=""
                          className="detail_tag_text_two"
                          style={{
                            paddingLeft: "24px",
                            cursor: "pointer",
                            height: "24px",
                            width: "65px",
                          }}
                          onClick={hanldeBookMarkPriority}
                        />
                      ) : (
                        <img
                          src={Bookmark_grey}
                          alt=""
                          className="detail_tag_text_two"
                          style={{ paddingLeft: "24px", cursor: "pointer" }}
                          onClick={hanldeBookMarkPriority}
                        />
                      )}
                    </div>
                    <div
                      className={
                        role === "normaluser"
                          ? "detail_page_content"
                          : "detail_page_content_fornull"
                      }
                      style={{
                        height: `${pinstate ? "50vh" : "100%"}`,
                        paddingLeft: "24px",
                        overflow: `${pinstate ? "scroll" : "auto"}`,
                      }}
                    >
                      <span style={{ lineHeight: "35px" }}>
                        <div className={theme ? "contentOne" : "contentTwo"}>
                          {state?.url !== undefined ? (
                            <>
                              {parse(
                                state?.url?.content?.replace(/\&nbsp;/g, "")
                              )}
                            </>
                          ) : (
                            <>
                              {parse(
                                (details?.post?.content).replace(/\&nbsp;/g, "")
                              )}
                            </>
                          )}
                        </div>

                        <div
                          className={
                            pinstate
                              ? "tags_for_user_null_pin"
                              : "tags_for_user_null"
                          }
                        >
                          {details?.post?.tags !== "" ? (
                            <>
                              <div className="displayFlexForTags">
                                <span
                                  className="detail_tag_text"
                                  style={{
                                    color: theme ? " #363636" : " #C8C8C8",
                                  }}
                                >
                                  Tag:
                                </span>
                                {details?.post?.tags?.split(",")?.map((tag) => (
                                  <button
                                    className="detail_tag_button"
                                    onClick={() => handleTag(tag)}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="noscrollable">
                    <span style={{ lineHeight: "35px" }}>
                      <div className={theme ? "contentOne" : "contentTwo"}>
                        {state?.url !== undefined ? (
                          <>
                            {parse(
                              state?.url?.content?.replace(/\&nbsp;/g, "")
                            )}
                          </>
                        ) : (
                          <>
                            {parse(
                              details?.post?.content?.replace(/\&nbsp;/g, "")
                            )}
                          </>
                        )}
                      </div>
                    </span>
                  </div>
                )}

                {/* Tags For Editor Role */}

                {role === "editor" && (
                  <div className="tags_wrapper_two">
                    {details?.post?.tags !== "" ? (
                      <>
                        <div className="displayFlexForTags">
                          <span
                            className="detail_tag_text"
                            style={{ color: theme ? " #363636" : " #C8C8C8" }}
                          >
                            Tag:
                          </span>
                          {details?.post?.tags?.split(",")?.map((tag) => (
                            <button
                              className="detail_tag_button"
                              onClick={() => handleTag(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <CircularProgress color="inherit" size={30} />
          </Box>
        )}

        {theme ? (
          <div className="detailpagebuttoncontainer">
            <div className="detailpagebuttoncontainertwo">
              <div className="footerbuttoncontainer">
                {/* <Button
                  style={{ marginLeft: "16px" }}
                // disabled={startdata === 0 ? true : false}
                > */}
                <img
                  src={Previous}
                  alt=""
                  style={{ marginRight: "-15px", cursor: "pointer" }}
                  className="userdetailfootericons userdetailfootericonsleft"
                  onClick={handlePreviousMark}
                />
                {/* </Button> */}
                {/* <Button style={{ marginLeft: "-16px" }}> */}
                <img
                  src={Next}
                  alt=""
                  style={{ marginleft: "15px", cursor: "pointer" }}
                  className="userdetailfootericons userdetailfootericonsright"
                  onClick={handleNextMark}
                />
                {/* </Button> */}

                <span
                  className="userdetailpagefootertexttwo"
                  style={theme ? { color: "black" } : { color: "white" }}
                >
                  © D-Libra All Rights Reserved
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="detailpagebuttoncontainedark">
            <div className="detailpagebuttoncontainerdarksub">
              <div className="footerbuttoncontainer">
                {/* <Button */}
                {/* style={{ marginLeft: "16px" }}
                > */}
                <img
                  src={Previous_dark}
                  alt=""
                  style={{ marginRight: "-15px", cursor: "pointer" }}
                  className="userdetailfootericons userdetailfootericonsleft"
                  onClick={handlePreviousMark}
                />
                {/* </Button> */}

                {/* <Button style={{ marginLeft: "-16px" }} disabled={disable}> */}
                <img
                  src={Next_dark}
                  alt=""
                  style={{ marginleft: "15px", cursor: "pointer" }}
                  className="userdetailfootericons userdetailfootericonsright"
                  onClick={handleNextMark}
                />
                <span
                  className="userdetailpagefootertexttwo"
                  style={theme ? { color: "black" } : { color: "white" }}
                >
                  © D-Libra All Rights Reserved
                </span>
                {/* </Button> */}
              </div>
            </div>
          </div>
        )}
        <FooterButtons />
      </div>
    </>
  );
};

export default DetailPage;
