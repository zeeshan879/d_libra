const initialState = {
  data: {},
};

export const viewRecentCourseStatus = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case "VIEW_RECENT_COURSE_STATUS_SUCCESS":
      return {
        ...state,
        data: payload,
      };

    default:
      return state;
  }
};
