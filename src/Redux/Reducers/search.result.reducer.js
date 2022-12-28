const initialState = {
  data: {},
};

export const searchResultData = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_SEARCH_RESULT_DATA":
      return {
        ...state,
        data: payload.data,
      };
    default:
      return state;
  }
};
