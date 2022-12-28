import axios from "axios";
import { useSelector } from "react-redux";
import { URL, endpoints } from "../../endpoints";
import * as FormData from "form-data";

export const signUp = (username, email, password) => async (dispatch) => {
  // console.log(username, email, password)
  const bodyFormData = new FormData();
  bodyFormData.append("email", email);
  bodyFormData.append("password", password);
  bodyFormData.append("username", username);

  try {
    const response = await axios.post(URL + endpoints.SIGNUP, bodyFormData);
    // console.log(response)
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const logIn =
  (email, password, userSettingState) => async (dispatch) => {
    // console.log("email, password", email, password)
    const bodyFormData = new FormData();
    bodyFormData.append("email", email);
    bodyFormData.append("password", password);
    try {
      const response = await axios.post(URL + endpoints.LOGIN, bodyFormData);
      // console.log(response)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          userId: response?.data?.data?.id,
          email: response?.data?.data?.email,
          username: response?.data?.data?.username,
          firstName: userSettingState?.firstName,
          lastName: userSettingState?.lastName,
          status: response?.data?.status,
          profile: response?.data?.data?.profile,
          token: response?.data?.token,
          role: response?.data?.data?.role,
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

export const logInWithGoogle =
  (email, user_id, displayName, userSettingState) => async (dispatch) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("ui", user_id);
    formData.append("displayName", displayName);
    try {
      const response = await axios.post(
        `${URL}${endpoints.GOOGLE_AUTH}`,
        formData
      );
      // console.log("logInWithGoogle response", response);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          userId: response?.data?.data?.id,
          email: response?.data?.data?.email,
          username: response?.data?.data?.username,
          firstName: userSettingState?.firstName,
          lastName: userSettingState?.lastName,
          status: response?.data?.status,
          profile: response?.data?.data?.profile,
          token: response?.data?.token,
          role: response?.data?.data?.role,
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

export const changePassword =
  (oldpassword, password, token) => async (dispatch) => {
    // console.log("changePassword", oldpassword, password, token);
    const formData = new FormData();
    formData.append("oldpassword", oldpassword);
    formData.append("password", password);
    try {
      const response = await axios.put(
        URL + endpoints.CHANGE_PASSWORD,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } catch (error) {}
  };

export const sendVerificationCode = (email, token) => async (dispatch) => {
  const formData = new FormData();
  formData.append("Email", email);
  try {
    const response = await axios.post(
      URL + endpoints.SEND_VERIFICATION_CODE,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("sendVerificationCode", response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const forgetPassword = (email, Code, token) => async (dispatch) => {
  // console.log(email, Code);
  const formData = new FormData();
  formData.append("Email", email);
  formData.append("Code", Code);
  try {
    const response = await axios.post(
      URL + endpoints.FORGOT_PASSWORD,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Forget Password Response", response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = (email, passowrd, token) => async (dispatch) => {
  const formData = new FormData();
  formData.append("Email", email);
  formData.append("Password", passowrd);
  try {
    const response = await axios.post(
      URL + endpoints.RESET_PASSWORD,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Forget Password Response", response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = (role, token) => async (dispatch) => {
  var config = {
    method: "post",
    url: "https://api.libraa.ml/webapi/logout?role=" + role,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios(config);
    console.log("logout", response);
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {
        userId: "",
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        status: "",
        profile: "",
        token: "",
        role: "",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {
        userId: "",
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        status: "",
        profile: "",
        token: "",
        role: "",
      },
    });
  }

  // axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //     dispatch({
  //       type: "LOGOUT_SUCCESS",
  //       payload: {
  //         userId: "",
  //         email: "",
  //         username: "",
  //         firstName: "",
  //         lastName: "",
  //         status: "",
  //         profile: "",
  //         token: "",
  //         role: "",
  //       },
  //     });
  //     return response;
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // console.log(role, URL + endpoints.LOGOUT );
  // try {
  //   const response = await axios.post(
  //     `${URL}${endpoints.LOGOUT}?role=${role}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   return response;
  // } catch (error) {
  //   console.log(error);
  // }
};

export const themeSwitch = (themestate) => async (dispatch) => {
  try {
    dispatch({
      type: "LIGHTTHEME",
      payload: {
        state: themestate,
      },
    });
  } catch (error) {}
};

export const creamyTheme = (themestate) => async (dispatch) => {
  try {
    dispatch({
      type: "LIGHTTHEME",
      payload: {
        state: themestate,
      },
    });
  } catch (error) {}
};

export const pinState = (pin) => async (dispatch) => {
  try {
    dispatch({
      type: "PINTHEME",
      payload: {
        state: pin,
      },
    });
  } catch (error) {}
};

export const searchState = (search) => async (dispatch) => {
  // console.log("SERAHC STATET ", search)
  try {
    dispatch({
      type: "SEARCHSTATE",
      payload: {
        state: search,
      },
    });
  } catch (error) {}
};
