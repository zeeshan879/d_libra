import axios from "axios";
import { URL, endpoints } from "../../../endpoints";

export const deletePost = (id, token) => async (dispatch) => {
  console.log("deletePost", id);
  try {
    const response = await axios.delete(
      `${URL}${endpoints.DELETE_POST_BY_ID}?id=${id}`,
      {
        headers: {
          Authorization: "Bearar " + token,
        },
      }
    );
    // console.log("Delete Post response", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
