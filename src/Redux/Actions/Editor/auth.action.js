import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const editorChangePassword =
  (password, oldPassword, role, token) => async (dispatch) => {
    const formData = new FormData();
    formData.append("Password", password);
    formData.append("oldpassword", oldPassword);
    try {
      const response = await axios.put(
        `${URL}${endpoints.CHANGE_PASSWORD_FOR_EDITOR}${role}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    //   console.log("EditorChangePassword response", response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
