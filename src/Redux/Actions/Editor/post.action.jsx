import axios from "axios";
import { URL, endpoints } from "../../../endpoints";
import * as FormData from "form-data";

export const addPost =
  (
    contentTitle,
    contentId,
    tags,
    htmlText,
    image,
    metaDescription,
    OGP,
    uniqueIdentity,
    token
  ) =>
  async (dispatch) => {
    // console.log(
    //   "addPost",
    //   contentTitle,
    //   contentId,
    //   tags,
    //   htmlText,
    //   image,
    //   metaDescription,
    //   OGP,
    //   uniqueIdentity,
    //   token
    // );
    const formData = new FormData();
    formData.append("title", contentTitle);
    formData.append("Categroyid", contentId);
    formData.append("tags", tags);
    formData.append("content", htmlText);
    formData.append("image", image);
    formData.append("meta_description", metaDescription);
    formData.append("OGP", OGP);
    formData.append("uniqueidentifier", uniqueIdentity);
    try {
      const response = await axios.post(URL + endpoints.ADD_POST, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log("AddPost response", response);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

export const getPostByID =
  (id, role, categoryid, courseid, token) => async (dispatch) => {
    // console.log("get post by id", id, role, categoryid);
    try {
      const response = await axios.get(
        `${URL}${endpoints.GET_POST_BY_ID}id=${id}&role=${role}&categoryid=${categoryid}&courseid=${courseid}`,
        {
          headers: {
            Authorization: "Bearar " + token,
          },
        }
      );
      // console.log(" getPostByID response", response);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

export const getPostByIDAccordian =
  (id, role, categoryid, courseid, token) => async (dispatch) => {
    // console.log("get post by id", id, role, categoryid, courseid);

    try {
      const response = await axios.get(
        URL +
          endpoints.GET_POST_BY_ID +
          id +
          "&" +
          role +
          "&" +
          categoryid +
          "&" +
          "courseid=" +
          courseid,
        {
          headers: {
            Authorization: "Bearar " + token,
          },
        }
      );
      // console.log(" getPostByID response", response);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

export const updatePost =
  (
    contentTitle,
    categoryId,
    tags,
    htmlText,
    image,
    contentId,
    metaDescription,
    OGP,
    token
  ) =>
  async (dispatch) => {
    const formData = new FormData();
    formData.append("title", contentTitle);
    formData.append("Categroyid", categoryId);
    formData.append("tags", tags);
    formData.append("content", htmlText);
    formData.append("image", image);
    formData.append("Postid", contentId);
    formData.append("meta_description", metaDescription);
    formData.append("OGP", OGP);
    try {
      const response = await axios.put(URL + endpoints.UPDATE_POST, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log("UpdatePost response", response);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

export const udateMetaTags = (metaDescrition, image) => async (dispatch) => {
  console.log("udateMetaTags metaDescrition, image ", metaDescrition, image);

  try {
    const repsonse = await axios.get(
      `https://dynamic-meta-tag.herokuapp.com/detailPage?meta=${metaDescrition}&img=${image}`
    );
    console.log("udateMetaTags response ", repsonse);
  } catch (error) {
    console.log(error);
  }
};
