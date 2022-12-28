import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const viewCourseStatus = (token, role) => async (dispatch) => {
  // console.log(URL + endpoints.VIEW_COURSE_STATUS + "=" + role);
  try {
    const response = await axios.get(
      URL + endpoints.VIEW_COURSE_STATUS + role,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    // console.log("viewCourseStatus response", response);
    dispatch({
      type: "VIEW_RECENT_COURSE_STATUS_SUCCESS",
      payload: response?.data,
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {
        userId: "",
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        status: "",
        profile: "",
        token: "",
        role: "",
      },
    });
  }
};
export const addToRecentViewCourses =
  (course_id, normaluser, token) => async (dispatch) => {
    // console.log(course_id, role);
    const formData = new FormData();
    formData.append("course_id", course_id);
    formData.append("role", normaluser);
    try {
      const response = await axios.post(
        URL + endpoints.ADD_TO_RECENT_COURSES,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("addToRecentViewCourses response", response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
