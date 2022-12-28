import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Rating from "../assests/Rating.png";
import "./Sidebar.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useDispatch, useSelector } from "react-redux";
import { logout, themeSwitch } from "../Redux/Actions/auth.action";
import Member_Icon from "../assests/SVG_Files/Member_Icon.svg";
import { useLocation } from "react-router-dom";
import UnionClose from "../assests/UnionClose.png";
import UnionBlue from "../assests/UnionBlue.png";
import Arrow_white from "../assests/Arrow_white.png";
import editor_icon from "../assests/SVG_Files/editor_icon.svg";
import darkmode_logo from "../assests/SVG_Files/New folder/darkmode_logo.svg";
import lightmode_logo from "../assests/SVG_Files/New folder/lightmode_logo.svg";
import Sidebar_My_library from "../assests/SVG_Files/New folder/icons/Sidebar_My_library.svg";
import Sidebar_Signup from "../assests/SVG_Files/New folder/icons/Sidebar_Signup.svg";
import Sidebar_Login from "../assests/SVG_Files/New folder/icons/Sidebar_Login.svg";
import Sidebar_Logout from "../assests/SVG_Files/New folder/icons/Sidebar_Logout.svg";
import Sidebar_EditorPage from "../assests/SVG_Files/New folder/icons/Sidebar_EditorPage.svg";
import Sidebar_NightMode from "../assests/SVG_Files/New folder/icons/Sidebar_NightMode.svg";
import Accordian from "./Guest/Accordian/Accordian";
import Recent_view_dark from "../assests/SVG_Files/Recent_view_dark.svg";
import Search_dark from "../assests/SVG_Files/New folder/icons/Search_dark.svg";
import Search from "../assests/SVG_Files/New folder/icons/Search.svg";
import Hamburger_Menu_light from "../assests/SVG_Files/New folder/Hamburger_Menu_light.svg";
import Hamburger_Menu_dark from "../assests/SVG_Files/New folder/Hamburger_Menu_dark.svg";
import Arrow_Left_light from "../assests/SVG_Files/New folder/Arrow_Left_light.svg";
import Arrow_Left_dark from "../assests/SVG_Files/New folder/Arrow_Left_dark.svg";
import user_svg from "../assests/SVG_Files/New folder/user.svg";
// import lunIcon from "../assests/SVG_Files/New folder/user_white.svg";
// import white_user_icon from '../assests/SVG_Files/user_ji.svg'
import Searchresult from "./Extras/Searchresult";
import { searchState } from "../../src/Redux/Actions/auth.action";
import { development } from "../endpoints";

const drawerWidth = () => {
  if (window.innerWidth <= 600) {
    return 258;
  } else {
    return 341;
  }
};

const drawerWidthTwo = () => {
  if (window.innerWidth <= 600) {
    return 300;
  } else {
    return 388;
  }
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Sidebar() {
  const [state, setState] = React.useState({
    left: false,
  });

  const [statetwo, setStateTwo] = React.useState({
    right: false,
  });

  const toggleDrawerTwo = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setStateTwo({ ...statetwo, [anchor]: open });
  };

  const themeState = useSelector((state) => state.theme.state);
  const Pinstate = useSelector((state) => state.pin.state);
  const [open, setOpen] = React.useState(false);
  const [themestate, setThemeState] = React.useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const [accordionicon, setaccordionicon] = React.useState(false);
  const navigate = useNavigate();
  const [searchstate, setSearchState] = React.useState(false);
  const [searchstate2, setSearchState2] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [searchKey, setSearchKey] = React.useState(true);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state?.auth);

  // console.log("user", user);
  // console.log("searchstate", searchstate);

  const handleSearchResult = (e) => {
    if (search) {
      if (location.pathname === "/") {
        navigate(`/?search=${search.replace(/\s+/g, "-")}`, {
          state: {
            searchKey,
            search,
          },
        });
      } else {
        navigate(
          `/searchresult?role=${role}&coursename=${search.replace(
            /\s+/g,
            "-"
          )}`,
          {
            state: {
              search,
              path: location.pathname,
            },
          }
        );
      }
    } else {
      console.log("Null");
    }
  };
  const handleSearchBar = async (e) => {
    setSearch(e.target.value);
    // console.log(e.target.value);
    if (e.target.value === "") {
      navigate(`/`);
    }
  };

  React.useEffect(() => {
    // console.log("searchstate2", searchstate2);
    const state = async () => {
      await dispatch(searchState(searchstate2));
    };
    state();
  }, []);

  const handleLogout = async () => {
    // localStorage.clear();
    // window.load((window.location.href = "/logout"));
    const response = await dispatch(logout(role, token));
    // console.log("response", response);
    response?.message === "logout successfully" && navigate("/logout");
    !token && navigate("/login");
  };

  const handleSearchState = async (e) => {
    // console.log("searchstate");
    e.preventDefault();
    // await dispatch(searchState(searchstate2));
    setSearchState2(!searchstate2);
    setSearchState(true);
  };

  const handleAccordionIcon = async () => {
    setaccordionicon(!accordionicon);
  };

  const handleChange = async (event) => {
    setThemeState(event.target.checked);
    dispatch(themeSwitch(!themeState));
    // navigate(`/`);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // console.log("themeState", themeState);
  // console.log("pathname", location.pathname.includes("detailpage"));

  const handleaccordiondrawer = () => {
    if (location.pathname.includes("topic")) {
      return (
        <button onClick={handleAccordionIcon} className="accordionbutton">
          <div>
            {["right"].map((anchor) => (
              <React.Fragment key={anchor}>
                <Button onClick={toggleDrawerTwo(anchor, true)}>
                  {themeState ? (
                    <img
                      src={Arrow_Left_light}
                      alt=""
                      className="arrows_icon_sidebar"
                    />
                  ) : (
                    <img
                      src={Arrow_Left_dark}
                      alt=""
                      className="arrows_icon_sidebar"
                    />
                  )}
                </Button>
                <Drawer
                  sx={{
                    width: "400px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      // width: "500px",
                      boxSizing: "border-box",
                      border: "none",
                    },
                  }}
                  anchor={anchor}
                  open={statetwo[anchor]}
                  onClose={toggleDrawerTwo(anchor, false)}
                >
                  {listtwo(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>
        </button>
      );
    } else if (location.pathname.includes("topic")) {
      return (
        <button onClick={handleAccordionIcon} className="accordionbutton">
          <div>
            {["right"].map((anchor) => (
              <React.Fragment key={anchor}>
                <Button onClick={toggleDrawerTwo(anchor, true)}>
                  {themeState ? (
                    <img
                      src={Arrow_Left_light}
                      alt=""
                      className="arrows_icon_sidebar"
                    />
                  ) : (
                    <img
                      src={Arrow_Left_dark}
                      alt=""
                      className="arrows_icon_sidebar"
                    />
                  )}
                </Button>
                <Drawer
                  sx={{
                    width: "400px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      // width: "500px",
                      boxSizing: "border-box",
                      border: "none",
                    },
                  }}
                  anchor={anchor}
                  open={statetwo[anchor]}
                  onClose={toggleDrawerTwo(anchor, false)}
                >
                  {listtwo(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>
        </button>
      );
    }
  };

  const hideAccordianOnClick = (hide) => {
    setStateTwo(hide);
  };

  const listtwo = (anchor) => (
    <Box
      style={{
        background: "#212121",
        height: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          background: "#212121",
          height: "30px",
          padding: "20px 20px",
          marginBottom: "10px",
        }}
      >
        <img
          onClick={() => setStateTwo(false)}
          src={UnionClose}
          alt=""
          style={{ cursor: "pointer" }}
        />
      </div>
      <Accordian hideAccordianOnClick={hideAccordianOnClick} />
    </Box>
  );

  const list = (anchor) => (
    <Box
      role="presentation"
      style={{
        color: "white",
        paddingTop: "45px",
      }}
    >
      <span className="subheadingsidebar">Account </span>
      <Divider className="divider_class" />

      <List style={{ paddingLeft: "20px" }}>
        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/usersettingviewpage")}
        >
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            {token && (
              <ListItemIcon>
                <>
                  {user?.profile?.includes("dummy") && themeState ? (
                    <AccountCircleOutlinedIcon
                      className="sidebarsignupicon"
                      style={{ borderRadius: "50%", color: "white" }}
                      onClick={() => navigate("/usersettingviewpage")}
                    />
                  ) : user?.profile?.includes("dummy") &&
                    themeState === false ? (
                    <AccountCircleOutlinedIcon
                      className="sidebarsignupicon"
                      style={{ borderRadius: "50%", color: "white" }}
                      onClick={() => navigate("/usersettingviewpage")}
                    />
                  ) : (
                    <img
                      onClick={() => navigate("/usersettingviewpage")}
                      src={
                        user?.profile !== null
                          ? `${development}/${user?.profile}`
                          : user_svg
                      }
                      alt=""
                      className="profilesidebaricon"
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                </>
              </ListItemIcon>
            )}
            <Typography>
              <span className="listitem_text" style={{ marginLeft: "-17px" }}>
                {user?.username}
              </span>
            </Typography>
          </div>
        </ListItem>
        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => !token && navigate("/register")}
        >
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            <ListItemIcon
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <img
                src={Sidebar_Signup}
                alt=""
                style={{ paddingLeft: "2px" }}
                className="sidebarsignupicon"
              />
            </ListItemIcon>
            <Typography
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <span
                className={
                  user?.token !== null
                    ? "listitem_text_disabled"
                    : "listitem_text_enabled"
                }
                style={{ marginLeft: "-24px" }}
              >
                Signup
              </span>
            </Typography>
          </div>
        </ListItem>

        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => !token && navigate("/login")}
        >
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            <ListItemIcon
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <img
                src={Sidebar_Login}
                alt=""
                style={{ paddingLeft: "3px" }}
                className="sidebarloginicon"
              />
            </ListItemIcon>
            <Typography
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <span
                className={
                  user?.token !== null
                    ? "listitem_text_disabled"
                    : "listitem_text_enabled"
                }
                style={{ marginLeft: "-24px" }}
              >
                Login
              </span>
            </Typography>
          </div>
        </ListItem>

        {token && (
          <ListItem style={{ cursor: "pointer" }} onClick={handleLogout}>
            <div
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
              className="sidebarlistcontainer"
            >
              <ListItemIcon
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
              >
                <img
                  src={Sidebar_Logout}
                  alt=""
                  style={{ paddingLeft: "3px" }}
                  className="sidebarlogouticon"
                />
              </ListItemIcon>
              <Typography
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
              >
                <span className="listitem_text" style={{ marginLeft: "-24px" }}>
                  Logout
                </span>
              </Typography>
            </div>
          </ListItem>
        )}

        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => token && navigate("/recentlyviewed")}
        >
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            <ListItemIcon
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <img
                src={Recent_view_dark}
                alt=""
                className="sidebardarkicon"
                style={{ paddingRight: "2px" }}
              />
            </ListItemIcon>
            <Typography
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <span
                className={
                  user?.token === null
                    ? "listitem_text_disabled"
                    : "listitem_text"
                }
                style={{ marginLeft: "-24px" }}
              >
                Recently Viewed
              </span>
            </Typography>
          </div>
        </ListItem>
        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => token && navigate("/mylibrarycourses")}
        >
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            <ListItemIcon
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <img
                src={Sidebar_My_library}
                alt=""
                className="sidebarlibraryicon"
                style={{ paddingRight: "3px" }}
              />
            </ListItemIcon>
            <Typography
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <span
                className={!token ? "listitem_text_disabled" : "listitem_text"}
                style={{ marginLeft: "-24px" }}
              >
                My Library
              </span>
            </Typography>
          </div>
        </ListItem>
        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => token && navigate("/ratingsidebar")}
        >
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            <ListItemIcon
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <img
                src={Rating}
                alt=""
                className="sidebarratingicon"
                style={{ paddingLeft: "1px" }}
              />
            </ListItemIcon>
            <Typography
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <span
                style={{ marginLeft: "-24px" }}
                className={!token ? "listitem_text_disabled" : "listitem_text"}
              >
                Rating
              </span>
            </Typography>
          </div>
        </ListItem>
      </List>
      <span className="subheadingsidebar" style={{ marginTop: "20px" }}>
        Setting{" "}
      </span>
      <Divider className="divider_class" />
      <List style={{ paddingLeft: "20px" }}>
        <ListItem style={{ cursor: "pointer" }}>
          <div
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            className="sidebarlistcontainer"
          >
            <ListItemIcon
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <img
                className="sidebarnighticon"
                src={Sidebar_NightMode}
                alt=""
                style={{ paddingLeft: "3px" }}
              />
            </ListItemIcon>
            <Typography
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <span className="listitem_text" style={{ marginLeft: "-24px" }}>
                Dark Theme
              </span>
            </Typography>
            <div class="container switch_class">
              <label
                class="switch"
                style={{ background: themestate ? "#009AF9 " : " #BDB9A6" }}
              >
                <input
                  type="checkbox"
                  checked={themestate}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "test switch" }}
                />{" "}
                <div></div>
              </label>
            </div>
          </div>
        </ListItem>
      </List>
      {role === "editor" && (
        <>
          <Divider className="divider_class" />
          <span className="subheadingsidebar" style={{ marginTop: "20px" }}>
            {" "}
            Editor Menu{" "}
          </span>
          <List style={{ paddingLeft: "20px" }}>
            <ListItem
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/editormainpage")}
            >
              <div
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
                className="sidebarlistcontainer"
              >
                <ListItemIcon
                  onClick={toggleDrawer(anchor, false)}
                  onKeyDown={toggleDrawer(anchor, false)}
                >
                  <img
                    className="sidebareditoricon"
                    src={Sidebar_EditorPage}
                    alt=""
                    style={{ paddingLeft: "3px" }}
                  />
                </ListItemIcon>
                <Typography
                  onClick={toggleDrawer(anchor, false)}
                  onKeyDown={toggleDrawer(anchor, false)}
                >
                  <span
                    className="listitem_text"
                    style={{ marginLeft: "-24px" }}
                  >
                    Editor's Page
                  </span>
                </Typography>
              </div>
            </ListItem>
          </List>
        </>
      )}
      <span className="subheadingsidebar" style={{ marginTop: "20px" }}>
        Others{" "}
      </span>
      <Divider className="divider_class" />
      <List style={{ paddingLeft: "20px" }}>
        <ListItem
          style={{ cursor: "pointer" }}
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <Typography>
            <span className="listitem_text">About D-Libra</span>
          </Typography>
        </ListItem>
        <ListItem
          style={{ cursor: "pointer" }}
          onClick={() => token && navigate("/feedback")}
        >
          <Typography
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
          >
            <span
              className={!token ? "listitem_text_disabled" : "listitem_text"}
            >
              Feedback
            </span>
          </Typography>
        </ListItem>
      </List>
    </Box>
  );

  const Conditional_Searchbar = () => {
    if ("/" === location.pathname) {
      return "logocontainerone";
    } else if (
      "/register" === location.pathname ||
      "/login" === location.pathname ||
      "/" === location.pathname ||
      "/logout" === location.pathname
    ) {
      return "logocontainertwo";
    } else if (
      "/feedback" === location.pathname ||
      "/rlogocontainertwoatingsidebar" === location.pathname ||
      "/ratingform" === location.pathname ||
      "/usersettingviewpage" === location.pathname
    ) {
      return "logocontainerthree";
    } else if (
      "/Tagpage" === location.pathname ||
      "/Searchresult" === location.pathname ||
      "/recentlyviewed" === location.pathname
    ) {
      return "logocontainereight";
    } else if (location.pathname?.includes("course")) {
      return "logocontainernine";
    } else if (
      "/editormainpage" === location.pathname ||
      "/editcoursestructure" === location.pathname ||
      "/addnewcategory" === location.pathname ||
      "/uploadcontentmain" === location.pathname ||
      "/mycontents/:id" === location.pathname ||
      location.pathname?.includes("topic") ||
      "/editcontentmain" === location.pathname ||
      "/deletecontent" === location.pathname
    ) {
      return "logocontaineredit";
    } else {
      return "logocontainereleven";
    }
  };

  const Conditional_SearchIcon = () => {
    if (
      "/" === location.pathname ||
      "/register" === location.pathname ||
      "/login" === location.pathname ||
      "/logout" === location.pathname
    ) {
      return "wrap";
    }
    if (
      location.pathname?.includes("topic") ||
      "/userdetailpage" === location.pathname
    ) {
      return "wrapthree";
    } else {
      return "wraptwo";
    }
  };

  const Conditional_Sidenavlogo = () => {
    if (
      location.pathname?.includes("topic") ||
      "/userdetailpage" === location.pathname
    ) {
      return "sidenav_logotwo";
    } else {
      return "sidenav_logo";
    }
  };

  const Conditional_Sidenavlogotwo = () => {
    if (
      location.pathname?.includes("topic") ||
      "/userdetailpage" === location.pathname
    ) {
      return "sidenav_logothree";
    } else {
      return "sidenav_logofour";
    }
  };

  const handleHomeNavigate = () => {
    navigate("/");
    setSearch("");
  };

  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        style={{ display: Pinstate ? "none" : "" }}
      >
        <Toolbar className={themeState ? "toolbarclasstwo" : "toolbarclassone"}>
          <>
            {["left"].map((anchor) => (
              <React.Fragment key={anchor}>
                <IconButton
                  onClick={toggleDrawer(anchor, true)}
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  style={{
                    position: "absolute",
                    left: "10px",
                  }}
                  className="hamburgericonsidebarButton"
                  sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                  {themeState ? (
                    <img
                      src={Hamburger_Menu_light}
                      alt=""
                      className="hamburgericonsidebar"
                    />
                  ) : (
                    <img
                      src={Hamburger_Menu_dark}
                      alt=""
                      className="hamburgericonsidebar"
                    />
                  )}
                </IconButton>
                <SwipeableDrawer
                  sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      width: drawerWidth,
                      boxSizing: "border-box",
                      border: "none",
                      backgroundColor: "rgb(33, 33, 33)",
                    },
                  }}
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  onOpen={toggleDrawer(anchor, true)}
                >
                  {list(anchor)}
                </SwipeableDrawer>
              </React.Fragment>
            ))}
          </>
          {console.log("role", role)}
          <div className="logocontainer">
            <div
              className={
                location.pathname.includes("2041-1010-1010")
                  ? "firstTopic"
                  : location.pathname?.includes("topic") &&
                    role === "normaluser"
                  ? "logo_main_container_one"
                  : location.pathname?.includes("topic") && role === "editor"
                  ? "logo_main_container_two"
                  : location.pathname?.includes("topic") && role === null
                  ? "logo_main_container_three"
                  : role === "normaluser" && location.pathname !== "/"
                  ? "logo_main_container"
                  : role === "editor" &&
                    location.pathname !== "/" &&
                    themeState === false && location.pathname !== "/addnewcategory"
                  ? "logo_main_container"
                  : role === "editor" &&
                    location.pathname !== "/" &&
                    themeState &&
                    location.pathname !== "/mylibrarycourses" && 
                    location.pathname !== "/addnewcategory"
                  ? "logo_main_container_some_pages"
                  : role === "editor" &&
                    location.pathname?.includes("mylibrarycourses") &&
                    themeState
                  ? "editor_myLibrary"
                  : role === "editor" && location.pathname === "editormainpage"
                  ? "logo_main_container logo_main_container_editor"
                  : role === null && location.pathname !== "/"
                  ? "logo_main_container_null"
                  : role === null && location.pathname === "/"
                  ? "logo_main_container_landing"
                  : (role === "editor" &&
                      location.pathname?.includes("course")) ||
                    (role === "editor" &&
                      location.pathname?.includes("library"))
                  ? "logo_main_container_some_pagewwws"
                  : role === "editor" && location.pathname === "/" && themeState
                  ? "logo_main_container_landing_role_editor"
                  : role === "editor" &&
                    location.pathname !== "/" &&
                    themeState === false &&
                    location.pathname !== "/mylibrarycourses" &&
                    location.pathname === "/addnewcategory"
                  ? "logo_main_container_DarkEditor"
                  : role === "editor" &&
                    location.pathname !== "/" &&
                    themeState &&
                    location.pathname !== "/mylibrarycourses" &&
                    location.pathname === "/addnewcategory"
                  ? "logo_main_container_LightEditor"
                  : "logo_main_container_landing_role"
              }
            >
              <Button
                onClick={handleHomeNavigate}
                className={Conditional_Searchbar()}
                style={
                  location.pathname.includes("topic")
                    ? {
                        marginLeft: "55px",
                      }
                    : null
                }
              >
                {themeState ? (
                  <img
                    src={lightmode_logo}
                    alt=""
                    className={
                  
                        location.pathname?.includes("/") &&
                        location.pathname != "/mylibrarycourses" &&
                        location.pathname != "/ratingsidebar" &&
                     
                        role==="normaluser"
                          ? "sidebarlightmodelogo"
                           : location.pathname?.includes("/mylibrarycourses")
                           && role==="normaluser"
                        ? "myLibraryLogo"
                        : location.pathname?.includes("/ratingsidebar")
                        && role==="normaluser"
                        ? "ratingSideBarLightLogo"
                        : location.pathname?.includes("/") &&
                        
                        location.pathname != "/recentlyviewed" &&
                        location.pathname != "/mylibrarycourses" &&
                        location.pathname != "/ratingsidebar" &&
                        location.pathname != "/editormainpage" &&
                        location.pathname != "/feedback" &&
                        role==="editor"
                        ? "homePageEditorLogoLight"
                    
                        : location.pathname?.includes("/recentlyviewed") && role==="editor"
                        ? "recentlyViewLightEditor"
                     
                        : location.pathname?.includes("/mylibrarycourses") && role==="editor"
                        ? "libraryLightEditorLogo"
                       
                        : location.pathname?.includes("/ratingsidebar") && role==="editor"
                        ? "ratingLogoEditorLight"
                        
                        : location.pathname?.includes("/editormainpage") && role==="editor"
                        ? "editorMainPageLigght"
                        
                        : location.pathname?.includes("/feedback") && role==="editor"
                        ? "feedBackLightEditor"
                        
                        : location.pathname?.includes("/") &&
                        
                        location.pathname != "/recentlyviewed" &&
                        location.pathname != "/mylibrarycourses" &&
                        location.pathname != "/ratingsidebar" &&
                        location.pathname != "/editormainpage" &&
                        location.pathname != "/feedback" &&
                        location.pathname != "/login" &&
                        location.pathname != "/register" &&
                        role===null
                        ?"homePageLightLogo"
                        :location.pathname?.includes("/login") 
                       
                        ? "loginPageLight"
                    
                        :location.pathname?.includes("/register") 
                       
                        ? "registerPageLight"
                        : ""


                    }
                    // className="sidebarlightmodelogo"
                  />
                ) : (
                  <img
                    src={darkmode_logo}
                    alt=""
                    // className="sidebarlightmodelogo"
                    className={
                      location.pathname?.includes("/") &&
                      location.pathname != "/editormainpage" &&
                      location.pathname != "/mylibrarycourses" &&
                      location.pathname != "/uploadcontentmain" &&
                      location.pathname != "/editcoursestructure" &&
                      role === "editor"
                        ? "editorHomeLogo"
                        : location.pathname?.includes("/editormainpage") &&
                          role === "editor"
                        ? "editorHomeLogoEditorMain"
                        : location.pathname?.includes("/mylibrarycourses") &&
                          role === "editor"
                        ? "editorMyLibraryCourses"
                        : location.pathname?.includes("/") &&
                          location.pathname != "/recentlyviewed" &&
                          location.pathname != "/mylibrarycourses" &&
                          location.pathname != "/ratingsidebar" &&
                          role === "normaluser"
                        ? "normalUserHomePage"
                        : location.pathname?.includes("/recentlyviewed") &&
                          role === "normaluser"
                        ? "recentlyViewNormal"
                        : location.pathname?.includes("/mylibrarycourses") &&
                          role === "normaluser"
                        ? "mylibrarycoursesUser"
                        : location.pathname?.includes("/ratingsidebar") &&
                          role === "normaluser"
                        ? "ratingSideBarUser"
                        : location.pathname?.includes("/topic") && role === null
                        ? "detailPageWithoutLogin"
                        : location.pathname?.includes("/uploadcontentmain") &&
                          role === "editor"
                        ? "uploadContentPageCl"
                        : location.pathname?.includes("/editcoursestructure") &&
                          role === "editor"
                        ? "addCatagoryEditor"
                        : ""
                    }
                  />
                )}
              </Button>
            </div>
          </div>

          {user?.role === "editor" && (
            <img
              src={editor_icon}
              className="editoriconsidebar"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/editormainpage")}
              alt=""
            />
          )}

          <div className="toolbar_rowreverse">
            <div>
              <div className="mainsearchcontianer">
                <input
                  // onClick={handleSearchBar}
                  placeholder="Search"
                  className={`${
                    themeState ? "sidebar_inputfield_sub" : "sidebar_inputfield"
                  }`}
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchBar(e)}
                />

                <div
                  className={
                    themeState
                      ? "input_field_icon_container_sub   "
                      : "input_field_icon_container"
                  }
                >
                  {themeState ? (
                    <img
                      src={Search}
                      alt=""
                      onClick={handleSearchResult}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <img
                      src={Search}
                      alt=""
                      onClick={handleSearchResult}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>

              <div className={Conditional_SearchIcon()}>
                <div>
                  {themeState ? (
                    <img
                      onClick={handleSearchState}
                      src={Search}
                      alt=""
                      className="searchiconsize"
                    />
                  ) : (
                    <img
                      className="searchiconsize"
                      onClick={handleSearchState}
                      // style={{
                      //   filter:
                      //     "invert(12%) sepia(83%) saturate(5841%) hue-rotate(134deg) brightness(87%) contrast(153%)",
                      // }}
                      src={Search}
                      alt=""
                    />
                  )}
                </div>
              </div>
            </div>

            {
              // "/" === location.pathname || // user icon
              "/register" === location.pathname ||
              "/logout" === location.pathname ||
              "/login" === location.pathname ||
              "/coursepageguest" === location.pathname ? (
                ""
              ) : (
                <>
                  {token ? (
                    <>
                      {user?.profile?.includes("dummy") && themeState ? (
                        <AccountCircleOutlinedIcon
                          color="primary"
                          className={Conditional_Sidenavlogotwo()}
                          style={{ borderRadius: "50%" }}
                          onClick={() => navigate("/usersettingviewpage")}
                        />
                      ) : user?.profile?.includes("dummy") &&
                        themeState === false ? (
                        <AccountCircleOutlinedIcon
                          className={Conditional_Sidenavlogotwo()}
                          style={{ borderRadius: "50%" }}
                          onClick={() => navigate("/usersettingviewpage")}
                        />
                      ) : (
                        <img
                          onClick={() => navigate("/usersettingviewpage")}
                          src={
                            user?.profile !== null
                              ? `${development}/${user?.profile}`
                              : user_svg
                          }
                          alt=""
                          className={Conditional_Sidenavlogo()}
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                    </>
                  ) : null}
                </>
              )
            }
          </div>
          {handleaccordiondrawer()}
        </Toolbar>

        <div
          className="Searchb_main"
          style={{
            zIndex: "1",
            display: searchstate ? "block" : "none",
          }}
        >
          <div
            className="main"
            style={{
              backgroundColor: `${themeState ? "#F3F6FF" : "  #111111"}`,
            }}
          >
            <div
              className="left_search"
              onClick={() => {
                setSearchState(false);
              }}
            >
              {themeState ? (
                <img src={UnionBlue} alt="" />
              ) : (
                <img src={Arrow_white} alt="" />
              )}
            </div>
            <div
              className="right_search"
              style={{
                backgroundColor: `${themeState ? "#FFFFFF" : "  #111111"}`,
              }}
            >
              <div className="left">
                <input
                  type="text"
                  placeholder="Search"
                  className={
                    themeState ? "searchbar_input_two" : "searchbar_input"
                  }
                  style={{
                    backgroundColor: `${themeState ? " #FFFFFF" : " #4F4F4F"}`,
                    color: `${themeState ? "black" : "white"}`,
                  }}
                  value={search}
                  onChange={(e) => handleSearchBar(e)}
                  // onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div
                className="right"
                style={{
                  backgroundColor: `${themeState ? " #FFFFFF" : "#4F4F4F"}`,
                }}
              >
                {themeState ? (
                  <img
                    src={Search}
                    alt=""
                    onClick={handleSearchResult}
                    className="sidebarsearchlogo"
                  />
                ) : (
                  <img
                    src={Search}
                    alt=""
                    onClick={handleSearchResult}
                    className="sidebarsearchlogo"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </AppBar>
      {/* {searchstate2 ? (
        <div>
          <Searchresult />
        </div>
      ) : (
       ''
      )} */}
    </>
  );
}
