import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const addRecenetViewContent =
  (content_id, role, token) => async (dispatch) => {
    console.log("Content ID", content_id);
    const formData = new FormData();
    formData.append("content_id", content_id);
    formData.append("role", role);

    try {
      const response = await axios.post(
        URL + endpoints.VIEW_RECENT_CONTENT,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("response", response);
      return response?.data
    } catch (error) {
      console.log(error);
    }
  };

export const getRecenetViewContent = (role, token) => async (dispatch) => {
  // console.log("token", URL + endpoints.GET_RECENT_CONTENT + role)
  try {
    const response = await axios.get(
      URL + endpoints.GET_RECENT_CONTENT + "=" + role,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    // console.log("getRecenetViewContent response", response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
