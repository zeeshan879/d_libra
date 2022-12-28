import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const ratingCourse =
  (role, course_id, rating, comment, token) => async (dispatch) => {
    console.log(role, course_id, rating, comment, token);
    const formData = new FormData();
    formData.append("role", role);
    formData.append("course_id", course_id);
    formData.append("rating", rating);
    formData.append("comment", comment);
    try {
      const response = await axios.put(
        URL + endpoints.RATING_COURSE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("ratingCourse response", response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
