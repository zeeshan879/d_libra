import React from "react";
import Sidebar from "./Components/Sidebar";
import EditorsMainPage from "../src/Components/Editors/EditorsMainPage";
import EditCourseStructure from "./Components/Editors/EditCourseStructure";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import AddNewCategory from "./Components/Editors/AddNewCategory";
import UploadContentMain from "./Components/Editors/UploadContent/UploadContentMain";
import DetailPage from "./Components/Editors/DetailPage";
import DeleteContent from "./Components/Editors/DeleteContent";
import EditContentMain from "./Components/Editors/UploadContent/EditContentMain";
import MyContents from "./Components/Editors/MyContent/MyContents";
import FooterCopyright from "./Components/User/FooterCopyright";
import Feedback from "./Components/User/Feedback";
import RatingForm from "./Components/User/RatingForm";
import RatingSidebar from "./Components/User/RatingSidebar";
import UserSettingViewPage from "./Components/User/UserSettingViewPage";
import LandingPage from "./Components/Guest/LandingPG/LandingPage";
import Accordian from "./Components/Guest/Accordian/Accordian";
import LibraryBookmark from "./Components/User/Library/LibraryBookmark";
import UserDetailPage from "./Components/User/DetailPageUser/UserDetailPage";

import Login from "./Components/Auth/pages/login";
import Register from "./Components/Auth/pages/register";
import Logout from "./Components/Auth/pages/logout";
import ForgetPassword from "./Components/Auth/pages/forget-password";
import ChangePassword from "./Components/Auth/pages/change-password";

import { useSelector } from "react-redux";
import "./index.css";
import MylibraryCorse from "./Components/Extras/MylibraryCorse";
import Tagpage from "./Components/Extras/Tagpage";
import Searchresult from "./Components/Extras/Searchresult";
import Recentlyviewed from "./Components/Extras/Recentlyviewed";
import CoursePageGuest from "./Components/Guest/LandingPG/CoursePageGuest";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const theme = useSelector((state) => state.theme.state);
  const searchState = useSelector((state) => state.searchSTate.state);
  const isAuthenticated = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  console.log(isAuthenticated, role);

  const backgroundHanlde = () => {
    if (
      (window.location.href.split("/")[3]?.includes("mycontents") &&
        theme === false) ||
      (window.location.href.split("/")[3] === "uploadcontentmain" &&
        theme === false) ||
      (window.location.href.split("/")[3] === "editormainpage" &&
        theme === false) ||
      (window.location.href.split("/")[3] === "addnewcategory" &&
        theme === false) ||
      (window.location.href.split("/")[3]?.includes("deletecontent") &&
        theme === false) ||
      (window.location.href.split("/")[3]?.includes("topic") &&
        theme === false) ||
      (window.location.href.split("/")[3] === "editcoursestructure" &&
        theme === false)
    ) {
      document.body.style.backgroundColor = "#111111";
      return "darkTheme";
    } else if (
      (window.location.href.split("/")[3]?.includes("mycontents") &&
        theme === true) ||
      (window.location.href.split("/")[3] === "uploadcontentmain" &&
        theme === true) ||
      (window.location.href.split("/")[3] === "addnewcategory" &&
        theme === true) ||
      (window.location.href.split("/")[3] === "editcoursestructure" &&
        theme === true)
    ) {
      document.body.style.backgroundColor = "#eeeeee";
      return "CreamyTheme";
    } else if (theme === true) {
      document.body.style.backgroundColor = "#F3F6FF";
      return "lightTheme";
    } else {
      document.body.style.backgroundColor = "#111111";
      return "darkTheme";
    }
  };

  return (
    <>
      <div className={backgroundHanlde()}>
        {/* <Helmet>
          <title>Detail Page</title>
          <meta name="description" content="jjjj"></meta>
        </Helmet> */}
        <Router>
          <Sidebar />

          {searchState ? (
            <div>
              <Searchresult />
            </div>
          ) : (
            <div>
              <Routes>
                {isAuthenticated !== "" ? (
                  <>
                    <Route path="/" exact element={<LandingPage />} />
                    <Route
                      exact
                      path="/login"
                      element={
                        isAuthenticated ? <Navigate to="../" /> : <Login />
                      }
                    />
                    <Route
                      exact
                      path="/register"
                      element={
                        isAuthenticated ? <Navigate to="../" /> : <Register />
                      }
                    />
                    <Route
                      exact
                      path="/searchresult"
                      element={<Searchresult />}
                    />
                    <Route
                      exact
                      path="/forgetPassword"
                      element={
                        isAuthenticated ? (
                          <Navigate to="../" />
                        ) : (
                          <ForgetPassword />
                        )
                      }
                    />
                    <>
                      <Route
                        path="/mycontents/:id"
                        exact
                        element={
                          isAuthenticated ? (
                            <MyContents />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />

                      <Route exact path="/logout" element={<Logout />} />
                      <Route
                        exact
                        path="/changepassword"
                        element={
                          isAuthenticated ? (
                            <ChangePassword />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/editormainpage"
                        exact
                        element={
                          isAuthenticated && role === "editor" ? (
                            <EditorsMainPage />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/editcoursestructure"
                        exact
                        element={
                          isAuthenticated && role === "editor" ? (
                            <EditCourseStructure />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/addnewcategory"
                        exact
                        element={
                          isAuthenticated && role === "editor" ? (
                            <AddNewCategory />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/uploadcontentmain"
                        exact
                        element={
                          isAuthenticated && role === "editor" ? (
                            <UploadContentMain />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/topic/:identifier_name/:id/:categoryid/:courseid/:meta/:img"
                        exact
                        element={<DetailPage />}
                      />
                      <Route
                        path="/delete/:identifier_name/:id/:categoryid/:courseid/:meta/:img"
                        exact
                        element={<DeleteContent />}
                      />
                      <Route
                        path="/edit/:identifier_name/:id/:categoryid/:courseid/:meta/:img"
                        exact
                        element={<EditContentMain />}
                      />
                      <Route path="/feedback" exact element={<Feedback />} />
                      <Route
                        path="/ratingsidebar"
                        exact
                        element={<RatingSidebar />}
                      />
                      <Route
                        path="/usersettingviewpage"
                        exact
                        element={
                          isAuthenticated ? (
                            <UserSettingViewPage />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/ratingform"
                        exact
                        element={<RatingForm />}
                      />
                      <Route
                        path="/librarybookmark"
                        exact
                        element={
                          isAuthenticated ? (
                            <LibraryBookmark />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route path="/Accordian" exact element={<Accordian />} />
                      <Route
                        path="/mylibrarycourses"
                        exact
                        element={
                          isAuthenticated ? (
                            <MylibraryCorse />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route path="/tagpage/:tag" exact element={<Tagpage />} />
                      {/* <Route path="/Searchresult" exact element={<Searchresult />} /> */}
                      <Route
                        path="/recentlyviewed"
                        exact
                        element={
                          isAuthenticated ? (
                            <Recentlyviewed />
                          ) : (
                            <Navigate to="../" />
                          )
                        }
                      />
                      <Route
                        path="/userdetailpage"
                        exact
                        element={<UserDetailPage />}
                      />

                      <Route
                        path="/course/:identifier_name/:id"
                        exact
                        element={<CoursePageGuest />}
                      />
                    </>
                  </>
                ) : (
                  <Route path="*" element={<LandingPage />} />
                )}
              </Routes>
            </div>
          )}

          <FooterCopyright backgroundHanld={backgroundHanlde()} />
        </Router>
      </div>
      <ToastContainer
        position="center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />
    </>
  );
}

export default App;
