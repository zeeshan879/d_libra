const initialState = {
  data: [],
};

export const dashboardData = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_DASHBOARD_DATA":
      return {
        ...state,
        data: payload,
      };
    default:
      return state;
  }
};
