import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const courseView = (courseid, role, token) => async (dispatch) => {
  const formData = new FormData();
  formData.append("role", role);
  formData.append("courseid", courseid);

  try {
    const response = await axios.post(
      URL + endpoints.COURSE_VIEW + "?role=" + role,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("courseView response", response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
