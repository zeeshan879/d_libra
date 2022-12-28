import axios from "axios";
import { URL, endpoints } from "../../../endpoints";

export const home = (token) => async (dispatch) => {
  try {
    const response = await axios.get(URL + endpoints.GET_MAIN_CATEGORY, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log("response home", response);
    dispatch({
      type: "GET_MAIN_CATEGORY_DATA",
      payload: {
        data: response.data,
      },
    });
    return response?.data;
  } catch (error) {
    // console.log(error);
  }
};
