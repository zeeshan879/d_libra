import axios from "axios";
import { URL, endpoints } from "../../endpoints";
import * as FormData from "form-data";

export const topicsOfCourses = (id, role, token) => async (dispatch) => {
  console.log(id, role);
  try {
    const response = await axios.get(
      `${URL}${endpoints.GET_TOPICS_FROM_COURSE}?courseid=${id}&role=${role}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("TopicsOfCourses response", response);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const postFeedback =
  (topicid, feedback, role, token) => async (dispatch) => {
    // console.log(topicid, feedback, token)
    const formData = new FormData();
    formData.append("topicid", topicid);
    formData.append("opinion", feedback);
    try {
      const response = await axios.post(
        `${URL}${endpoints.ADD_FEEDBACK}?role=${role}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("TopicsOfCourses response", response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
