import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const librarybookmark = (role, token) => async (dispatch) => {
  try {
    const response = await axios.get(`${URL}${endpoints.GET_PRIORITY}${role}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("librarybookmark response", response);
    return response?.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const setBookMarkPriority =
  (role, content_id, PriorityType, token) => async (dispatch) => {
    console.log(role, content_id, PriorityType,)
    const formData = new FormData();
    formData.append("role", role);
    formData.append("content_id", content_id);
    formData.append("PriorityType", PriorityType);
    try {
      const response = await axios.post(
        `${URL}${endpoints.SET_PRIORITY}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("SetBookMarkPriority response ", response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
