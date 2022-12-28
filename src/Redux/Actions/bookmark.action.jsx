import axios from "axios";
import { URL, endpoints } from "../../endpoints";
import * as FormData from "form-data";

export const addBookmark = (rawData, role, token) => async (dispatch) => {
  // console.log(rawData);
  try {
    const response = await axios.post(
      `${URL}${endpoints.ADD_BOOKMARK_LIBRARY}?role=${role}`,
      rawData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Add Bookmark", response);
    return response?.data;
  } catch (error) {
    // console.log(error);
  }
};

export const showAllBoomark = (role, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${URL}${endpoints.GET_ALL_BOOKMARK}?role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("showAllBoomark", response);
    return response?.data?.data;
  } catch (error) {
    // console.log(error);
  }
};

export const getBookmarkCourse = (role, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${URL}${endpoints.GET_BOOKMARK_COURSE}?role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Get Bookmark Course", response);
    return response?.data?.data;
  } catch (error) {
    // console.log(error);
  }
};

export const addContentBookmark =
  (content_id, role, token) => async (dispatch) => {
    const formData = new FormData();
    formData.append("contentid", content_id);
    try {
      const response = await axios.post(
        `${URL}${endpoints.ADD_CONTENT_BOOKMARK}?role=${role}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Add Content Bookmark", response);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

export const deleteBookmark = (role, bookmarkID, token) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${URL}${endpoints.DELETE_BOOKMARK}?role=${role}&bookmarkid=${bookmarkID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("deleteBookmark Bookmark", response);
    return response?.data;
  } catch (error) {
    // console.log(error);
  }
};

export const EditBookmark = (id, name, role, token) => async (dispatch) => {
  console.log("id, name", id, name)
  const formData = new FormData();
  formData.append("id", id);
  formData.append("name", name);
  try {
    const response = await axios.put(
      `${URL}${endpoints.EDIT_BOOKMARK}?role=${role}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("EditBookmark Bookmark", response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
