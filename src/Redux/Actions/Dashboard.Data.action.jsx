import axios from "axios";
import { URL, endpoints } from "../../endpoints";

export const getDashboardData = (token) => async (dispatch) => {
  try {
    const response = await axios.get(URL + endpoints.DASHBOARD_DATA, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log("Get Dashboard Data Response", response);
    dispatch({
      type: "GET_DASHBOARD_DATA",
      payload: response?.data?.data,
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetDashboardDataWithAuthorization =
  (id, role, token) => async (dispatch) => {
    console.log("Get Dashboard Data With Authorization", id, role);
    try {
      const response = await axios.get(
        URL + endpoints.DASHBOARD_DATA_WITH_AUTHORIZATION + id + "&role=" + role,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Get authorized Dashboard Data Response", response);

      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
