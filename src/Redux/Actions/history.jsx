import axios from "axios";
import { URL, endpoints } from "../../endpoints";

export const courseHistory = (token, role) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${URL}${endpoints.GET_HISTORY_COURSE}?role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("courseHistory response", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
