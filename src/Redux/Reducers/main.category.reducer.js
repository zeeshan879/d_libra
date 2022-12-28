const initialState = {
  data: {},
};

export const mainCategoryData = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_MAIN_CATEGORY_DATA":
      return {
        ...state,
        data: payload.data,
      };
    default:
      return state;
  }
};
