import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import Member_Icon from "../../assests/SVG_Files/Member_Icon.svg";
import { ArrowBack } from "@mui/icons-material";
import { useSelector } from "react-redux";
import "./UserSettingViewPage.css";
import { profileData, updateProfile } from "../../Redux/Actions/Profile.action";
import { useDispatch } from "react-redux";
import Add_dark from "../../assests/SVG_Files/New folder/Add_dark.svg";
import Add_light from "../../assests/SVG_Files/New folder/Add_light.svg";
import Bookmark_green from "../../assests/SVG_Files/New folder/Bookmark_green.svg";
import Bookmark_blue from "../../assests/SVG_Files/New folder/Bookmark_blue.svg";
import Bookmark_red from "../../assests/SVG_Files/New folder/Bookmark_red.svg";
import Bookmark_yellow from "../../assests/SVG_Files/New folder/Bookmark_yellow.svg";
import Green_Bookmark from "../../assests/SVG_Files/New folder/Green_Bookmark.svg";
import Bookmark_grey from "../../assests/SVG_Files/New folder/Bookmark_gray.svg";

import FooterButtons from "./FooterButtons";
import Editor_icon_dark from "../../assests/SVG_Files/New/Editor_icon_dark.svg";
import Editor_icon_light from "../../assests/SVG_Files/New/Editor_icon_light.svg";
import { development } from "../../endpoints";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { logout } from "../../Redux/Actions/auth.action";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { home } from "../../Redux/Actions/Client Side/home.action";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import user_svg from "../../assests/SVG_Files/New folder/user.svg";
import user_svg_white from "../../assests/SVG_Files/New folder/user_svg_white.svg";
// import logoutUser from "../../assests/SVG_Files/New folder/logout.svg";
import Modal from "react-modal";

import {
  addBookmark,
  deleteBookmark,
  EditBookmark,
  showAllBoomark,
} from "../../Redux/Actions/bookmark.action";
import { toast } from "react-toastify";

const UserSettingViewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.state);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const currentUser = useSelector((state) => state.auth);

  const [username, setUsername] = useState();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validation, setValidation] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addBookMark, setAddBookMark] = useState([]);
  const [bookmarkName, setBookmarkName] = useState("");
  const [deleteTheBookmark, setDeleteTheBookmark] = useState("");

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalColorCode, setModalColorCode] = React.useState();
  const [bookmarkValue, setBookmarkValue] = React.useState();
  const [bookmark, setBookmark] = React.useState();
  const [useEffectOnUpdate, setuseEffectOnUpdate] = React.useState(false);
  const [addBookmarkIconShow, setAddBookmarkIconShow] = useState(true);
  const user = useSelector((state) => state?.auth?.profile);
  const userProfile = useSelector((state) => state?.auth);

  const [inputFields, setInputFields] = useState([]);
  console.log("bookmark", bookmark);

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#333333",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      color: "white",
      transform: "translate(-50%, -50%)",
      backgroundColor: "black",
    },
  };

  const customStylesLightTheme = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#F3F6FF",
      boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#F3F6FF",
      color: "black",
      border: "1px solid black",
      boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    },
  };

  const openModal = (index, colorCode) => {
    setModalColorCode(colorCode);
    setIsOpen(true);

    const bookmarkName = addBookMark?.filter((bookmark, i) => {
      if (index === i) {
        return bookmark;
      }
    });
    console.log("bookmarkName", bookmarkName);
    console.log("bookmarkName", index, colorCode);
    setBookmark(bookmarkName[0]);
    setBookmarkValue(bookmarkName[0].name);
  };

  const colorCodes = [
    "#C8C8C8",
    "#006AE1",
    "#119ABD",
    "#DE4040",
    "#FFAA1D",
    "#39B54A",
  ];

  const addInputField = () => {
    setBookmarkName("");
    setAddBookmarkIconShow(false);
    var resultArr = colorCodes.filter((color) => {
      return !addBookMark.find((code) => {
        return color === code.colorcode;
      });
    });

    console.log(resultArr);
    console.log(resultArr?.shift());
    setInputFields([
      ...inputFields,
      {
        colorcode: resultArr?.shift(),
      },
    ]);
  };
  console.log(inputFields);
  // console.log(addBookMark);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setMessage("");
  }

  const handleBack = () => {
    navigate("/");
  };

  const handleEditBookmark = async (bookmark) => {
    // console.log("bookmark", bookmark);
    const response = await dispatch(
      EditBookmark(bookmark.id, bookmarkValue, role, token)
    );
    // console.log("EditBookmark Bookmark", response);
    setMessage(response?.message);
  };

  const handleShowAllBookmark = async () => {
    const response = await dispatch(showAllBoomark(role, token));
    // console.log(response);
    setAddBookMark(response);
  };

  const userData = async () => {
    const response = await dispatch(profileData(role, token));
    console.log(response);
    setUsername(response?.data?.username);
    setEmail(response?.data?.email);
    setFirstName(response?.data?.fname);
    setLastName(response?.data?.lname);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await dispatch(
      updateProfile(firstName, lastName, imageName, role, token, auth)
    );
    // console.log("response", response);
    setMessage(response?.message);
    setValidation(true);
    const timer = setTimeout(() => {
      setValidation(false);
      setMessage("");
    }, 5000);
    setIsLoading(false);
    return () => clearTimeout(timer);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    navigate("/changepassword");
  };

  const handleChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageName(e.target.files[0]);
    if (imageName.name !== "") {
      setShowImage(true);
    }
  };

  const handleLogout = async () => {
    const response = await dispatch(logout(role, token));
    response?.message === "logout successfully" && navigate("/logout");
    !token && navigate("/login");
  };

  const hanldeAddCustomPriority = async (color) => {
    setuseEffectOnUpdate(true);
    let bookmarkArray = [];

    bookmarkArray.push({
      colorcode: color,
      bookmarkname: bookmarkName,
    });

    // console.log("bookmarkArray", bookmarkArray);
    const response = await dispatch(addBookmark(bookmarkArray, role, token));
    // console.log("response", response);
    setMessage(response?.message);
    if (response?.message === "Add successfully") {
      setMessage("");
      setInputFields([]);
      setAddBookmarkIconShow(true);
    }
  };

  const handleDeleteBookmark = async (id) => {
    const response = await dispatch(deleteBookmark(role, id, token));
    // console.log("response", response);
    setMessage(response?.message);
    setDeleteTheBookmark(response);
  };

  useEffect(() => {
    userData();
    handleShowAllBookmark();
  }, [deleteTheBookmark, modalIsOpen, useEffectOnUpdate, message]);

  return (
    <div>
      {message === "All bookmarks already exist"
        ? toast.info("Bookmark already exists", {
            position: "top-center",
            toastId: "",
          })
        : message === "Add successfully"
        ? toast.success("Bookmark added successfully", {
            position: "top-center",
            toastId: "",
          })
        : message === "Delete successfully"
        ? toast.success("Bookmark deleted successfully", {
            position: "top-center",
            toastId: "",
          })
        : null}
      <button
        onClick={handleBack}
        className="back_button"
        style={{ color: `${theme ? " #363636" : " #FFFFFF"}` }}
      >
        <ArrowBack className="backbutton_icon" />{" "}
        <span className="backbutton_text">Back</span>
      </button>

      <div className="user_container_root">
        <div className="user_sub_root_container">
          <div
            className={
              theme ? "user_root_container" : "user_root_container_two"
            }
          >
            {user !== null ? (
              <img
                src={
                  showImage
                    ? image
                    : userProfile?.profile?.includes("dummy") && theme
                    ? user_svg
                    : userProfile?.profile?.includes("dummy") && theme === false
                    ? user_svg_white
                    : `${development}/${user}`
                }
                alt="No Image"
                style={{ borderRadius: "50%" }}
                className="usersettingmembericon"
              />
            ) : (
              // <AccountCircleOutlinedIcon
              //   style={{ borderRadius: "50%" }}
              //   className="usersettingmembericon"
              // />

              <img
                src={theme ? user_svg : user_svg_white}
                alt="No Image"
                style={{ borderRadius: "50%" }}
                className="usersettingmembericon"
              />
            )}
            <div className="user_header_container">
              <div
                className="vector_container vectorcontainermobile"
                style={{ color: `${theme ? "#009AF9" : "#C8C8C8"}` }}
              >
                {theme && role === "editor" ? (
                  <img
                    src={Editor_icon_light}
                    alt=""
                    className="editoricon_image"
                  />
                ) : (
                  role === "editor" && (
                    <img
                      src={Editor_icon_dark}
                      alt=""
                      className="editoricon_image_two"
                    />
                  )
                )}
                <span
                  className={
                    theme ? " editorimage_icon" : "  editorimage_icon_two"
                  }
                >
                  {role === "editor"
                    ? currentUser?.username?.charAt(0)?.toUpperCase() +
                      currentUser?.username?.slice(1)
                    : role === "normaluser"
                    ? `${firstName} ${lastName}`?.charAt(0)?.toUpperCase() +
                      `${firstName} ${lastName}`?.slice(1)
                    : "User"}

                  {/* {!firstName || !lastName
                    ? "user"
                    : role === "editor"
                    ? "Editor"
                    : `${firstName} ${lastName}`} */}
                </span>
              </div>
              <div>
                <label htmlFor="contained-button-file">
                  <input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleChange(e)}
                  />
                  <Button
                    component="span"
                    className={
                      theme ? "user_update_button_sub" : "user_update_button"
                    }
                    onChange={(e) => handleChange(e)}
                  >
                    Update Icon
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <div className="userinputfieldmaincontainer">
            {validation ? (
              firstName && lastName !== "" ? (
                message ? (
                  message === "Update Successfully" ? (
                    <div
                      className={theme ? "successMessage" : "successMessageTwo"}
                    >
                      {message}
                    </div>
                  ) : (
                    <div className="errorMessage">{message}</div>
                  )
                ) : null
              ) : (
                <div className="errorMessage">Feilds cannot be empty!</div>
              )
            ) : null}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                className="addcategory_text_bookmark_two"
                style={{ color: `${theme ? "#363636" : "white"}` }}
              >
                Username
              </span>
              <input
                className={
                  theme
                    ? "usersetting_inputfield_light"
                    : "usersetting_inputfield_dark"
                }
                placeholder="Username"
                value={username}
              />
            </div>
            <div className="emailaddresscontainer">
              <span
                className="addcategory_text_bookmark_two"
                style={{ color: `${theme ? "#363636" : "white"}` }}
              >
                E-mail Address
              </span>
              <input
                className={
                  theme
                    ? "usersetting_inputfield_light"
                    : "usersetting_inputfield_dark"
                }
                placeholder="E-mail Address"
                value={email}
              />
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="first_name_container"
          >
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "white"}` }}
            >
              First Name
            </span>
            <input
              className={
                theme
                  ? "usersetting_inputfield_light"
                  : "usersetting_inputfield_dark"
              }
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: "20px",
            }}
          >
            <span
              className="addcategory_text"
              style={{ color: `${theme ? "#363636" : "white"}` }}
            >
              Last Name
            </span>
            <input
              className={
                theme
                  ? "usersetting_inputfield_light"
                  : "usersetting_inputfield_dark"
              }
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="user_bookmark_container">
          <div className="hidden_user_input">
            <span
              className="addcategory_text_bookmark"
              style={{ color: `${theme ? "#363636" : "white"}` }}
            >
              Bookmark Name
            </span>
            <div className="vector_container">
              <div className="vector_image">
                <img
                  src={Bookmark_blue}
                  alt=""
                  className="tagimageusersettingpage"
                />
              </div>
              <input
                className={
                  theme ? "profile_sub_input" : "profile_sub_input_two"
                }
                placeholder="High Priority Review List"
              />
            </div>
          </div>
          <span
            className="addcategory_text_bookmark"
            style={{
              color: `${theme ? "#363636" : "white"}`,
              marginTop: "20px",
              marginBottom: "-5px",
            }}
          >
            Bookmark Name
          </span>

          {addBookMark?.length === 0 ? (
            <h6 style={{ marginTop: "20px" }}>No Bookmark to show. Add One</h6>
          ) : (
            <>
              {addBookMark?.map((bookmark, index) => {
                // console.log("bookmark", bookmark);
                return (
                  <div className="vector_container_deletefield">
                    <div className="vector_image">
                      <img
                        src={
                          bookmark.colorcode === "#006AE1"
                            ? Bookmark_blue
                            : bookmark.colorcode === "#119ABD"
                            ? Bookmark_green
                            : bookmark.colorcode === "#DE4040"
                            ? Bookmark_red
                            : bookmark.colorcode === "#FFAA1D"
                            ? Bookmark_yellow
                            : bookmark.colorcode === "#39B54A" && Green_Bookmark
                        }
                        alt=""
                        className="tagimageusersettingpage"
                      />
                    </div>
                    <input
                      className={
                        theme ? "profile_sub_input" : "profile_sub_input_two"
                      }
                      value={bookmark?.name}
                    />
                    <Tooltip title="Delete" placement="top">
                      <IconButton>
                        <DeleteOutlinedIcon
                          fontSize="medium"
                          color="error"
                          style={{ marginLeft: "20px", cursor: "pointer" }}
                          onClick={() => handleDeleteBookmark(bookmark?.id)}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eidt" placement="top">
                      <IconButton>
                        <EditIcon
                          fontSize="medium"
                          // color="error"
                          onClick={() => openModal(index, bookmark?.colorcode)}
                          style={
                            bookmark.colorcode === "#006AE1"
                              ? {
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                  color: "#006AE1",
                                }
                              : bookmark.colorcode === "#119ABD"
                              ? {
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                  color: "#119ABD",
                                }
                              : bookmark.colorcode === "#DE4040"
                              ? {
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                  color: "#DE4040",
                                }
                              : bookmark.colorcode === "#FFAA1D"
                              ? {
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                  color: "#FFAA1D",
                                }
                              : bookmark.colorcode === "#39B54A" && {
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                  color: "#39B54A",
                                }
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              })}
            </>
          )}

          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={theme ? customStylesLightTheme : customStyles}
            contentLabel="Example Modal"
          >
            <>
              <h1 style={{ textAlign: "center" }}>Edit Bookamrk</h1>
              <div style={{ marginTop: "10px" }}>
                {message === "Update successfully"
                  ? toast.success("Bookmark updated successfully", {
                      position: "top-center",
                      toastId: "",
                    })
                  : message === "All Fields are Required"
                  ? toast.error("Bookmarkname is required", {
                      position: "top-center",
                      toastId: "",
                    })
                  : null}
              </div>
              <div
                className="vector_container"
                style={{ marginTop: "20px", marginRight: "20px" }}
              >
                <div className="vector_image">
                  <img
                    src={
                      modalColorCode === "#006AE1"
                        ? Bookmark_blue
                        : modalColorCode === "#119ABD"
                        ? Bookmark_green
                        : modalColorCode === "#DE4040"
                        ? Bookmark_red
                        : modalColorCode === "#FFAA1D"
                        ? Bookmark_yellow
                        : modalColorCode === "#39B54A" && Green_Bookmark
                    }
                    alt=""
                    className="tagimageusersettingpage"
                  />
                </div>

                <input
                  className={
                    theme ? "profile_sub_input" : "profile_sub_input_two"
                  }
                  placeholder="Add Your Custom Bookmark"
                  value={bookmarkValue}
                  onChange={(e) => setBookmarkValue(e.target.value)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  size="small"
                  style={
                    modalColorCode === "#006AE1"
                      ? {
                          backgroundColor: "#006AE1",
                          borderRadius: "10px",
                          padding: "3px 30px",
                          border: "1px solid black",
                          color: "white",
                        }
                      : modalColorCode === "#119ABD"
                      ? {
                          backgroundColor: "#119ABD",
                          borderRadius: "10px",
                          padding: "3px 30px",
                          border: "1px solid black",
                          color: "white",
                        }
                      : modalColorCode === "#DE4040"
                      ? {
                          backgroundColor: "#DE4040",
                          borderRadius: "10px",
                          padding: "3px 30px",
                          border: "1px solid black",
                          color: "white",
                        }
                      : modalColorCode === "#FFAA1D"
                      ? {
                          backgroundColor: "#FFAA1D",
                          borderRadius: "10px",
                          padding: "3px 30px",
                          border: "1px solid black",
                          color: "white",
                        }
                      : modalColorCode === "#39B54A" && {
                          backgroundColor: "#39B54A",
                          borderRadius: "10px",
                          padding: "3px 30px",
                          border: "1px solid black",
                          color: "white",
                        }
                  }
                  onClick={() => handleEditBookmark(bookmark)}
                >
                  Update
                </Button>
              </div>
            </>
          </Modal>

          {inputFields?.map((feild, index) => {
            return (
              <>
                <div className="vector_container inputFeild">
                  <div className="vector_image">
                    <img
                      src={
                        feild.colorcode === "#006AE1"
                          ? Bookmark_blue
                          : feild.colorcode === "#119ABD"
                          ? Bookmark_green
                          : feild.colorcode === "#DE4040"
                          ? Bookmark_red
                          : feild.colorcode === "#FFAA1D"
                          ? Bookmark_yellow
                          : feild.colorcode === "#39B54A"
                          ? Green_Bookmark
                          : Bookmark_grey
                      }
                      alt=""
                      className="tagimageusersettingpage"
                    />
                  </div>

                  <input
                    className={
                      theme ? "profile_sub_input" : "profile_sub_input_two"
                    }
                    placeholder="Add Your Custom Bookmark"
                    value={bookmarkName}
                    onChange={(e) => setBookmarkName(e.target.value)}
                  />
                  <Tooltip title="Cancel" placement="top">
                    <ClearIcon
                      className="cancelIcon"
                      onClick={() => {
                        setInputFields([]);
                        setAddBookmarkIconShow(true);
                      }}
                    />
                  </Tooltip>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    size="small"
                    style={{
                      backgroundColor:
                        feild.colorcode === "#006AE1"
                          ? "#006AE1"
                          : feild.colorcode === "#119ABD"
                          ? "#119ABD"
                          : feild.colorcode === "#DE4040"
                          ? "#DE4040"
                          : feild.colorcode === "#FFAA1D"
                          ? "#FFAA1D"
                          : feild.colorcode === "#39B54A"
                          ? "#39B54A"
                          : "#C8C8C8",
                      borderRadius: "50px",
                      color: "white",
                    }}
                    onClick={() =>
                      hanldeAddCustomPriority(
                        feild.colorcode === "#006AE1"
                          ? "#006AE1"
                          : feild.colorcode === "#119ABD"
                          ? "#119ABD"
                          : feild.colorcode === "#DE4040"
                          ? "#DE4040"
                          : feild.colorcode === "#FFAA1D"
                          ? "#FFAA1D"
                          : feild.colorcode === "#39B54A" && "#39B54A"
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </>
            );
          })}

          {addBookMark?.length < 5 && addBookmarkIconShow ? (
            <div className="vector_container" style={{ marginTop: "20px" }}>
              <img
                src={theme ? Add_light : Add_dark}
                alt=""
                className="addiconcontainer"
                style={{ cursor: "pointer" }}
                // onClick={hanldeAddBookmark}
                onClick={() => addInputField(addBookMark?.length)}
              />

              <input
                className={
                  theme ? "profile_sub_input" : "profile_sub_input_two"
                }
                placeholder="For future need"
                style={{ visibility: "hidden" }}
              />
            </div>
          ) : null}

          <div className="vector_image"></div>
        </div>
      </div>

      <div className="user_buttons_container" style={{ paddingBottom: "20px" }}>
        <Button
          variant="contained"
          className="user_buttons"
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
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
            onClick={handleUpdateProfile}
          >
            Update
          </Button>
        )}

        {token && (
          <Button
            variant="contained"
            className="user_buttons"
            onClick={handleLogout}
          >
            Log out
          </Button>
        )}
      </div>
      <FooterButtons />
    </div>
  );
};

export default UserSettingViewPage;
