import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const addnewCourse =
  (name, slug, imageName, uniqueidentity, categoryid, token) =>
  async (dispatch) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("image", imageName);
    formData.append("uniqueidentity", uniqueidentity);
    formData.append("categoryid", categoryid);
    try {
      const response = await axios.post(URL + endpoints.ADD_COURSE, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log("response  profiledata", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
export const getMainCategory = (token) => async (dispatch) => {
  try {
    const response = await axios.get(URL + endpoints.GET_MAIN_CATEGORY, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getSubCategory = (token) => async (dispatch) => {
  try {
    const response = await axios.get(URL + endpoints.GET_SUB_CATEGORY, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getParentChildCategories = (token, role) => async (dispatch) => {
  // console.log("token", token);
  try {
    const response = await axios.get(
      URL + endpoints.GET_PARENT_CHILD_CATEGORY + "?role=" + role,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    // console.log("Parent Child response", response);
    dispatch({
      type: "GET_PARENT_CHILD_CATEGORY",
      payload: response?.data?.data,
    });
    return response?.data?.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getChildCategories = (id, token) => async (dispatch) => {
  try {
    const response = await axios.get(URL + endpoints.GET_CHILD_CATEGORY + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log("GetChildCategories response", response);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTopicContent = (role, id, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      URL + endpoints.GET_TOPIC_CONTENT + role + "&" + "course_id=" + id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    // console.log("getTopicContent response", response);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const addParentCategorie =
  (name, slug, image, uniqueidentity, parentID, token) => async (dispatch) => {
    // console.log(name, slug, image, uniqueidentity);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("image", image);
    formData.append("uniqueidentity", uniqueidentity);
    formData.append("parent", parentID);
    try {
      const response = await axios.post(
        `${URL}${endpoints.ADD_PARENT_CATEGORY}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("AddParentCategorie Response", response.data);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

export const getAllCategories = (token) => async (dispatch) => {
  try {
    const response = await axios.get(`${URL}${endpoints.GET_PARENT_CATEGORY}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("GetAllCategories Response", response.data);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCourses = (role, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${URL}${endpoints.GET_ALL_COURSE}?role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("GetAllCourses Response", response.data);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const addnewChapters =
  (name, courseid, slug, imageName, uniqueidentity, token) =>
  async (dispatch) => {
    console.log(name, courseid, slug, imageName, uniqueidentity);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("courseid", courseid);
    formData.append("slug", slug);
    formData.append("image", imageName);
    formData.append("uniqueidentity", uniqueidentity);
    try {
      const response = await axios.post(
        `${URL}${endpoints.ADD_CHAPTER}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("AddnewChapters Response", response.data);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

export const importCategoryAndCourse = (file, token) => async (dispatch) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${URL}${endpoints.IMPORT_CATEGORY_AND_COURSES}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("importCategoryAndCourse Response", response?.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const importCoursesAndChapters = (file, token) => async (dispatch) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${URL}${endpoints.IMPORT_COURSES_AND_CHAPTERS}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("importCoursesOrChapters Response", response?.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const importTopics = (file, token) => async (dispatch) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${URL}${endpoints.IMPORT_TOPIC}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const courseAndChapterTable = (role, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${URL}${endpoints.COURSE_AND_CHAPTER_TABLE}?role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const chapterAndTopicTable = (role, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${URL}${endpoints.CHAPTER_AND_TOPIC_TABLE}?role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data.data;
  } catch (error) {
    console.log(error);
  }
};
